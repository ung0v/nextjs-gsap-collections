import Link from 'next/link'

import projects from '../../../project'

export default function Projects() {
  return (
    <ul className="projects-list">
      {projects.map((project) => (
        <li key={project.id}>
          <div className="link">
            <span>&#8594;&nbsp;</span>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
