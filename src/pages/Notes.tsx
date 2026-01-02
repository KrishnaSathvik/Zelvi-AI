import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotes, NoteEntry } from '../hooks/useNotes'
import { trackEvent } from '../lib/analytics'
import VoiceInput from '../components/notes/VoiceInput'
import LoadingState from '../components/ui/LoadingState'
import Icon from '../components/ui/Icon'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'

export default function Notes() {
  const { user } = useAuth()
  const {
    noteEntries,
    isLoading,
    addNoteEntry,
    updateNoteEntry,
    deleteNoteEntry,
    addAIResponse,
    isAdding,
  } = useNotes(user?.id)
  
  const [noteInput, setNoteInput] = useState('')
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null)
  const aiInputRef = useRef<HTMLInputElement>(null)

  // Focus AI input when AI chat is shown
  useEffect(() => {
    if (showAIChat && aiInputRef.current) {
      aiInputRef.current.focus()
    }
  }, [showAIChat])

  // Focus note textarea when not editing and AI chat is off
  useEffect(() => {
    if (!editingId && !showAIChat && noteTextareaRef.current) {
      noteTextareaRef.current.focus()
    }
  }, [editingId, showAIChat])

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteInput.trim() || isAdding) return

    addNoteEntry(noteInput.trim())
    setNoteInput('')
    
    // Reset textarea height
    if (noteTextareaRef.current) {
      noteTextareaRef.current.style.height = 'auto'
    }
  }

  const handleVoiceTranscription = (text: string) => {
    if (showAIChat) {
      // If AI chat is open, add to AI input
      setAiInput((prev) => prev + (prev ? ' ' : '') + text)
      if (aiInputRef.current) {
        aiInputRef.current.focus()
      }
    } else {
      // Otherwise add to notes input
      setNoteInput((prev) => prev + (prev ? ' ' : '') + text)
      if (noteTextareaRef.current) {
        noteTextareaRef.current.focus()
      }
    }
    trackEvent('voice_transcription_used')
  }

  const handleAISend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || isAiLoading) return

    const message = aiInput.trim()
    
    // Add user question as a note entry
    addNoteEntry(`[Question] ${message}`)
    setAiInput('')
    setIsAiLoading(true)

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated')
      }

      // Get all notes content for context
      const notesContext = noteEntries.map(e => e.content).join('\n')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          action: 'chat',
          message,
          notes_content: notesContext,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get AI response')
      }

      const result = await response.json()
      if (result.success && result.data.response) {
        // Add AI response as a note entry
        addAIResponse(`[AI Response] ${result.data.response}`)
        trackEvent('ai_notes_message_sent')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response'
      addAIResponse(`[AI Error] ${errorMessage}`)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleEdit = (entry: NoteEntry) => {
    setEditingId(entry.id)
    setEditContent(entry.content)
  }

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      updateNoteEntry({ id: editingId, content: editContent.trim() })
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this note?')) {
      deleteNoteEntry(id)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-4xl mx-auto relative z-10">
          <PageHeader
            title="AI & Notes"
            description="Capture your thoughts and get AI insights"
          />
          <div className="mt-8 font-mono text-sm theme-text-main">Loading...</div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10">
          <PageHeader
            title="AI & Notes"
            description="Capture your thoughts and get AI insights"
            count={noteEntries.length}
          />

        {/* Notes Input Area */}
        <div className="border-2 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
        {!showAIChat ? (
          <form onSubmit={handleNoteSubmit} className="relative">
            <textarea
              ref={noteTextareaRef}
              value={noteInput}
              onChange={(e) => {
                setNoteInput(e.target.value)
                // Auto-resize textarea
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleNoteSubmit(e)
                }
              }}
              placeholder="Type your note here... (Press Enter to save, Shift+Enter for new line)"
              className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] p-4 sm:p-6 pr-24 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm sm:text-base leading-relaxed theme-bg-card theme-text-main"
              rows={12}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <VoiceInput onTranscription={handleVoiceTranscription} disabled={isAdding} />
              <button
                type="button"
                onClick={() => setShowAIChat(true)}
                className="p-3 border-2 hover:border-cyan-400 transition-colors theme-bg-card theme-border theme-text-main"
                title="Open AI Assistant"
              >
                <Icon name="comm-bot" size={20} />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAISend} className="relative">
            <div className="p-4 sm:p-6 border-b-2 flex items-center gap-2 theme-border">
              <Icon name="comm-bot" size={20} className="text-cyan-400" />
              <span className="font-mono text-sm font-semibold theme-text-main">AI Assistant</span>
              <button
                type="button"
                onClick={() => {
                  setShowAIChat(false)
                  setAiInput('')
                }}
                className="ml-auto p-2 border-2 hover:text-cyan-400 hover:border-cyan-400 transition-colors theme-border theme-text-main"
                title="Close AI Assistant"
              >
                <Icon name="sys-close" size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <input
                    ref={aiInputRef}
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about your notes..."
                    disabled={isAiLoading}
                    className="w-full px-4 py-3 pr-14 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-50 theme-bg-card theme-border theme-text-main"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceInput onTranscription={handleVoiceTranscription} disabled={isAiLoading} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isAiLoading || !aiInput.trim()}
                  className="px-6 py-3 bg-cyan-400 text-black border-2 theme-border font-bold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-hard shadow-hard-hover shadow-hard-active font-mono text-xs uppercase tracking-wider h-[48px]"
                >
                  {isAiLoading ? (
                    <LoadingState variant="spinner" size={16} color="#000" />
                  ) : (
                    'SEND'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

        {/* Saved Notes List */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">Saved Notes</h2>
        
        {noteEntries.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs p-6 border-2 theme-bg-form theme-border theme-text-main">
            <Icon name="cont-doc" size={32} className="mx-auto mb-3 opacity-50" />
            <p>No notes saved yet. Type above and press Enter to save your first note!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {noteEntries.map((entry) => {
              const isEditing = editingId === entry.id
              const isAI = entry.is_ai || false
              const isQuestion = entry.content.startsWith('[Question]')
              const isAIResponse = entry.content.startsWith('[AI Response]')
              const isAIError = entry.content.startsWith('[AI Error]')
              
              // Extract content without prefix
              const displayContent = entry.content
                .replace(/^\[Question\]\s*/, '')
                .replace(/^\[AI Response\]\s*/, '')
                .replace(/^\[AI Error\]\s*/, '')

              return (
                <div 
                  key={entry.id} 
                  className={`p-4 relative group border-2 theme-bg-form ${
                    isAIResponse ? 'border-cyan-400/50' : isQuestion ? 'border-blue-400/50' : 'theme-border'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => {
                            setEditContent(e.target.value)
                            // Auto-resize textarea
                            e.target.style.height = 'auto'
                            e.target.style.height = e.target.scrollHeight + 'px'
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && e.ctrlKey) {
                              e.preventDefault()
                              handleSaveEdit()
                            } else if (e.key === 'Escape') {
                              handleCancelEdit()
                            }
                          }}
                          className="w-full min-h-[200px] sm:min-h-[300px] p-4 border-2 font-mono text-sm sm:text-base focus:outline-none focus:border-cyan-400 resize-none leading-relaxed theme-bg-card theme-border theme-text-main"
                          rows={8}
                          autoFocus
                        />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-cyan-400 text-black border-2 font-mono text-xs uppercase hover:bg-cyan-300 theme-border"
                        >
                          Save (Ctrl+Enter)
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border-2 font-mono text-xs uppercase hover:border-cyan-400 theme-bg-card theme-border theme-text-main"
                        >
                          Cancel (Esc)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(isQuestion || isAIResponse || isAIError) && (
                        <div className="mb-2 flex items-center gap-2 text-xs font-mono opacity-75">
                          {isQuestion && <Icon name="comm-chat" size={14} />}
                          {isAIResponse && <Icon name="comm-bot" size={14} className="text-cyan-400" />}
                          {isAIError && <Icon name="stat-error" size={14} className="text-red-400" />}
                          <span>
                            {isQuestion && 'Question'}
                            {isAIResponse && 'AI Response'}
                            {isAIError && 'AI Error'}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap font-mono text-sm mb-2 theme-text-main">{displayContent}</p>
                      <div className="flex items-center justify-between text-xs font-mono opacity-75 gap-2">
                        <span className="flex-shrink-0">{formatDate(entry.created_at)} at {formatTime(entry.created_at)}</span>
                        {!isAI && !isQuestion && !isAIResponse && (
                          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="hover:text-cyan-400 active:text-cyan-400 flex items-center gap-1 px-2 py-1 hover:bg-cyan-400/10 rounded transition-colors"
                              aria-label="Edit note"
                            >
                              <Icon name="act-edit" size={14} />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="hover:text-red-400 active:text-red-400 flex items-center gap-1 px-2 py-1 hover:bg-red-400/10 rounded transition-colors"
                              aria-label="Delete note"
                            >
                              <Icon name="act-delete" size={14} />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </div>
      </div>
    </PageTransition>
  )
}
