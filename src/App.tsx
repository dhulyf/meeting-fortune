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
import './visual-refresh.css'

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
      settings.elderNicknameEnabled,
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
      <div className="app-brand">
        <span className="brand-name">不严谨研究所</span>
        <span className="brand-caption">UNRELIABLE RESEARCH LAB</span>
      </div>
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
              <div className="analyzer-copy">
                <div className="status">
                  玄学设备在线 · 理性暂时离线
                </div>

                <p className="eyebrow">
                  组会前，先迷信一小下
                </p>

                <h1>
                  组会气场
                  <span className="hero-title-accent">分析仪</span>
                </h1>

                <p className="description">
                  科学解释不了的，先交给随机数。
                  测一测导师注意力、PPT 生存状态，以及今天会不会喜提新任务。
                </p>

                <p className="operator-greeting">
                  {settings.elderNicknameEnabled
                    ? '二旬老人，你的玄学工位已就绪。'
                    : '你的玄学工位已就绪。'}
                </p>

                <button
                  type="button"
                  className="start-button"
                  onClick={runAnalysis}
                >
                  开始测算 <span aria-hidden="true">↗</span>
                </button>
                <p className="start-caption">测完该干嘛干嘛，天意也不查考勤。</p>

                <MeetingCountdown
                  value={settings.nextMeetingAt}
                  onChange={(next) =>
                    updateSettings({
                      ...settings,
                      nextMeetingAt: next,
                    })
                  }
                />
              </div>

              <div className="instrument-bay">
                <div className="instrument-nameplate">
                  <span>科研气场监测终端</span>
                  <span>MODEL · X-001</span>
                </div>
                <div className="instrument-display">
                  <span className="instrument-mode">随机数待命</span>
                  <button
                    type="button"
                    className="scanner"
                    aria-label="扫描仪"
                    onClick={handleScannerClick}
                  >
                    <span className="scanner-core">
                      <span className="scanner-readout">待机中</span>
                      <span className="scanner-readout-caption">等待科研人接入</span>
                    </span>
                  </button>
                  <p className="instrument-hint">点击仪器，听它一本正经地胡说八道</p>
                </div>
                <div className="instrument-channels">
                  <span>导师信道 <strong>未连接</strong></span>
                  <span>玄学模块 <strong className="channel-ready">已就绪</strong></span>
                </div>
              </div>
              <div className="analyzer-footer">
                <span><b>01</b> 校准科研气场</span>
                <span><b>02</b> 探测未知扰动</span>
                <span><b>03</b> 签收今日天意</span>
              </div>
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
