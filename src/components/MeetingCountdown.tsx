import {
  useEffect,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

interface MeetingCountdownProps {
  value: number | null
  onChange: (value: number | null) => void
}

const MINUTE = 60 * 1000

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function toInputValue(
  timestamp: number,
): string {
  const date = new Date(timestamp)

  const day = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')

  const time = [
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join(':')

  return `${day}T${time}`
}

function defaultDraft(): string {
  const date = new Date(
    Date.now() + 24 * 60 * MINUTE,
  )

  date.setMinutes(0, 0, 0)

  return toInputValue(date.getTime())
}

function formatRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / MINUTE)

  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor(
    (totalMinutes % 1440) / 60,
  )
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days} 天 ${hours} 小时`
  }

  if (hours > 0) {
    return `${hours} 小时 ${minutes} 分`
  }

  return `${Math.max(minutes, 0)} 分钟`
}

function getUrgencyQuip(ms: number): string {
  if (ms < 60 * MINUTE) {
    return '跑不掉了。'
  }

  if (ms < 6 * 60 * MINUTE) {
    return 'PPT 还开着吗？'
  }

  if (ms < 24 * 60 * MINUTE) {
    return '今晚别熬夜了。'
  }

  if (ms < 72 * 60 * MINUTE) {
    return '还有时间准备。'
  }

  return '暂时安全。'
}

function MeetingCountdown({
  value,
  onChange,
}: MeetingCountdownProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [now, setNow] = useState(0)

  useEffect(() => {
    let frameId = 0
    let intervalId = 0

    frameId = window.requestAnimationFrame(() => {
      setNow(Date.now())

      intervalId = window.setInterval(() => {
        setNow(Date.now())
      }, 30000)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearInterval(intervalId)
    }
  }, [])

  const handleOpen = () => {
    setDraft(
      value !== null
        ? toInputValue(value)
        : defaultDraft(),
    )

    setOpen(true)
  }

  const handleSave = () => {
    const parsed = new Date(draft).getTime()

    if (Number.isNaN(parsed)) {
      return
    }

    onChange(parsed)
    setOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setOpen(false)
  }

  const remaining =
    value !== null && now > 0
      ? value - now
      : null

  return (
    <>
      <button
        type="button"
        className="meeting-chip"
        onClick={handleOpen}
      >
        {remaining === null && (
          <>
            <span className="meeting-chip-key">
              组会倒计时
            </span>

            <span className="meeting-chip-value muted">
              点击设置下次组会时间
            </span>
          </>
        )}

        {remaining !== null && remaining <= 0 && (
          <>
            <span className="meeting-chip-key">
              组会倒计时
            </span>

            <span className="meeting-chip-value">
              这一场应该已经开完了
            </span>
          </>
        )}

        {remaining !== null && remaining > 0 && (
          <>
            <span className="meeting-chip-key">
              距下次组会
            </span>

            <span className="meeting-chip-value">
              {formatRemaining(remaining)}
            </span>

            <span className="meeting-chip-quip">
              {getUrgencyQuip(remaining)}
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="app-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="app-dialog"
              initial={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, y: 8 }}
              transition={{
                duration: 0.28,
                ease: 'easeOut',
              }}
            >
              <span className="app-eyebrow">
                组会时间
              </span>

              <h3>下次组会</h3>

              <p className="app-dialog-question">
                设好时间，首页会替你倒计时。
                这只是个本地提醒，不会通知任何人。
              </p>

              <input
                type="datetime-local"
                className="meeting-input"
                value={draft}
                onChange={(event) =>
                  setDraft(event.target.value)
                }
              />

              <div className="app-dialog-actions">
                <button
                  type="button"
                  className="ghost"
                  onClick={handleClear}
                >
                  清除
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MeetingCountdown
