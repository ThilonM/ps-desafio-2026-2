'use client'

import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import { SidebarMain } from './sidebar-main'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:grid md:grid-cols-[18rem_1fr]">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <LuX /> : <LuMenu />}
        </Button>
        <span className="font-semibold">Adapti</span>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] transition-transform duration-200 md:static md:z-auto md:w-auto md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <SidebarMain />
      </div>

      <div className="min-h-[calc(100vh-3.5rem)] md:h-screen md:overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
