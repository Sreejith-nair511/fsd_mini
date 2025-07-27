"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Plus, CheckCircle, Circle, Calendar, Award, BarChart3 } from "lucide-react"
import { useApp } from "@/components/providers"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function ProgressPage() {
  const { goals, setGoals, sessions } = useApp()
  const [newGoal, setNewGoal] = useState("")
  const [newDeadline, setNewDeadline] = useState("")

  const handleAddGoal = () => {
    if (!newGoal.trim()) return

    const goal = {
      id: Date.now(),
      title: newGoal,
      completed: false,
      deadline: newDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }

    setGoals([...goals, goal])
    setNewGoal("")
    setNewDeadline("")
  }

  const toggleGoal = (goalId: number) => {
    setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed } : goal)))
  }

  const completedGoals = goals.filter((goal) => goal.completed).length
  const totalGoals = goals.length
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  // Chart data
  const chartData = sessions.map((session) => ({
    date: new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sessions: session.sessions,
    hours: Math.round(session.sessions * 0.42 * 10) / 10, // 25min sessions
  }))

  const weeklyData = [
    { week: "Week 1", sessions: 28, goals: 3 },
    { week: "Week 2", sessions: 35, goals: 5 },
    { week: "Week 3", sessions: 42, goals: 4 },
    { week: "Week 4", sessions: 38, goals: 6 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Progress Tracker</h1>
        <p className="text-gray-300">Monitor your goals and study progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Goals Completed</p>
                <p className="text-2xl font-bold text-white">
                  {completedGoals}/{totalGoals}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={completionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">38 sessions</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-green-400 text-sm mt-2">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Study Hours</p>
                <p className="text-2xl font-bold text-white">15.8h</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-blue-400 text-sm mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Achievement</p>
                <p className="text-2xl font-bold text-white">Level 7</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/20">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-yellow-400 text-sm mt-2">Study Master</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Management */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Goal */}
            <div className="space-y-2">
              <Input
                placeholder="Add a new goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="glass-card border-white/20 text-white placeholder:text-gray-400"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="glass-card border-white/20 text-white"
                />
                <Button onClick={handleAddGoal} className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Goals List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg border transition-all ${
                    goal.completed ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toggleGoal(goal.id)}>
                      {goal.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <p className={`font-medium ${goal.completed ? "text-green-400 line-through" : "text-white"}`}>
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">{goal.deadline}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            goal.completed
                              ? "border-green-500/30 text-green-400"
                              : "border-yellow-500/30 text-yellow-400"
                          }`}
                        >
                          {goal.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Sessions Chart */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Daily Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Weekly Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.6)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="sessions" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goals" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-gray-400 text-sm">Study Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-400 text-sm">Goals Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Study Streak</h4>
                  <p className="text-gray-400 text-sm">7 days in a row!</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Goal Master</h4>
                  <p className="text-gray-400 text-sm">Completed 10 goals</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Focus Champion</h4>
                  <p className="text-gray-400 text-sm">50 hours studied</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
