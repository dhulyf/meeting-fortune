import {
  motion,
} from 'motion/react'
import AnimatedNumber from './AnimatedNumber'

import type { FortuneReport } from '../types/fortune'

interface ResultCardProps {
  report: FortuneReport
  onRetry: () => void
}

const itemTransition = {
  duration: 0.42,
  ease: 'easeOut' as const,
}

function ResultCard({
  report,
  onRetry,
}: ResultCardProps) {
  const {
    levelLabel,
    headline,
    specialEvent,
    oracleText,
    metrics,
    goodFor,
    avoid,
    actionAdvice,
    talisman,
  } = report

  return (
    <section className={`result-card fortune-${report.level}`}>
      <motion.p
        className="result-eyebrow"
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 0.05,
        }}
      >
        MEETING FORTUNE REPORT
      </motion.p>
{specialEvent && (
  <motion.div
    className={`special-event special-event-${specialEvent.type}`}
    initial={{
      opacity: 0,
      y: -8,
      scale: 0.98,
    }}
    animate={{
      opacity: 1,
      y: 0,
      scale: 1,
    }}
    transition={{
      duration: 0.5,
      delay: 0.12,
      ease: 'easeOut',
    }}
  >
    <span className="special-event-tag">
      {specialEvent.type === 'rare' &&
        'ANOMALY DETECTED'}

      {specialEvent.type === 'hidden' &&
        'UNKNOWN STATE'}

      {specialEvent.type === 'error' &&
        'SYSTEM ERROR'}

      {specialEvent.type === 'miracle' &&
        'EXTREMELY RARE EVENT'}
    </span>

    <strong>
      {specialEvent.title}
    </strong>

    <p>
      {specialEvent.message}
    </p>

    {specialEvent.note && (
      <small>
        {specialEvent.note}
      </small>
    )}
  </motion.div>
)}

      <motion.p
        className="result-label"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          ...itemTransition,
          delay: 0.12,
        }}
      >
        今日组会运势
      </motion.p>

      <motion.h2
        className="fortune-level"
        initial={{
          opacity: 0,
          y: 12,
          scale: 0.96,
          filter: 'blur(4px)',
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
        }}
        transition={{
          duration: 0.55,
          delay: 0.18,
          ease: 'easeOut',
        }}
      >
        {levelLabel}
      </motion.h2>

      <motion.h3
        className="fortune-headline"
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 0.42,
        }}
      >
        {headline}
      </motion.h3>

      <motion.p
        className="oracle-text"
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 0.56,
        }}
      >
        {oracleText}
      </motion.p>

      <div className="metrics-grid">
        <motion.div
          className="metric-item"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...itemTransition,
            delay: 0.72,
          }}
        >
          <span className="metric-name">
            导师关注度
          </span>

          <strong className="metric-value">
            <AnimatedNumber
              value={metrics.mentorAttention}
              suffix="%"
              delay={720}
            />          
          </strong>
        </motion.div>

        <motion.div
          className="metric-item"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...itemTransition,
            delay: 0.84,
          }}
        >
          <span className="metric-name">
            PPT 生存指数
          </span>

          <strong className="metric-value">
            <AnimatedNumber
              value={metrics.pptSurvival}
              delay={840}
            />
          </strong>
        </motion.div>

        <motion.div
          className="metric-item"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...itemTransition,
            delay: 0.96,
          }}
        >
          <span className="metric-name">
            新任务掉落率
          </span>

          <strong className="metric-value">
            <AnimatedNumber
              value={metrics.taskDropRate}
              suffix="%"
              delay={960}
            />
          </strong>
        </motion.div>
      </div>

      <motion.div
        className="fortune-details"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 1.12,
        }}
      >
        <div className="detail-row">
          <span className="detail-label">
            今日宜
          </span>

          <span>
            {goodFor}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            今日忌
          </span>

          <span>
            {avoid}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            科研护身符
          </span>

          <span>
            {talisman}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="advice-box"
        initial={{
          opacity: 0,
          x: -8,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 1.3,
        }}
      >
        <span className="advice-label">
          建议
        </span>

        <p>
          {actionAdvice}
        </p>
      </motion.div>

      <motion.button
        type="button"
        className="retry-button"
        onClick={onRetry}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          ...itemTransition,
          delay: 1.5,
        }}
        whileHover={{
          y: -1,
        }}
        whileTap={{
          scale: 0.99,
        }}
      >
        再估计一次
      </motion.button>
    </section>
  )
}

export default ResultCard