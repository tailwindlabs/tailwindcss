import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TailwindUniverse · v3 playground',
  description: 'A refined Tailwind CSS v3 playground surface.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full antialiased`}>{children}</body>
    </html>
  )
}
