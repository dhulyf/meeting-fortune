import HistoryDrawer from './components/HistoryDrawer'
import {
  getFortuneHistory,
  saveFortuneReport,
} from './storage/fortuneHistory'
import { useState } from 'react'
import {
  AnimatePresence,
  motion,
} from 'motion/react'

import './App.css'

import AnalysisProcess from './components/AnalysisProcess'
import ResultCard from './components/ResultCard'

import { generateFortune } from './engine/fortuneEngine'
import { buildFortuneReport } from './engine/reportEngine'

import type { FortuneReport } from './types/fortune'
import type { AppPhase } from './types/ui'
import {
  getTodayDrawCount,
  incrementTodayDrawCount,
} from './storage/drawState'

import {
  getDrawMessage,
} from './data/redrawMessages'


function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function App() {
  const [phase, setPhase] =
    useState<AppPhase>('idle')

  const [historyOpen, setHistoryOpen] =
  useState(false)

  const [report, setReport] =
    useState<FortuneReport | null>(null)

  const [history, setHistory] =
  useState<FortuneReport[]>(
    () => getFortuneHistory(),
  )

  const [drawCount, setDrawCount] =
    useState(() => getTodayDrawCount())

  const [drawMessage, setDrawMessage] =
    useState<string | null>(null)

  const runAnalysis = async () => {
  const nextDrawCount =
    incrementTodayDrawCount()

  setDrawCount(nextDrawCount)

  setDrawMessage(
    getDrawMessage(nextDrawCount),
  )

  const result =
  generateFortune()

  const newReport =
    buildFortuneReport(
      result,
      history,
    )

    setReport(newReport)

    const nextHistory =
      saveFortuneReport(
        newReport,
      )

    setHistory(nextHistory)

    setPhase('calibrating')
    await wait(1200)

    setPhase('scanning')
    await wait(2200)

    setPhase('revealing')
    await wait(1000)

    setPhase('result')
  }

  return (
    <main className="app">
<button
  type="button"
  className="history-trigger"
  onClick={() =>
    setHistoryOpen(true)
  }
>
  OBSERVATION LOG
</button>

<HistoryDrawer
  open={historyOpen}
  history={history}
  onClose={() =>
    setHistoryOpen(false)
  }
/>
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            className="phase-wrapper"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
          >
            <section className="analyzer">
              <div className="status">
                SYSTEM STANDBY
              </div>

              <p className="eyebrow">
                RESEARCH MEETING FIELD ANALYZER
              </p>

              <h1>
                组会气场分析仪
              </h1>

              <p className="description">
                对导师注意力、PPT 生存状态及未知科研风险进行非严格统计分析。
              </p>

              <div className="scanner">
                <div className="scanner-core">
                  STANDBY
                </div>
              </div>

              <button
                type="button"
                className="start-button"
                onClick={runAnalysis}
              >
                开始测算
              </button>

              <p className="disclaimer">
                Experimental system · Results for entertainment only
              </p>
            </section>
          </motion.div>
        )}

        {(phase === 'calibrating' ||
          phase === 'scanning' ||
          phase === 'revealing') && (
          <div className="phase-wrapper">
           <AnalysisProcess
              phase={phase}
              drawCount={drawCount}
              drawMessage={drawMessage}
            />
          </div>
        )}

        {phase === 'result' && report && (
          <motion.div
            key={`result-${report.id}`}
            className="phase-wrapper"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.98,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.99,
            }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
            }}
          >
            <ResultCard
              report={report}
              onRetry={runAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App