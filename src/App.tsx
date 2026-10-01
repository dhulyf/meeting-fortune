import HistoryDrawer from './components/HistoryDrawer'
import OfferingDrawer from './components/OfferingDrawer'
import MeetingCountdown from './components/MeetingCountdown'
import {
  getFortuneHistory,
  resetFortuneHistory,
  saveFortuneReport,
} from './storage/fortuneHistory'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
} from 'motion/react'

import './App.css'

import AnalysisProcess from './components/AnalysisProcess'
import ResultCard from './components/ResultCard'

import { generateFortune } from './engine/fortuneEngine'
import { buildFortuneReport } from './engine/reportEngine'
import {
  playReveal,
  playScan,
  playUnlock,
  setSoundEnabled,
} from './engine/sound'

import type { FortuneReport } from './types/fortune'
import type { AppPhase } from './types/ui'
import type { UserSettings } from './types/settings'
import type { AchievementId } from './data/achievements'
import {
  getTodayDrawCount,
  incrementTodayDrawCount,
  resetTodayDrawCount,
} from './storage/drawState'

import {
  resetOfferingState,
} from './storage/offeringState'

import {
  evaluateAchievements,
  getUnlockedIds,
  resetAchievements,
} from './storage/achievements'

import {
  getUserSettings,
  resetUserSettings,
  saveUserSettings,
} from './storage/userSettings'

import {
  getDrawMessage,
} from './data/redrawMessages'

import {
  getScannerQuip,
} from './data/scannerQuips'


function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const PHASE_MS = {
  calibrating: 1200,
  scanning: 2200,
  revealing: 1000,
} as const

const ANALYSIS_TOTAL_MS =
  PHASE_MS.calibrating +
  PHASE_MS.scanning +
  PHASE_MS.revealing

function App() {
  const [phase, setPhase] =
    useState<AppPhase>('idle')

  const [historyOpen, setHistoryOpen] =
  useState(false)

  const [offeringOpen, setOfferingOpen] =
  useState(false)

  const [settings, setSettings] =
    useState<UserSettings>(
      () => getUserSettings(),
    )

  const [toast, setToast] =
    useState<string | null>(null)

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

  const [achievements, setAchievements] =
    useState<AchievementId[]>(
      () => getUnlockedIds(),
    )

  const lastQuipRef = useRef<string | null>(
    null,
  )

  const reduceMotion =
    settings.animationLevel === 'reduced'

  const speed = reduceMotion ? 0.5 : 1

  useEffect(() => {
    setSoundEnabled(settings.soundEnabled)
  }, [settings.soundEnabled])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 2800)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast])

  const updateSettings = (
    next: UserSettings,
  ) => {
    setSettings(saveUserSettings(next))
  }

  /** 判定新解锁的成就，并提示 */
  const syncAchievements = () => {
    const unlocked = evaluateAchievements()

    if (unlocked.length === 0) {
      return
    }

    setAchievements(getUnlockedIds())
    playUnlock()

    setToast(
      `解锁成就：${unlocked
        .map((item) => item.name)
        .join(' / ')}`,
    )
  }

  const handleScannerClick = () => {
    const quip = getScannerQuip(
      lastQuipRef.current,
    )

    lastQuipRef.current = quip

    setToast(quip)
  }

  const handleResetLocalData = () => {
    resetFortuneHistory()
    resetTodayDrawCount()
    resetOfferingState()
    resetUserSettings()
    resetAchievements()

    setHistory([])
    setDrawCount(0)
    setDrawMessage(null)
    setReport(null)
    setPhase('idle')
    setSettings(getUserSettings())
    setAchievements([])
  }

  const runAnalysis = async () => {
  const nextDrawCount =
    incrementTodayDrawCount()

  setDrawCount(nextDrawCount)

  setDrawMessage(
    getDrawMessage(nextDrawCount, {
      darkHumorLevel:
        settings.darkHumorLevel,
      elderNicknameEnabled:
        settings.elderNicknameEnabled,
    }),
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

    playScan()

    setPhase('calibrating')
    await wait(PHASE_MS.calibrating * speed)

    setPhase('scanning')
    await wait(PHASE_MS.scanning * speed)

    setPhase('revealing')
    await wait(PHASE_MS.revealing * speed)

    setPhase('result')

    playReveal(newReport.level)
    syncAchievements()
  }

  return (
    <main
      className={`app${
        reduceMotion ? ' anim-reduced' : ''
      }`}
    >
      <div className="app-toolbar">
        <button
          type="button"
          className="history-trigger"
          onClick={() =>
            setHistoryOpen(true)
          }
        >
          天机档案
        </button>

        <button
          type="button"
          className="history-trigger offering-trigger"
          onClick={() =>
            setOfferingOpen(true)
          }
        >
          科研香火
        </button>
      </div>

<HistoryDrawer
  open={historyOpen}
  history={history}
  unlockedAchievements={achievements}
  onClose={() =>
    setHistoryOpen(false)
  }
/>

<OfferingDrawer
  open={offeringOpen}
  settings={settings}
  onClose={() =>
    setOfferingOpen(false)
  }
  onSettingsChange={updateSettings}
  onResetLocalData={handleResetLocalData}
  onNotify={setToast}
  onOfferingComplete={syncAchievements}
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

              <MeetingCountdown
                value={settings.nextMeetingAt}
                onChange={(next) =>
                  updateSettings({
                    ...settings,
                    nextMeetingAt: next,
                  })
                }
              />

              <button
                type="button"
                className="scanner"
                aria-label="扫描仪"
                onClick={handleScannerClick}
              >
                <span className="scanner-core">
                  STANDBY
                </span>
              </button>

              <button
                type="button"
                className="start-button"
                onClick={runAnalysis}
              >
                开始测算
              </button>
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
              duration={ANALYSIS_TOTAL_MS * speed}
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

      <AnimatePresence>
        {toast && (
          <motion.p
            className="app-toast"
            initial={{
              opacity: 0,
              y: 10,
              x: '-50%',
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: '-50%',
            }}
            exit={{
              opacity: 0,
              y: 6,
              x: '-50%',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
