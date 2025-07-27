"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, Timer, TrendingUp, Settings, Menu, X, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="glass-card h-full m-4 p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">StudyMate</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-semibold">JS</span>
                </div>
                <div>
                  <p className="text-white font-medium">John Student</p>
                  <p className="text-gray-400 text-sm">Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
