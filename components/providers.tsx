"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AppContextType {
  user: any
  setUser: (user: any) => void
  notes: any[]
  setNotes: (notes: any[]) => void
  goals: any[]
  setGoals: (goals: any[]) => void
  sessions: any[]
  setSessions: (sessions: any[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within Providers")
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "React Hooks",
      content: "useState, useEffect, useContext...",
      date: "2024-01-15",
      category: "Programming",
    },
    {
      id: 2,
      title: "Math Formulas",
      content: "Quadratic formula: x = (-b ± √(b²-4ac)) / 2a",
      date: "2024-01-14",
      category: "Mathematics",
    },
  ])
  const [goals, setGoals] = useState([
    { id: 1, title: "Complete React Course", completed: false, deadline: "2024-02-01" },
    { id: 2, title: "Study 25 hours this week", completed: true, deadline: "2024-01-21" },
  ])
  const [sessions, setSessions] = useState([
    { date: "2024-01-15", sessions: 8 },
    { date: "2024-01-14", sessions: 6 },
    { date: "2024-01-13", sessions: 4 },
    { date: "2024-01-12", sessions: 7 },
    { date: "2024-01-11", sessions: 5 },
  ])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        notes,
        setNotes,
        goals,
        setGoals,
        sessions,
        setSessions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
