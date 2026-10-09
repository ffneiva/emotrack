import { readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** 404.html: a mesma página, para o S3 responder 404 com o site. */
function estaticosPlugin(): Plugin {
  return {
    name: 'emotrack-estaticos',
    apply: 'build',
    enforce: 'post',
    generateBundle(_o, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') return
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: String(index.source).replace(/<title>[^<]*<\/title>/, '<title>Página não encontrada · Emotrack</title>'),
      })
    },
  }
}

/**
 * CSP por <meta>, só no build (o servidor de dev injeta script inline).
 * O site é servido direto pelo endpoint de website do S3, sem proxy na
 * frente para mandar cabeçalhos. Sem `upgrade-insecure-requests`: esse
 * endpoint só fala HTTP.
 */
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
function cspPlugin(): Plugin {
  return {
    name: 'emotrack-csp',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace(
        '<meta name="referrer"',
        `<meta http-equiv="Content-Security-Policy" content="${CSP}" />
    <meta name="referrer"`,
      ),
  }
}

/** O `vite preview` imitando o S3: o que não existe responde o 404.html com status 404. */
function previewComoOS3Plugin(): Plugin {
  return {
    name: 'emotrack-preview-s3',
    configurePreviewServer(servidor) {
      const dist = path.resolve(import.meta.dirname, 'dist')
      servidor.middlewares.use((req, res, next) => {
        const caminho = new URL(req.url ?? '/', 'http://x').pathname
        if (caminho === '/' || path.extname(caminho)) return next()
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(path.join(dist, '404.html')))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cspPlugin(), estaticosPlugin(), previewComoOS3Plugin()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
})
