import { useRef } from 'react'
import { useMotor } from '@/hooks/useMotor'
import { armarCenas } from '@/lib/cenas'
import { parallaxDeclarativo } from '@/lib/movimento'
import { Bilhetes } from './Bilhetes'
import { Ciencia } from './Ciencia'
import { Diario } from './Diario'
import { Duvidas } from './Duvidas'
import { Familias } from './Familias'
import { Fecho } from './Fecho'
import { Maia } from './Maia'
import { Manifesto } from './Manifesto'
import { Motivo } from './Motivo'
import { Plataforma } from './Plataforma'
import { Ponte } from './Ponte'
import { Rede } from './Rede'
import { Trajetoria } from './Trajetoria'

/**
 * Tudo depois do herói, num chunk só. A ordem alterna capítulos da cena
 * (transparentes, `data-3d`) e páginas opacas (`data-opaco`).
 */
export default function Resto() {
  const ref = useRef<HTMLDivElement>(null)
  useMotor(ref, (motor, raiz, calmo) => {
    if (calmo) return
    parallaxDeclarativo(motor, raiz)
    armarCenas(motor, raiz, !window.matchMedia('(min-width: 1024px)').matches)
  })
  return (
    <div ref={ref}>
      <Bilhetes />
      <Motivo />
      <Ponte />
      <Diario />
      <Familias />
      <Rede />
      <Plataforma />
      <Maia />
      <Manifesto />
      <Ciencia />
      <Trajetoria />
      <Duvidas />
      <Fecho />
    </div>
  )
}
