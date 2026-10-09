/** Os endereços oficiais da Emotrack (os mesmos do site atual). */
export const LINKS = {
  googlePlay: 'https://play.google.com/store/apps/details?id=br.com.emotrack.appemotrack&hl=pt_BR',
  plataforma: 'https://emotrack-app.web.app/',
  instagram: 'https://www.instagram.com/emotrackbr/',
  email: 'admin@emotrack.com.br',
  whatsapp: '5511946859805',
} as const

export const zap = (texto = 'Olá, Emotrack!') => `https://wa.me/${LINKS.whatsapp}?text=${encodeURIComponent(texto)}`
