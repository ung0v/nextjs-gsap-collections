'use client'

import { useEffect } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  useEffect(() => {
    if (window.innerWidth >= 900) {
      const lenis = new Lenis()
      const videoContainer = document.querySelector(
        '.video-container-desktop',
      ) as HTMLVideoElement
      const videoTitleElements = document.querySelectorAll('.video-title p')

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      const breakpoints = [
        { maxWidth: 1000, translateY: -135, movMultiplier: 450 },
        { maxWidth: 1100, translateY: -130, movMultiplier: 500 },
        { maxWidth: 1200, translateY: -125, movMultiplier: 550 },
        { maxWidth: 1300, translateY: -120, movMultiplier: 600 },
      ]

      const getInitialValues = () => {
        const width = window.innerWidth

        for (const bp of breakpoints) {
          if (width <= bp.maxWidth) {
            return {
              translateY: bp.translateY,
              movementMultiplier: bp.movMultiplier,
            }
          }
        }

        return {
          translateY: -105,
          movementMultiplier: 650,
        }
      }

      const initialValues = getInitialValues()

      const animationState = {
        scrollProgress: 0,
        initialTranslateY: initialValues.translateY,
        currentTranslateY: initialValues.translateY,
        movementMultiplier: initialValues.movementMultiplier,
        scale: 0.25,
        fontSize: 80,
        gap: 2,
        targetMouseX: 0,
        currentMouseX: 0,
      }

      window.addEventListener('resize', () => {
        const newValues = getInitialValues()
        animationState.initialTranslateY = newValues.translateY
        animationState.movementMultiplier = newValues.movementMultiplier

        if (animationState.scrollProgress === 0) {
          animationState.currentTranslateY = newValues.translateY
        }
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: '.intro',
          start: 'top bottom',
          end: 'top 10%',
          scrub: true,
          onUpdate: (self) => {
            animationState.scrollProgress = self.progress

            animationState.currentTranslateY = gsap.utils.interpolate(
              animationState.initialTranslateY,
              0,
              animationState.scrollProgress,
            )

            animationState.scale = gsap.utils.interpolate(
              0.25,
              1,
              animationState.scrollProgress,
            )

            animationState.gap = gsap.utils.interpolate(
              2,
              1,
              animationState.scrollProgress,
            )

            if (animationState.scrollProgress <= 0.4) {
              const firstPartProgress = animationState.scrollProgress / 0.4
              animationState.fontSize = gsap.utils.interpolate(
                80,
                40,
                firstPartProgress,
              )
            } else {
              const secondPartProgress =
                (animationState.scrollProgress - 0.4) / 0.6
              animationState.fontSize = gsap.utils.interpolate(
                40,
                20,
                secondPartProgress,
              )
            }
          },
        },
      })

      document.addEventListener('mousemove', (e) => {
        animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      })

      const animate = () => {
        console.log(22)
        if (window.innerWidth < 900) return
        const {
          scale,
          targetMouseX,
          currentMouseX,
          currentTranslateY,
          fontSize,
          gap,
          movementMultiplier,
        } = animationState

        const scaledMovementMultiplier = (1 - scale) * movementMultiplier

        const maxHorizontalMovement =
          scale < 0.95 ? targetMouseX * scaledMovementMultiplier : 0

        animationState.currentMouseX = gsap.utils.interpolate(
          currentMouseX,
          maxHorizontalMovement,
          0.05,
        )

        videoContainer.style.transform = `translateY(${currentTranslateY}%) translateX(${animationState.currentMouseX}px) scale(${scale})`

        videoContainer.style.gap = `${gap}em`

        videoTitleElements.forEach((element) => {
          ;(element as HTMLElement).style.fontSize = `${fontSize}px`
        })

        requestAnimationFrame(animate)
      }

      animate()
    }
  }, [])

  return (
    <>
      <nav>
        <div className="logo">
          <a href="#">Codegrid</a>
        </div>
        <div className="links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Videos</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      <section className="hero">
        <h1>Codegrid</h1>
        <div className="hero-copy">
          <p>One subscription, endless web design.</p>
          <p>(Scroll)</p>
        </div>
      </section>
      <section className="intro">
        <div className="video-container-desktop">
          <div className="video-preview">
            <div className="video-wrapper">
              <iframe
                src="https://player.vimeo.com/video/1027126039?background=1&autoplay=1&loop=1&muted=1&dnt=1&app_id=codegrid"
                frameBorder={0}
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
                loading="lazy"
                title="Codegrid video"
              />
            </div>
          </div>
          <div className="video-title">
            <p>PRO Showreel</p>
            <p>2023 - 2024</p>
          </div>
        </div>
        <div className="video-container-mobile">
          <div className="video-preview">
            <div className="video-wrapper">
              <iframe
                src="https://player.vimeo.com/video/1027126039?background=1&autoplay=1&loop=1&muted=1&dnt=1&app_id=codegrid"
                frameBorder={0}
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
                loading="lazy"
                title="Codegrid video"
              />
            </div>
          </div>
          <div className="video-title">
            <p>PRO Showreel</p>
            <p>2023 - 2024</p>
          </div>
        </div>
      </section>
      <section className="outro">
        <p>Delve into coding without clutter.</p>
      </section>
    </>
  )
}
