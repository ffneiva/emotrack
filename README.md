# Emotrack — proposta de site

Uma proposta de site para a [Emotrack](https://www.emotrack.com.br/), a
infraestrutura de dados emocionais do neurodesenvolvimento: app para famílias
de crianças com autismo, TDAH e outras neurodivergências e plataforma com IA
para profissionais.

A página conta uma história, "do caos à clareza". Centenas de peças de
quebra-cabeça em 3D (os mascotes das emoções do app, cada um com a sua cara)
ficam fixas atrás da página e se organizam a cada capítulo:

1. **Caos.** Peças soltas numa noite índigo; o mouse as empurra.
2. **Encaixe.** O quebra-cabeça montado, com um coração no meio.
3. **Ponte.** O arco do logotipo entre a casa e a terapia.
4. **Padrões.** A semana de uma criança em colunas de peças. No diário
   interativo, a pessoa registra uma emoção e a peça cai na coluna "Agora".
5. **Rede.** Família, escola e profissionais, com o histórico correndo entre eles.
6. **Maia.** Um anel de peças em volta de um núcleo de luz.
7. **Fecho.** O arco outra vez, com a chamada para começar.

Entre um capítulo e outro, páginas opacas mostram o app, o painel clínico, a
base científica, a trajetória e as dúvidas frequentes.

## Como funciona

- Vite, React 19, TypeScript e Tailwind 4.
- three.js com um `InstancedMesh` só para todas as peças. A cara de cada
  mascote (olhos que piscam, boca e bochechas) é desenhada no shader, a partir
  de um "humor" por instância, sem textura.
- `src/lib/capitulos.ts` é o contrato entre as seções (que marcam a posição com
  `data-s`) e a cena (`src/scene/pecas.ts`). As formações ficam em
  `src/scene/formacoes.ts`.
- GSAP com ScrollTrigger e Lenis, carregados sob demanda. Sem WebGL 2, a página
  continua completa; com "reduzir movimento", a cena roda em modo calmo.
- O formulário não tem servidor: ele monta a mensagem e abre o WhatsApp.

```bash
npm install
npm run dev
npm run build
```

As imagens vêm do site público da Emotrack (`npm run imagens`, a partir de uma
pasta local que não fica no repositório).

## Publicação

Um push na `main` publica no S3 (website hosting, com a Cloudflare na frente)
pelo GitHub Actions, com OIDC. Nenhuma credencial fica no repositório: o ARN
da role é um secret e o resto são variables do environment `production`.

---

Desenvolvido por [Felipe Neiva](https://github.com/ffneiva).
