'use client'

import { useEffect } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    document
      .querySelectorAll('.img:not([data-origin])')
      .forEach((img, index) => {
        img.setAttribute('data-origin', index % 2 === 0 ? 'left' : 'right')
      })

    gsap.set('.img', { scale: 0, force3D: true })

    const rows = document.querySelectorAll('.row')

    rows.forEach((row, index) => {
      const rowImages = row.querySelectorAll('.img')

      if (rowImages.length > 0) {
        row.id = `row-${index}`

        ScrollTrigger.create({
          id: `scaleIn-${index}`,
          trigger: row,
          start: 'top bottom',
          end: 'bottom bottom-=10%',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (self.isActive) {
              const progress = self.progress
              const easedProgress = Math.min(1, progress * 1.2)
              const scaleValue = gsap.utils.interpolate(0, 1, easedProgress)

              rowImages.forEach((img) => {
                gsap.set(img, {
                  scale: scaleValue,
                  force3D: true,
                })
              })

              if (progress > 0.95) {
                gsap.set(rowImages, { scale: 1, force3D: true })
              }
            }
          },
          onLeave: function () {
            gsap.set(rowImages, { scale: 1, force3D: true })
          },
        })

        ScrollTrigger.create({
          id: `scaleOut-${index}`,
          trigger: row,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: function () {
            gsap.set(rowImages, { scale: 1, force3D: true })
          },
          onUpdate: function (self) {
            if (self.isActive) {
              const scale = gsap.utils.interpolate(1, 0, self.progress)

              rowImages.forEach((img) => {
                gsap.set(img, {
                  scale: scale,
                  force3D: true,
                  clearProps: self.progress === 1 ? 'scale' : '',
                })
              })
            } else {
              const isAbove = self.scroll() < self.start
              if (isAbove) {
                gsap.set(rowImages, {
                  scale: 1,
                  force3D: true,
                })
              }
            }
          },
        })

        ScrollTrigger.create({
          id: `marker-${index}`,
          trigger: row,
          start: 'bottom bottom',
          end: 'top top',
          onEnter: function () {
            const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`)
            if (scaleOut && scaleOut.progress === 0) {
              gsap.set(rowImages, { scale: 1, force3D: true })
            }
          },
          onLeave: function () {
            const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`)
            if (scaleOut && scaleOut.progress === 0) {
              gsap.set(rowImages, { scale: 1, force3D: true })
            }
          },
          onEnterBack: function () {
            const scaleOut = ScrollTrigger.getById(`scaleOut-${index}`)
            if (scaleOut && scaleOut.progress === 0) {
              gsap.set(rowImages, { scale: 1, force3D: true })
            }
          },
        })
      }
    })

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh(true)
    })
  }, [])
  return (
    <>
      <section className="intro">
        <h1>Design that Captivates</h1>
        <p>( Explore Below )</p>
      </section>
      <section className="work">
        <div className="row">
          <div className="col">
            <div className="img" data-origin="right">
              <img src="./assets/img1.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img2.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
        </div>
        <div className="row">
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img3.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col" />
        </div>
        <div className="row">
          <div className="col">
            <div className="img" data-origin="right">
              <img src="./assets/img4.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img5.jpeg" alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img6.jpeg" alt="" />
            </div>
          </div>
          <div className="col">
            <div className="img" data-origin="right">
              <img src="./assets/img7.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
        </div>
        <div className="row">
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img8.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img9.jpeg" alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col" />
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img10.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
        </div>
        <div className="row">
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img11.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img12.jpeg" alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="img" data-origin="right">
              <img src="./assets/img13.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img14.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
        </div>
        <div className="row">
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img15.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col" />
        </div>
        <div className="row">
          <div className="col">
            <div className="img" data-origin="right">
              <img src="./assets/img16.jpeg" alt="" />
            </div>
          </div>
          <div className="col" />
          <div className="col" />
          <div className="col">
            <div className="img" data-origin="left">
              <img src="./assets/img17.jpeg" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="outro">
        <p>( Return to the Beginning )</p>
      </section>
    </>
  )
}
