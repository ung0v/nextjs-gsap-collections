'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import projects from '../../../../project'
import ProjectClient from './project-client'

export default function ProjectPage() {
  const params = useParams()
  const [projectData, setProjectData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = params?.slug

      if (!slug) {
        setLoading(false)
        return
      }

      const project = projects.find((p) => p.slug === slug)

      if (!project) {
        setLoading(false)
        return
      }

      const currentIndex = projects.findIndex((p) => p.slug === slug)
      const nextIndex = (currentIndex + 1) % projects.length
      const prevIndex = (currentIndex - 1 + projects.length) % projects.length

      const nextProject = projects[nextIndex]
      const prevProject = projects[prevIndex]

      setProjectData({
        project,
        nextProject,
        prevProject,
      })
      setLoading(false)
    }
  }, [params])

  if (loading) {
    return <div></div>
  }

  if (!projectData) {
    return <div>Project not found</div>
  }

  return (
    <ProjectClient
      project={projectData.project}
      nextProject={projectData.nextProject}
      prevProject={projectData.prevProject}
    />
  )
}
