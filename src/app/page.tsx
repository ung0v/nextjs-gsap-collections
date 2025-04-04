'use client'

import { useRef } from 'react'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ReactLenis } from 'lenis/react'
import SplitType from 'split-type'

gsap.registerPlugin(useGSAP)

export default function Home() {
  const container = useRef(null)

  useGSAP(
    () => {
      const heroText = new SplitType('.home h1', { types: 'chars' })
      gsap.set(heroText.chars, { y: 400 })

      gsap.to(heroText.chars, {
        y: 0,
        duration: 1,
        stagger: 0.075,
        ease: 'power4.out',
        delay: 1,
      })
    },
    { scope: container },
  )

  return (
    <ReactLenis root>
      <div className="home" ref={container}>
        <h1>Kaelon</h1>
      </div>
    </ReactLenis>
  )
}
