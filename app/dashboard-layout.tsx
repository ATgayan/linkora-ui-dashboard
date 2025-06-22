"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  Users2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/manage-users",
    icon: Users,
  },
  {
    title: "Manage Collaborations",
    href: "/manage-collaborations",
    icon: Users2,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Flag,
  },
  {
    title: "Audit Log",
    href: "/audit-log",
    icon: FileText,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { userEmail, logout } = useAuth()

  const handleNavigation = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router],
  )

  const isActive = useCallback(
    (path: string) => {
      return pathname === path
    },
    [pathname],
  )

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Linkora Admin
                  </span>
                </Link>
              </div>
              <nav className="flex-1 space-y-2 p-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Linkora Admin
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        <SidebarProvider defaultOpen>
          {/* Desktop Sidebar */}
          <Sidebar className="hidden border-r md:flex">
            <SidebarHeader className="border-b p-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Linkora Admin
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)}>
                            <Link href={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex flex-1 flex-col">
            {/* Desktop Top Navigation */}
            <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background px-6 md:flex">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search users, collaborations..." className="w-full pl-8" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="hidden text-left lg:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}

export default DashboardLayout
