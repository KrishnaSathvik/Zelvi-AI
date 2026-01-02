import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { trackEvent } from '../lib/analytics'

export interface NoteEntry {
  id: string
  content: string
  created_at: string
  updated_at: string
  is_ai?: boolean
}

export interface Note {
  id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

// Parse notes from JSON or legacy format
function parseNotes(content: string): NoteEntry[] {
  if (!content) return []
  
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    // Legacy format - single text content
    // Split by double newlines or treat as single entry
    if (content.trim()) {
      return [{
        id: 'legacy-1',
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_ai: false,
      }]
    }
  }
  
  return []
}

// Serialize notes to JSON
function serializeNotes(entries: NoteEntry[]): string {
  return JSON.stringify(entries)
}

export function useNotes(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data: note, isLoading } = useQuery({
    queryKey: ['notes', userId],
    queryFn: async (): Promise<Note | null> => {
      if (!userId) return null

      // Get the primary note (first one, or create if none exists)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) {
        throw error
      }
      return data
    },
    enabled: !!userId,
  })

  const noteEntries = note ? parseNotes(note.content) : []

  const addNoteEntry = useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error('User not authenticated')

      const newEntry: NoteEntry = {
        id: crypto.randomUUID(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_ai: false,
      }

      const updatedEntries = [...noteEntries, newEntry]
      const serialized = serializeNotes(updatedEntries)

      // Check if note exists
      const { data: existing, error: checkError } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (checkError) throw checkError

      if (existing) {
        // Update existing note
        const { data, error } = await supabase
          .from('notes')
          .update({ content: serialized, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            user_id: userId,
            content: serialized,
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      trackEvent('note_entry_added')
    },
  })

  const updateNoteEntry = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!userId) throw new Error('User not authenticated')

      const updatedEntries = noteEntries.map((entry) =>
        entry.id === id
          ? { ...entry, content: content.trim(), updated_at: new Date().toISOString() }
          : entry
      )

      const serialized = serializeNotes(updatedEntries)

      const { data: existing } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (!existing) throw new Error('Note not found')

      const { data, error } = await supabase
        .from('notes')
        .update({ content: serialized, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      trackEvent('note_entry_updated')
    },
  })

  const deleteNoteEntry = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')

      const updatedEntries = noteEntries.filter((entry) => entry.id !== id)
      const serialized = serializeNotes(updatedEntries)

      const { data: existing } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (!existing) throw new Error('Note not found')

      const { data, error } = await supabase
        .from('notes')
        .update({ content: serialized, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      trackEvent('note_entry_deleted')
    },
  })

  const addAIResponse = useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error('User not authenticated')

      const newEntry: NoteEntry = {
        id: crypto.randomUUID(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_ai: true,
      }

      const updatedEntries = [...noteEntries, newEntry]
      const serialized = serializeNotes(updatedEntries)

      const { data: existing } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (!existing) throw new Error('Note not found')

      const { data, error } = await supabase
        .from('notes')
        .update({ content: serialized, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] })
    },
  })

  return {
    note,
    noteEntries,
    isLoading,
    addNoteEntry: addNoteEntry.mutate,
    updateNoteEntry: updateNoteEntry.mutate,
    deleteNoteEntry: deleteNoteEntry.mutate,
    addAIResponse: addAIResponse.mutate,
    isAdding: addNoteEntry.isPending,
    isUpdating: updateNoteEntry.isPending,
    isDeleting: deleteNoteEntry.isPending,
  }
}
