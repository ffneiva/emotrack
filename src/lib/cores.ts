/**
 * As cores: as da marca (do logotipo) e as das emoções do app — cada
 * emoção é um mascote em forma de peça, com a cor e a cara dela.
 */

export const MARCA = {
  verde: '#156F46',
  vermelho: '#EB2831',
  azul: '#2D3690',
  ciano: '#03A0D7',
  amarelo: '#F5D054',
  roxo: '#6843E5',
  rosa: '#E6315B',
} as const

export type Emocao = {
  id: string
  nome: string
  cor: string
  /** A cara do mascote: −1 bem triste/bravo · 0 neutro · 1 sorriso largo. */
  humor: number
}

/** As seis emoções do relatório do app, na ordem dele. */
export const EMOCOES: readonly Emocao[] = [
  { id: 'calmo', nome: 'Calmo', cor: '#4FA9A6', humor: 0.55 },
  { id: 'feliz', nome: 'Feliz', cor: '#EEC65A', humor: 1 },
  { id: 'ansioso', nome: 'Ansioso', cor: '#DE8FB6', humor: -0.35 },
  { id: 'frustrado', nome: 'Frustrado', cor: '#8B69A9', humor: -0.7 },
  { id: 'cansado', nome: 'Cansado', cor: '#A3A6D6', humor: -0.15 },
  { id: 'raiva', nome: 'Com raiva', cor: '#DB6A44', humor: -1 },
]

/** As peças do arco do logotipo, da base esquerda até a ponta direita. */
export const ARCO = [MARCA.vermelho, MARCA.ciano, MARCA.amarelo, MARCA.verde, MARCA.vermelho, MARCA.azul, MARCA.amarelo]
