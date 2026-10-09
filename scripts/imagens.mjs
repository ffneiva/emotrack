/**
 * Gera as imagens do site a partir das fotos públicas do site da Emotrack.
 *
 *   · fotos → public/img/<slug>-<largura>.{avif,webp}
 *   · src/lib/imagens.gen.ts: dimensões + um placeholder de 24 px por imagem
 *
 *   node scripts/imagens.mjs <pasta das fotos>
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const ORIGEM = process.argv[2] ?? '_midia'
const OUT = path.join(RAIZ, 'public/img')
const LARGURAS = [480, 960, 1600]

/** slug → arquivo de origem. */
const FOTOS = {
  'mae-filho': 'img-02.jpg',
  menina: 'img-05.png',
  'evento-1': 'img-06.png',
  'evento-2': 'img-07.png',
  'evento-3': 'img-08.png',
  'evento-4': 'img-09.png',
  parceiros: 'img-14.jpg',
  'tela-inicio': 'tela-18.png',
  'tela-relatorios': 'tela-19.png',
}

const manifesto = {}

async function responsiva(slug, entrada) {
  const base = sharp(entrada, { limitInputPixels: false }).rotate()
  const { width: w, height: h } = await base.metadata()
  // As larguras menores que a original, e a original quando ela é menor que a maior.
  const usadas = LARGURAS.filter((l) => l < w)
  if (w <= LARGURAS[LARGURAS.length - 1]) usadas.push(w)
  // Fotos com transparência (a menina, as telas) continuam com alfa.
  for (const l of usadas) {
    const r = base.clone().resize(l)
    await r.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, `${slug}-${l}.avif`))
    await r.clone().webp({ quality: 74 }).toFile(path.join(OUT, `${slug}-${l}.webp`))
  }
  const lqip = await base.clone().resize(24).webp({ quality: 40 }).toBuffer()
  manifesto[slug] = { w, h, larguras: usadas, lqip: `data:image/webp;base64,${lqip.toString('base64')}` }
  console.log(`  ${slug}  ${w}×${h}  → ${usadas.join(', ')}`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  for (const [slug, arq] of Object.entries(FOTOS)) await responsiva(slug, path.join(ORIGEM, arq))

  // O og.jpg (prévia do link no WhatsApp e nas redes): a foto do banner atual.
  await sharp(path.join(ORIGEM, 'img-01.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(RAIZ, 'public/og.jpg'))

  const linhas = Object.entries(manifesto).map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`)
  await writeFile(
    path.join(RAIZ, 'src/lib/imagens.gen.ts'),
    `/* Gerado por scripts/imagens.mjs — não editar à mão. */\n\nexport type InfoImagem = { w: number; h: number; larguras: number[]; lqip: string }\n\nexport const IMAGENS = {\n${linhas.join('\n')}\n} satisfies Record<string, InfoImagem>\n\nexport type SlugImagem = keyof typeof IMAGENS\n`,
  )
  console.log('  → src/lib/imagens.gen.ts')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
