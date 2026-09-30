import {
  motion,
} from 'motion/react'
import AnimatedNumber from './AnimatedNumber'

import { fortuneLevels } from '../data/fortuneLevels'

import type { FortuneReport } from '../types/fortune'

interface ResultCardProps {
  report: FortuneReport
  onRetry: () => void
}

const itemTransition = {
  duration: 0.42,
  ease: 'easeOut' as const,
}

/* 刻度尺从左到右：凶 → 大吉 */
const scaleLevels = [...fortuneLevels].reverse()

function formatSerial(timestamp: number): string {
  const date = new Date(timestamp)

  const pad = (value: number) =>
    String(value).padStart(2, '0')

  const day = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('')

  const time = [
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join('')

  return `NO.${day}-${time}`
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

  const metricItems = [
    {
      key: 'mentor',
      name: '导师关注度',
      value: metrics.mentorAttention,
      suffix: '%',
      delay: 720,
    },
    {
      key: 'ppt',
      name: 'PPT 生存指数',
      value: metrics.pptSurvival,
      suffix: '',
      delay: 840,
    },
    {
      key: 'task',
      name: '新任务掉落率',
      value: metrics.taskDropRate,
      suffix: '%',
      delay: 960,
    },
  ]

  return (
    <section
      className={`result-card fortune-${report.level}`}
    >
      <div
        className="result-corners"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
      </div>

      <motion.div
        className="result-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.05,
        }}
      >
        <span className="result-meta-status">
          <span className="result-meta-dot" />

          MEETING FORTUNE REPORT
        </span>

        <span className="result-meta-serial">
          {formatSerial(report.timestamp)}
        </span>
      </motion.div>

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

      <div className="fortune-gauge">
        <motion.p
          className="result-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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

        <motion.div
          className="fortune-scale"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
        >
          {scaleLevels.map((item, index) => (
            <span
              key={item.level}
              className={
                item.level === report.level
                  ? 'fortune-scale-item active'
                  : 'fortune-scale-item'
              }
            >
              <motion.span
                className="fortune-scale-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.46 + index * 0.05,
                  ease: 'easeOut',
                }}
              />

              <span className="fortune-scale-label">
                {item.label}
              </span>
            </span>
          ))}
        </motion.div>
      </div>

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
          delay: 0.62,
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
          delay: 0.74,
        }}
      >
        {oracleText}
      </motion.p>

      <div className="metrics-grid">
        {metricItems.map((item, index) => (
          <motion.div
            className="metric-item"
            key={item.key}
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
              delay: 0.86 + index * 0.12,
            }}
          >
            <span className="metric-name">
              {item.name}
            </span>

            <strong className="metric-value">
              <AnimatedNumber
                value={item.value}
                suffix={item.suffix}
                delay={item.delay}
              />
            </strong>

            <span className="metric-meter">
              <motion.span
                className="metric-meter-fill"
                initial={{ width: 0 }}
                animate={{
                  width: `${item.value}%`,
                }}
                transition={{
                  duration: 0.85,
                  delay: (item.delay + 60) / 1000,
                  ease: 'easeOut',
                }}
              />
            </span>
          </motion.div>
        ))}
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
          delay: 1.28,
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
          delay: 1.44,
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
          delay: 1.6,
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
