'use client'

import {
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavLink,
  SidebarNavLinkLabel,
  SidebarFooter,
  SidebarHeaderLogo,
  UserDropdown,
} from '@/components/dashboard/sidebar'
import {
  LuClipboard,
  LuHome,
  LuListChecks,
  LuLogOut,
  LuUsers,
} from 'react-icons/lu'
import { DropdownMenuItem } from '@/components/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import logo from '@/assets/img/logo.jpeg'

export function SidebarMain() {
  const session = useSession()
  const user = session?.data?.user

  return (
    <Sidebar>
      <SidebarHeader href="/admin">
        <SidebarHeaderLogo src={logo} alt="Logo Adapti" />
        <SidebarHeaderTitle>Adapti</SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarNav>
        <SidebarNavLink href="/admin">
          <LuHome />
          <SidebarNavLinkLabel>Início</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/membros">
          <LuUsers />
          <SidebarNavLinkLabel>Membros</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/projetos">
          <LuClipboard />
          <SidebarNavLinkLabel>Projetos</SidebarNavLinkLabel>
        </SidebarNavLink>
        <SidebarNavLink href="/admin/tarefas">
          <LuListChecks />
          <SidebarNavLinkLabel>Tarefas</SidebarNavLinkLabel>
        </SidebarNavLink>
      </SidebarNav>
      <SidebarFooter>
        <UserDropdown name={user?.name} email={user?.email} src={user?.image}>
          <DropdownMenuItem onClick={async () => await signOut()}>
            <LuLogOut className="mr-3 h-3 w-3" />
            Sair
          </DropdownMenuItem>
        </UserDropdown>
      </SidebarFooter>
    </Sidebar>
  )
}
