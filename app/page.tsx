import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, Target, TrendingUp, Calendar, Award, Flame, BookOpen } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John! 👋</h1>
        <p className="text-gray-300">Ready to boost your productivity today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">7 days</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Sessions</p>
                <p className="text-2xl font-bold text-white">5 / 8</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Notes Created</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Goals Completed</p>
                <p className="text-2xl font-bold text-white">12 / 15</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full glass-button justify-start" variant="ghost">
              <Clock className="h-4 w-4 mr-2" />
              Start Pomodoro Session
            </Button>
            <Button className="w-full glass-button justify-start" variant="ghost">
              <FileText className="h-4 w-4 mr-2" />
              Create New Note
            </Button>
            <Button className="w-full glass-button justify-start" variant="ghost">
              <Target className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
            <Button className="w-full glass-button justify-start" variant="ghost">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Progress
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="text-white font-medium">React Hooks</h4>
              <p className="text-gray-400 text-sm">useState, useEffect, useContext...</p>
              <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="text-white font-medium">Math Formulas</h4>
              <p className="text-gray-400 text-sm">Quadratic formula: x = (-b ± √(b²-4ac)) / 2a</p>
              <p className="text-gray-500 text-xs mt-1">1 day ago</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <h4 className="text-white font-medium">Study Schedule</h4>
              <p className="text-gray-400 text-sm">Weekly planning and time blocks...</p>
              <p className="text-gray-500 text-xs mt-1">2 days ago</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Morning Study Session</p>
                <p className="text-gray-400 text-sm">9:00 AM - 11:00 AM</p>
              </div>
              <span className="text-green-500 text-sm font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-white font-medium">React Project Work</p>
                <p className="text-gray-400 text-sm">2:00 PM - 4:00 PM</p>
              </div>
              <span className="text-blue-500 text-sm font-medium">In Progress</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Math Review</p>
                <p className="text-gray-400 text-sm">7:00 PM - 8:30 PM</p>
              </div>
              <span className="text-gray-500 text-sm font-medium">Upcoming</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
