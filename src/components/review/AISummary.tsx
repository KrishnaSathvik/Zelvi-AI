import { WeeklyReview } from '../../hooks/useWeeklyReview'

interface AISummaryProps {
  review: WeeklyReview | null
  onGenerate: () => void
  isGenerating: boolean
}

export default function AISummary({ review, onGenerate, isGenerating }: AISummaryProps) {
  const hasAISummary = review?.ai_summary && review.ai_focus_points && review.ai_focus_points.length > 0

  return (
    <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-mono uppercase theme-text-main">AI Weekly Summary</h2>
        {!hasAISummary && (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Summary'}
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="font-mono text-xs py-8 text-center theme-text-main">
          <div 
            className="inline-block animate-spin h-8 w-8 border-2 border-t-cyan-400 mb-2 theme-border"
          ></div>
          <div>Generating your weekly summary...</div>
        </div>
      )}

      {hasAISummary && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium font-mono text-xs uppercase mb-2 theme-text-main">Summary</h3>
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap theme-text-main">{review.ai_summary}</p>
          </div>
          {review.ai_focus_points && review.ai_focus_points.length > 0 && (
            <div>
              <h3 className="text-sm font-medium font-mono text-xs uppercase mb-2 theme-text-main">Focus Points</h3>
              <ul className="space-y-2">
                {review.ai_focus_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="font-mono text-sm theme-text-main">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!hasAISummary && !isGenerating && (
        <div className="font-mono text-xs text-center py-8 space-y-2 theme-text-main">
          <div>Generate AI insights based on your stats and reflection.</div>
          <div className="opacity-70 text-xs">
            AI will identify patterns, suggest improvements, and provide actionable recommendations.
          </div>
        </div>
      )}
    </div>
  )
}

