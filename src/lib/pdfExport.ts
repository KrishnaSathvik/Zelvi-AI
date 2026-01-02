import jsPDF from 'jspdf'

interface ExportData {
  user_id: string
  exported_at: string
  user_profile: any
  jobs: any[]
  recruiters: any[]
  learning_logs: any[]
  projects: any[]
  content_posts: any[]
  daily_custom_tasks: any[]
  daily_task_status: any[]
  goals: any[]
  weekly_reviews: any[]
  activity_log: any[]
}

export async function generatePDF(data: ExportData): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Helper to add new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPos = margin
    }
  }

  // Add logo (if available)
  try {
    const logoUrl = '/logo.png'
    const response = await fetch(logoUrl)
    if (response.ok) {
      const blob = await response.blob()
      const reader = new FileReader()
      const logoData = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      
      const img = new Image()
      await new Promise((resolve) => {
        img.onload = () => {
          try {
            const logoWidth = 40
            const logoHeight = (img.height / img.width) * logoWidth
            doc.addImage(logoData, 'PNG', margin, yPos, logoWidth, logoHeight)
            yPos += logoHeight + 10
          } catch (error) {
            // If logo fails, just continue without it
          }
          resolve(null)
        }
        img.onerror = () => resolve(null)
        img.src = logoData
      })
    }
  } catch (error) {
    // Continue without logo if it fails to load
  }

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Zelvi AI - Data Export', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Export date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const exportDate = new Date(data.exported_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Exported on: ${exportDate}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 20

  // User Profile
  if (data.user_profile) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Profile Information', margin, yPos)
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (data.user_profile.name) {
      doc.text(`Name: ${data.user_profile.name}`, margin + 5, yPos)
      yPos += 7
    }
    yPos += 5
  }

  // Jobs
  if (data.jobs && data.jobs.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Job Applications (${data.jobs.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.jobs.slice(0, 20).forEach((job, idx) => {
      checkNewPage(15)
      doc.setFont('helvetica', 'bold')
      doc.text(`${idx + 1}. ${job.company_name || 'Unknown Company'}`, margin + 5, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      if (job.position) {
        doc.text(`   Position: ${job.position}`, margin + 5, yPos)
        yPos += 5
      }
      if (job.status) {
        doc.text(`   Status: ${job.status}`, margin + 5, yPos)
        yPos += 5
      }
      if (job.applied_date) {
        const date = new Date(job.applied_date).toLocaleDateString()
        doc.text(`   Applied: ${date}`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 3
    })
    if (data.jobs.length > 20) {
      doc.text(`   ... and ${data.jobs.length - 20} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Recruiters
  if (data.recruiters && data.recruiters.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Recruiters (${data.recruiters.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.recruiters.slice(0, 15).forEach((recruiter, idx) => {
      checkNewPage(12)
      doc.text(`${idx + 1}. ${recruiter.name || 'Unknown'}`, margin + 5, yPos)
      yPos += 5
      if (recruiter.company) {
        doc.text(`   Company: ${recruiter.company}`, margin + 5, yPos)
        yPos += 5
      }
      if (recruiter.email) {
        doc.text(`   Email: ${recruiter.email}`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 2
    })
    if (data.recruiters.length > 15) {
      doc.text(`   ... and ${data.recruiters.length - 15} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Projects (${data.projects.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.projects.slice(0, 15).forEach((project, idx) => {
      checkNewPage(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`${idx + 1}. ${project.name || 'Untitled Project'}`, margin + 5, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      if (project.status) {
        doc.text(`   Status: ${project.status}`, margin + 5, yPos)
        yPos += 5
      }
      if (project.description) {
        const desc = project.description.substring(0, 80)
        doc.text(`   ${desc}${project.description.length > 80 ? '...' : ''}`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 2
    })
    if (data.projects.length > 15) {
      doc.text(`   ... and ${data.projects.length - 15} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Goals
  if (data.goals && data.goals.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Goals (${data.goals.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.goals.slice(0, 15).forEach((goal, idx) => {
      checkNewPage(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`${idx + 1}. ${goal.title || 'Untitled Goal'}`, margin + 5, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      if (goal.target_date) {
        const date = new Date(goal.target_date).toLocaleDateString()
        doc.text(`   Target: ${date}`, margin + 5, yPos)
        yPos += 5
      }
      if (goal.status) {
        doc.text(`   Status: ${goal.status}`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 2
    })
    if (data.goals.length > 15) {
      doc.text(`   ... and ${data.goals.length - 15} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Learning Logs
  if (data.learning_logs && data.learning_logs.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Learning Activities (${data.learning_logs.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.learning_logs.slice(0, 15).forEach((log, idx) => {
      checkNewPage(12)
      doc.text(`${idx + 1}. ${log.title || 'Untitled'}`, margin + 5, yPos)
      yPos += 5
      if (log.date) {
        const date = new Date(log.date).toLocaleDateString()
        doc.text(`   Date: ${date}`, margin + 5, yPos)
        yPos += 5
      }
      if (log.duration_minutes) {
        doc.text(`   Duration: ${log.duration_minutes} minutes`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 2
    })
    if (data.learning_logs.length > 15) {
      doc.text(`   ... and ${data.learning_logs.length - 15} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Content Posts
  if (data.content_posts && data.content_posts.length > 0) {
    checkNewPage(30)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Content Posts (${data.content_posts.length})`, margin, yPos)
    yPos += 10
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    data.content_posts.slice(0, 15).forEach((post, idx) => {
      checkNewPage(12)
      doc.text(`${idx + 1}. ${post.title || 'Untitled'}`, margin + 5, yPos)
      yPos += 5
      if (post.platform) {
        doc.text(`   Platform: ${post.platform}`, margin + 5, yPos)
        yPos += 5
      }
      if (post.posted_date) {
        const date = new Date(post.posted_date).toLocaleDateString()
        doc.text(`   Posted: ${date}`, margin + 5, yPos)
        yPos += 5
      }
      yPos += 2
    })
    if (data.content_posts.length > 15) {
      doc.text(`   ... and ${data.content_posts.length - 15} more`, margin + 5, yPos)
      yPos += 5
    }
    yPos += 5
  }

  // Summary stats
  checkNewPage(40)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', margin, yPos)
  yPos += 10
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const stats = [
    `Total Jobs: ${data.jobs?.length || 0}`,
    `Total Recruiters: ${data.recruiters?.length || 0}`,
    `Total Projects: ${data.projects?.length || 0}`,
    `Total Goals: ${data.goals?.length || 0}`,
    `Total Learning Activities: ${data.learning_logs?.length || 0}`,
    `Total Content Posts: ${data.content_posts?.length || 0}`,
  ]
  
  stats.forEach((stat) => {
    doc.text(stat, margin + 5, yPos)
    yPos += 6
  })

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save PDF
  const fileName = `zelvi-export-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

