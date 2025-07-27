import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudyMate - Student Productivity App",
  description: "Your ultimate study companion with Pomodoro timer, notes, and progress tracking",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <Sidebar />
            <main className="lg:ml-64 min-h-screen">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
