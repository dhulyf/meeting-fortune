import {
  useEffect,
  useState,
} from 'react'

import { motion } from 'motion/react'

import type { AppPhase } from '../types/ui'

interface AnalysisProcessProps {
  phase: Exclude<AppPhase, 'idle' | 'result'>
  drawCount: number
  drawMessage: string | null
  duration: number
}

interface PhaseContent {
  status: string
  title: string
  description: string
}

const phaseContent: Record<
  Exclude<AppPhase, 'idle' | 'result'>,
  PhaseContent
> = {
  calibrating: {
    status: 'SYSTEM CALIBRATION',
    title: '正在校准科研气场',
    description: '初始化组会环境参数，并尝试建立导师注意力链路。',
  },

  scanning: {
    status: 'CHANNEL PROBING',
    title: '正在估计导师注意力信道',
    description: '同步分析 PPT 生存状态、新任务掉落风险及未知科研扰动。',
  },

  revealing: {
    status: 'ANALYSIS COMPLETE',
    title: '测算完成',
    description: '正在解码本次组会状态，请保持科研场稳定。',
  },
}

/* 进度刻度：每 5% 一格，用来体现细颗粒度 */
const TICK_COUNT = 20

const progressTicks = Array.from(
  { length: TICK_COUNT },
  (_, index) =>
    ((index + 1) * 100) / TICK_COUNT,
)

function AnalysisProcess({
  phase,
  drawCount,
  drawMessage,
  duration,
}: AnalysisProcessProps) {
  const content = phaseContent[phase]

  const [progress, setProgress] =
    useState(0)

  useEffect(() => {
    let frameId = 0
    let startTime: number | null = null

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now
      }

      const elapsed = now - startTime

      const ratio = Math.min(
        elapsed / duration,
        1,
      )

      // 前快后慢：先冲到大部分进度，尾部放缓
      const eased =
        1 - Math.pow(1 - ratio, 2.2)

      setProgress(eased * 100)

      if (ratio < 1) {
        frameId =
          window.requestAnimationFrame(tick)
      }
    }

    frameId =
      window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [duration])

  const displayProgress =
    Math.round(progress)

  return (
    <section className="analysis-process">
      <div className="process-status-row">
        <span className="process-live-dot" />

        <p className="process-status">
          {content.status}
        </p>
      </div>

      <div className={`process-scanner phase-${phase}`}>
        <div className="scanner-ring scanner-ring-outer" />
        <div className="scanner-ring scanner-ring-middle" />
        <div className="scanner-ring scanner-ring-inner" />

        <div className="scan-beam" />

        <div className="scanner-crosshair scanner-crosshair-x" />
        <div className="scanner-crosshair scanner-crosshair-y" />

        <div className="process-scanner-inner">
          <span className="process-readout">
            {displayProgress}%
          </span>

          <small>
            SIGNAL LOCK
          </small>
        </div>
      </div>

      <h2 className="process-title">
        {content.title}
      </h2>

      <p className="process-description">
        {content.description}
      </p>

      {drawMessage && (
        <motion.p
          className="redraw-message"
          initial={{
            opacity: 0,
            y: 4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.15,
          }}
        >
          {drawMessage}
        </motion.p>
      )}

      {drawCount > 1 && (
        <div className="draw-counter">
          OBSERVATION #{drawCount}
        </div>
      )}

      <div className="process-progress">
        <div
          className="process-progress-bar"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div
        className="process-progress-ticks"
        aria-hidden="true"
      >
        {progressTicks.map((tick) => (
          <span
            key={tick}
            className={
              progress >= tick ? 'active' : ''
            }
          />
        ))}
      </div>

      <div className="process-steps">
        <div
          className={
            phase === 'calibrating'
              ? 'process-step active'
              : 'process-step done'
          }
        >
          CALIBRATE
        </div>

        <div
          className={
            phase === 'scanning'
              ? 'process-step active'
              : phase === 'revealing'
                ? 'process-step done'
                : 'process-step'
          }
        >
          PROBE
        </div>

        <div
          className={
            phase === 'revealing'
              ? 'process-step active'
              : 'process-step'
          }
        >
          DECODE
        </div>
      </div>
    </section>
  )
}

export default AnalysisProcess
