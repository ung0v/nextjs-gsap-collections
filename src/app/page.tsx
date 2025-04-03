'use client'

import React, { useEffect, useRef } from 'react'

import * as THREE from 'three'

const ThreeJsSlider = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xe3e3db)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.z = 5

    const settings = {
      wheelSensitivity: 0.01,
      touchSensitivity: 0.01,
      momentumMultiplier: 2,
      smoothing: 0.1,
      slideLerp: 0.075,
      distortionDecay: 0.95,
      maxDistortion: 2.5,
      distortionSensitivity: 0.15,
      distortionSmoothing: 0.075,
    }

    const slideWidth = 3.0
    const slideHeight = 1.5
    const gap = 0.1
    const slideCount = 10
    const imagesCount = 5
    const totalWidth = slideCount * (slideWidth + gap)
    const slideUnit = slideWidth + gap

    const slides = []
    let currentPosition = 0
    let targetPosition = 0
    let isScrolling = false
    let autoScrollSpeed = 0
    let lastTime = 0
    let touchStartX = 0
    let touchLastX = 0
    let prevPosition = 0

    let currentDistortionFactor = 0
    let targetDistortionFactor = 0
    let peakVelocity = 0
    let velocityHistory = [0, 0, 0, 0, 0]

    const correctImageColor = (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    }

    const createSlide = (index) => {
      const geometry = new THREE.PlaneGeometry(slideWidth, slideHeight, 32, 16)

      const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3']
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colors[index % colors.length]),
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = index * (slideWidth + gap)
      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        index,
      }

      const imageIndex = (index % imagesCount) + 1
      const imagePath = `/img${imageIndex}.jpg`

      new THREE.TextureLoader().load(
        imagePath,
        (texture) => {
          correctImageColor(texture)
          material.map = texture
          material.color.set(0xffffff)
          material.needsUpdate = true

          const imgAspect = texture.image.width / texture.image.height
          const slideAspect = slideWidth / slideHeight

          if (imgAspect > slideAspect) {
            mesh.scale.y = slideAspect / imgAspect
          } else {
            mesh.scale.x = imgAspect / slideAspect
          }
        },
        undefined,
        (err) => console.warn(`Couldn't load image ${imagePath}`, err),
      )

      scene.add(mesh)
      slides.push(mesh)
    }

    for (let i = 0; i < slideCount; i++) {
      createSlide(i)
    }

    slides.forEach((slide) => {
      slide.position.x -= totalWidth / 2
      slide.userData.targetX = slide.position.x
      slide.userData.currentX = slide.position.x
    })

    const updateCurve = (mesh, worldPositionX, distortionFactor) => {
      const distortionCenter = new THREE.Vector2(0, 0)
      const distortionRadius = 2.0
      const maxCurvature = settings.maxDistortion * distortionFactor

      const positionAttribute = mesh.geometry.attributes.position
      const originalVertices = mesh.userData.originalVertices

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalVertices[i * 3]
        const y = originalVertices[i * 3 + 1]

        const vertexWorldPosX = worldPositionX + x
        const distFromCenter = Math.sqrt(
          Math.pow(vertexWorldPosX - distortionCenter.x, 2) +
            Math.pow(y - distortionCenter.y, 2),
        )

        const distortionStrength = Math.max(
          0,
          1 - distFromCenter / distortionRadius,
        )
        const curveZ =
          Math.pow(Math.sin((distortionStrength * Math.PI) / 2), 1.5) *
          maxCurvature

        positionAttribute.setZ(i, curveZ)
      }

      positionAttribute.needsUpdate = true
      mesh.geometry.computeVertexNormals()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        targetPosition += slideUnit
        targetDistortionFactor = Math.min(1.0, targetDistortionFactor + 0.3)
      } else if (e.key === 'ArrowRight') {
        targetPosition -= slideUnit
        targetDistortionFactor = Math.min(1.0, targetDistortionFactor + 0.3)
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      const wheelStrength = Math.abs(e.deltaY) * 0.001
      targetDistortionFactor = Math.min(
        1.0,
        targetDistortionFactor + wheelStrength,
      )

      targetPosition -= e.deltaY * settings.wheelSensitivity
      isScrolling = true
      autoScrollSpeed =
        Math.min(Math.abs(e.deltaY) * 0.0005, 0.05) * Math.sign(e.deltaY)

      clearTimeout(window.scrollTimeout)
      window.scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 150)
    }

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchLastX = touchStartX
      isScrolling = false
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touchX = e.touches[0].clientX
      const deltaX = touchX - touchLastX
      touchLastX = touchX

      const touchStrength = Math.abs(deltaX) * 0.02
      targetDistortionFactor = Math.min(
        1.0,
        targetDistortionFactor + touchStrength,
      )

      targetPosition -= deltaX * settings.touchSensitivity
      isScrolling = true
    }

    const handleTouchEnd = () => {
      const velocity = (touchLastX - touchStartX) * 0.005
      if (Math.abs(velocity) > 0.5) {
        autoScrollSpeed = -velocity * settings.momentumMultiplier * 0.05
        targetDistortionFactor = Math.min(
          1.0,
          Math.abs(velocity) * 3 * settings.distortionSensitivity,
        )
        isScrolling = true
        setTimeout(() => {
          isScrolling = false
        }, 800)
      }
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('resize', handleResize)

    const animate = (time) => {
      const animationId = requestAnimationFrame(animate)

      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016
      lastTime = time

      const prevPos = currentPosition

      if (isScrolling) {
        targetPosition += autoScrollSpeed
        const speedBasedDecay = 0.97 - Math.abs(autoScrollSpeed) * 0.5
        autoScrollSpeed *= Math.max(0.92, speedBasedDecay)

        if (Math.abs(autoScrollSpeed) < 0.001) {
          autoScrollSpeed = 0
        }
      }

      currentPosition += (targetPosition - currentPosition) * settings.smoothing

      const currentVelocity = Math.abs(currentPosition - prevPos) / deltaTime
      velocityHistory.push(currentVelocity)
      velocityHistory.shift()

      const avgVelocity =
        velocityHistory.reduce((sum, val) => sum + val, 0) /
        velocityHistory.length

      if (avgVelocity > peakVelocity) {
        peakVelocity = avgVelocity
      }

      const velocityRatio = avgVelocity / (peakVelocity + 0.001)
      const isDecelerating = velocityRatio < 0.7 && peakVelocity > 0.5

      peakVelocity *= 0.99

      const movementDistortion = Math.min(1.0, currentVelocity * 0.1)
      if (currentVelocity > 0.05) {
        targetDistortionFactor = Math.max(
          targetDistortionFactor,
          movementDistortion,
        )
      }

      if (isDecelerating || avgVelocity < 0.2) {
        const decayRate = isDecelerating
          ? settings.distortionDecay
          : settings.distortionDecay * 0.9
        targetDistortionFactor *= decayRate
      }

      currentDistortionFactor +=
        (targetDistortionFactor - currentDistortionFactor) *
        settings.distortionSmoothing

      slides.forEach((slide, i) => {
        let baseX = i * slideUnit - currentPosition
        baseX = ((baseX % totalWidth) + totalWidth) % totalWidth

        if (baseX > totalWidth / 2) {
          baseX -= totalWidth
        }

        const isWrapping =
          Math.abs(baseX - slide.userData.targetX) > slideWidth * 2
        if (isWrapping) {
          slide.userData.currentX = baseX
        }

        slide.userData.targetX = baseX
        slide.userData.currentX +=
          (slide.userData.targetX - slide.userData.currentX) *
          settings.slideLerp

        const wrapThreshold = totalWidth / 2 + slideWidth
        if (Math.abs(slide.userData.currentX) < wrapThreshold * 1.5) {
          slide.position.x = slide.userData.currentX
          updateCurve(slide, slide.position.x, currentDistortionFactor)
        }
      })

      renderer.render(scene, camera)
    }

    const animationId = requestAnimationFrame(animate)

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)

      // Dispose of Three.js resources
      slides.forEach((slide) => {
        slide.geometry.dispose()
        slide.material.dispose()
        if (slide.material.map) slide.material.map.dispose()
        scene.remove(slide)
      })
      renderer.dispose()
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
      }}
    />
  )
}

export default ThreeJsSlider
