import { supabase } from './supabase'

export interface ActivityLog {
  event_type: string
  description: string
  event_date: string // ISO date string
  metadata?: Record<string, any>
}

/**
 * Generic activity logger
 */
export async function logActivity(
  userId: string,
  eventType: string,
  description: string,
  eventDate: Date,
  metadata?: Record<string, any>
): Promise<{ error: any }> {
  const { error } = await supabase.from('activity_log').insert({
    user_id: userId,
    event_type: eventType,
    description,
    event_date: eventDate.toISOString().split('T')[0],
    metadata: metadata || null,
  })

  return { error }
}

/**
 * Log learning creation
 */
export async function logLearningCreated(
  userId: string,
  learningLog: { topic: string; minutes: number; category: string; date: string }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'learning_created',
    `Learning: ${learningLog.topic} (${learningLog.minutes} min) [${learningLog.category}]`,
    new Date(learningLog.date)
  )
}

/**
 * Log task completion
 */
export async function logTaskCompleted(
  userId: string,
  taskKey: string,
  taskLabel: string
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'task_completed',
    `Completed task: ${taskLabel}`,
    new Date(),
    { task_key: taskKey }
  )
}

/**
 * Log job creation
 */
export async function logJobCreated(
  userId: string,
  job: { role: string; company: string; applied_date: string }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'job_created',
    `Applied to ${job.role} @ ${job.company}`,
    new Date(job.applied_date)
  )
}

/**
 * Log job status update
 */
export async function logJobStatusUpdated(
  userId: string,
  job: { role: string; company: string; oldStatus: string; newStatus: string }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'job_status_updated',
    `Job ${job.role} @ ${job.company} moved to ${job.newStatus}`,
    new Date(),
    { old_status: job.oldStatus, new_status: job.newStatus }
  )
}

/**
 * Log recruiter contact
 */
export async function logRecruiterContacted(
  userId: string,
  recruiter: {
    name: string
    platform: string
    role?: string
    last_contact_date: string
  }
): Promise<{ error: any }> {
  const roleText = recruiter.role ? ` for ${recruiter.role}` : ''
  return logActivity(
    userId,
    'recruiter_contacted',
    `Contacted recruiter ${recruiter.name} (${recruiter.platform})${roleText}`,
    new Date(recruiter.last_contact_date)
  )
}

/**
 * Log project creation
 */
export async function logProjectCreated(
  userId: string,
  project: {
    name: string
  }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'project_created',
    `Started project ${project.name}`,
    new Date()
  )
}

/**
 * Log project status update
 */
export async function logProjectStatusUpdated(
  userId: string,
  project: {
    name: string
    oldStatus: string
    newStatus: string
  }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'project_status_updated',
    `Project ${project.name} moved to ${project.newStatus}`,
    new Date(),
    { old_status: project.oldStatus, new_status: project.newStatus }
  )
}

/**
 * Log project action update
 */
export async function logProjectActionUpdated(
  userId: string,
  project: {
    name: string
  }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'project_action_updated',
    `Updated next action for ${project.name}`,
    new Date()
  )
}

/**
 * Log content creation
 */
export async function logContentCreated(
  userId: string,
  content: {
    platform: string
    date: string
  }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'content_created',
    `Content planned: ${content.platform}`,
    new Date(content.date)
  )
}

/**
 * Log content published
 */
export async function logContentPublished(
  userId: string,
  content: {
    platform: string
    title: string
    date: string
  }
): Promise<{ error: any }> {
  return logActivity(
    userId,
    'content_published',
    `Published content on ${content.platform}: ${content.title}`,
    new Date(content.date)
  )
}

