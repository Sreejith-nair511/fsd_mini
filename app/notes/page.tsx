"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Save, X, FileText, Calendar, Tag } from "lucide-react"
import { useApp } from "@/components/providers"

export default function NotesPage() {
  const { notes, setNotes } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "" })

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNewNote = () => {
    setEditForm({ title: "", content: "", category: "" })
    setSelectedNote(null)
    setIsEditing(true)
  }

  const handleEditNote = (note: any) => {
    setEditForm({ title: note.title, content: note.content, category: note.category })
    setSelectedNote(note)
    setIsEditing(true)
  }

  const handleSaveNote = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) return

    if (selectedNote) {
      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === selectedNote.id ? { ...note, ...editForm, date: new Date().toISOString().split("T")[0] } : note,
        ),
      )
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        ...editForm,
        date: new Date().toISOString().split("T")[0],
      }
      setNotes([newNote, ...notes])
    }

    setIsEditing(false)
    setSelectedNote(null)
    setEditForm({ title: "", content: "", category: "" })
  }

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const categories = [...new Set(notes.map((note) => note.category))]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notes</h1>
            <p className="text-gray-300">Organize your thoughts and ideas</p>
          </div>
          <Button
            onClick={handleNewNote}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="bg-purple-500/20 text-purple-300">
                {category}
              </Badge>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={`glass-card border-0 cursor-pointer transition-all hover:scale-105 ${
                  selectedNote?.id === note.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium truncate">{note.title}</h3>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditNote(note)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNote(note.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">{note.content}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {note.category}
                    </Badge>
                    <span className="text-gray-500">{note.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Note Editor/Viewer */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-0 h-[700px]">
            {isEditing ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">{selectedNote ? "Edit Note" : "New Note"}</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNote} className="bg-gradient-to-r from-green-500 to-blue-500">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false)
                        setSelectedNote(null)
                      }}
                      className="glass-button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 h-full">
                  <Input
                    placeholder="Note title..."
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="glass-card border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Input
                    placeholder="Category (e.g., Programming, Math, etc.)"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="glass-card border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Textarea
                    placeholder="Write your note here..."
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="glass-card border-white/20 text-white placeholder:text-gray-400 min-h-[400px] resize-none"
                  />
                </CardContent>
              </>
            ) : selectedNote ? (
              <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedNote.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Tag className="h-4 w-4" />
                        {selectedNote.category}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        {selectedNote.date}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleEditNote(selectedNote)} className="glass-button" variant="ghost">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedNote.content}</p>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No note selected</h3>
                  <p className="text-gray-500 mb-4">Select a note to view or create a new one</p>
                  <Button onClick={handleNewNote} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Note
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
