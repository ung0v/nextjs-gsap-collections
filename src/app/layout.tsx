import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'

import Nav from './_components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'NextJS GSAP Collections',
  description: 'A collections was inspired by the internet.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ViewTransitions>
  )
}
