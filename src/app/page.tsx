import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="home">
      <div className="link">
        <span>&#8594;</span>
        <Link href="/projects">All Projects</Link>
      </div>
    </div>
  )
}
