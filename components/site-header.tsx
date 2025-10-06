"use client"

import { usePathname, useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationCenter } from "@/components/notification-center"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/dashboard/patients")) return "Patients"
    if (pathname.startsWith("/dashboard/treatments")) return "Treatments"
    if (pathname.startsWith("/dashboard/appointments")) return "Appointments"
    if (pathname.startsWith("/dashboard/invoices")) return "Invoices"
    if (pathname.startsWith("/dashboard/settings")) return "Settings"
    return "Dashboard"
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.back()}
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
        <div className="ml-auto">
          <NotificationCenter />
        </div>
      </div>
    </header>
  )
}
