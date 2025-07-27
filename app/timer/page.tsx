"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Volume2, VolumeX } from "lucide-react"

export default function TimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [sessionType, setSessionType] = useState<"work" | "break">("work")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const workDuration = 25 * 60 // 25 minutes
  const breakDuration = 5 * 60 // 5 minutes
  const totalTime = sessionType === "work" ? workDuration : breakDuration

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Session completed
      if (sessionType === "work") {
        setSessionsCompleted((prev) => prev + 1)
        setSessionType("break")
        setTimeLeft(breakDuration)
      } else {
        setSessionType("work")
        setTimeLeft(workDuration)
      }
      setIsActive(false)

      // Play notification sound (placeholder)
      if (soundEnabled) {
        console.log("🔔 Session completed!")
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, sessionType, soundEnabled])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(sessionType === "work" ? workDuration : breakDuration)
  }

  const switchSession = (type: "work" | "break") => {
    setIsActive(false)
    setSessionType(type)
    setTimeLeft(type === "work" ? workDuration : breakDuration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((totalTime - timeLeft) / totalTime) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Timer</h1>
            <p className="text-gray-300">Stay focused and productive</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Sessions: {sessionsCompleted}
            </Badge>
            <Button variant="ghost" size="icon" className="glass-button" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                {/* Session Type Selector */}
                <div className="flex gap-2">
                  <Button
                    variant={sessionType === "work" ? "default" : "ghost"}
                    className={sessionType === "work" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "glass-button"}
                    onClick={() => switchSession("work")}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Work
                  </Button>
                  <Button
                    variant={sessionType === "break" ? "default" : "ghost"}
                    className={sessionType === "break" ? "bg-gradient-to-r from-green-500 to-blue-500" : "glass-button"}
                    onClick={() => switchSession("break")}
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Break
                  </Button>
                </div>

                {/* Circular Progress */}
                <div className="relative">
                  <svg className="timer-circle w-64 h-64" viewBox="0 0 250 250">
                    {/* Background circle */}
                    <circle cx="125" cy="125" r="120" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    {/* Progress circle */}
                    <circle
                      cx="125"
                      cy="125"
                      r="120"
                      stroke={sessionType === "work" ? "#a855f7" : "#10b981"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="progress-ring"
                      style={{
                        filter: isActive ? "drop-shadow(0 0 10px currentColor)" : "none",
                      }}
                    />
                  </svg>

                  {/* Timer display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-bold text-white ${isActive ? "pulse-glow" : ""}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-gray-400 text-lg mt-2 capitalize">{sessionType} Session</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={toggleTimer}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
                  >
                    {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isActive ? "Pause" : "Start"}
                  </Button>
                  <Button size="lg" variant="ghost" onClick={resetTimer} className="glass-button px-8">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Settings */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sessions Completed</span>
                <span className="text-white font-semibold">{sessionsCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Focus Time</span>
                <span className="text-white font-semibold">
                  {Math.floor((sessionsCompleted * 25) / 60)}h {(sessionsCompleted * 25) % 60}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-white font-semibold">7 days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((sessionsCompleted / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm text-center">
                {Math.max(8 - sessionsCompleted, 0)} sessions to daily goal
              </p>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Work Duration</span>
                <span className="text-white">25 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Break Duration</span>
                <span className="text-white">5 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Long Break</span>
                <span className="text-white">15 min</span>
              </div>
              <Button className="w-full glass-button mt-4" variant="ghost">
                Customize Settings
              </Button>
            </CardContent>
          </Card>

          {/* Motivational Quote */}
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <blockquote className="text-white text-center italic">
                "The way to get started is to quit talking and begin doing."
              </blockquote>
              <p className="text-gray-400 text-center text-sm mt-2">- Walt Disney</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
