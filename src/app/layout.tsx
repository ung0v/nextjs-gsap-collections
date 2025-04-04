import type { Metadata } from 'next'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
