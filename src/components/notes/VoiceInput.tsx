import { useState, useRef, useEffect } from 'react'
import Icon from '../ui/Icon'
import { supabase } from '../../lib/supabase'

interface VoiceInputProps {
  onTranscription: (text: string) => void
  disabled?: boolean
}

export default function VoiceInput({ onTranscription, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1]

        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64')
        }

        // Get auth token
        const { data: session } = await supabase.auth.getSession()
        if (!session?.session?.access_token) {
          throw new Error('Not authenticated')
        }

        // Call transcription endpoint
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            action: 'transcribe',
            audio_base64: base64Audio,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Transcription failed')
        }

        const result = await response.json()
        if (result.success && result.data.text) {
          onTranscription(result.data.text)
        } else {
          throw new Error('No transcription received')
        }
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      alert('Failed to transcribe audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else if (!disabled && !isProcessing) {
      startRecording()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`p-2 border-2 transition-all ${
        isRecording
          ? 'bg-red-500 text-white border-red-600 animate-pulse'
          : isProcessing
            ? 'bg-yellow-500 text-black border-yellow-600'
            : 'hover:border-cyan-400'
      } disabled:opacity-50 disabled:cursor-not-allowed ${!isRecording && !isProcessing ? 'theme-bg-card theme-border theme-text-main' : ''}`}
      title={isRecording ? 'Stop recording' : isProcessing ? 'Processing...' : 'Start voice input'}
    >
      <Icon
        name={isRecording ? 'comm-microphone' : isProcessing ? 'stat-warning' : 'comm-microphone'}
        size={16}
        className={isProcessing ? 'animate-spin' : ''}
      />
    </button>
  )
}

