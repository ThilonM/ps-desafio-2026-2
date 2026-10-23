import type { Metadata } from 'next'
import { AdminShell } from './_components/admin-shell'

export const metadata: Metadata = {
  title: 'Painel administrativo',
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AdminShell>{children}</AdminShell>
}
