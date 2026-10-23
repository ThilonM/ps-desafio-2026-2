import type { Metadata } from 'next'
import { Arimo } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/providers/providers'
import { Toaster as SonnerToaster } from '@/components/sonner'
import { Toaster } from '@/components/toaster'

const arimo = Arimo({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adapti — Gestão de Projetos',
  description: 'Sistema de gestão de projetos e membros da Adapti',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={arimo.className}>
        <Providers>
          {children}
          <SonnerToaster />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
