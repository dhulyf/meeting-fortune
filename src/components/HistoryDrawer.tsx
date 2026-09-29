import {
  AnimatePresence,
  motion,
} from 'motion/react'

import type {
  FortuneReport,
} from '../types/fortune'

interface HistoryDrawerProps {
  open: boolean
  history: FortuneReport[]
  onClose: () => void
}

function formatTime(
  timestamp: number,
): string {
  const date = new Date(timestamp)

  return date.toLocaleTimeString(
    'zh-CN',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  )
}

function HistoryDrawer({
  open,
  history,
  onClose,
}: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="history-backdrop"
            aria-label="关闭历史记录"
            onClick={onClose}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          />

          <motion.aside
            className="history-drawer"
            initial={{
              x: '100%',
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: '100%',
            }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
          >
            <div className="history-header">
              <div>
                <span className="history-eyebrow">
                  OBSERVATION LOG
                </span>

                <h2>
                  天机档案
                </h2>
              </div>

              <button
                type="button"
                className="history-close"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            {history.length === 0 ? (
              <div className="history-empty">
                暂无观测记录。
              </div>
            ) : (
              <div className="history-list">
                {history.map(
                  (item, index) => (
                    <article
                      className="history-item"
                      key={item.id}
                    >
                      <div className="history-item-top">
                        <span>
                          #
                          {String(
                            history.length -
                              index,
                          ).padStart(
                            2,
                            '0',
                          )}
                        </span>

                        <time>
                          {formatTime(
                            item.timestamp,
                          )}
                        </time>
                      </div>

                      <div className="history-result-row">
                        <strong>
                          {item.levelLabel}
                        </strong>

                        <span>
                          {item.headline}
                        </span>
                      </div>

                      <div className="history-metrics">
                        <span>
                          导师{' '}
                          {
                            item.metrics
                              .mentorAttention
                          }
                          %
                        </span>

                        <span>
                          PPT{' '}
                          {
                            item.metrics
                              .pptSurvival
                          }
                        </span>

                        <span>
                          任务{' '}
                          {
                            item.metrics
                              .taskDropRate
                          }
                          %
                        </span>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default HistoryDrawer