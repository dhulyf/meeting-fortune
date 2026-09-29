import { motion } from 'motion/react'

import type { AppPhase } from '../types/ui'

interface AnalysisProcessProps {
  phase: Exclude<AppPhase, 'idle' | 'result'>
  drawCount: number
  drawMessage: string | null
}

interface PhaseContent {
  status: string
  title: string
  description: string
  progress: number
}

const phaseContent: Record<
  Exclude<AppPhase, 'idle' | 'result'>,
  PhaseContent
> = {
  calibrating: {
    status: 'SYSTEM CALIBRATION',
    title: '正在校准科研气场',
    description: '初始化组会环境参数，并尝试建立导师注意力链路。',
    progress: 28,
  },

  scanning: {
    status: 'CHANNEL PROBING',
    title: '正在估计导师注意力信道',
    description: '同步分析 PPT 生存状态、新任务掉落风险及未知科研扰动。',
    progress: 67,
  },

  revealing: {
    status: 'ANALYSIS COMPLETE',
    title: '测算完成',
    description: '正在解码本次组会状态，请保持科研场稳定。',
    progress: 100,
  },
}

function AnalysisProcess({
  phase,
  drawCount,
  drawMessage,
}: AnalysisProcessProps) {
  const content = phaseContent[phase]

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
          <motion.span
            key={content.progress}
            initial={{
              opacity: 0,
              scale: 0.86,
              y: 4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
          >
            {content.progress}%
          </motion.span>

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
        <motion.div
          className="process-progress-bar"
          initial={false}
          animate={{
            width: `${content.progress}%`,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        />
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