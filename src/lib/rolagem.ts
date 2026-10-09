/**
 * O capítulo contínuo da rolagem, para quem não é a cena.
 *
 * O palco calcula `s` a cada rolagem (é ele quem lê os `data-s`) e avisa
 * aqui; quem acompanha a cena escuta sem recalcular nada e sem re-render.
 */
type Ouvinte = (s: number) => void
const ouvintes = new Set<Ouvinte>()
let atual = 0

export function publicarCapitulo(s: number) {
  atual = s
  for (const o of ouvintes) o(s)
}

export function ouvirCapitulo(o: Ouvinte): () => void {
  ouvintes.add(o)
  o(atual)
  return () => ouvintes.delete(o)
}
