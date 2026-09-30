import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'motion/react'

import {
  addOffering,
  getOfferingState,
  hasSeenOfferingIntro,
  markOfferingIntroSeen,
} from '../storage/offeringState'

import {
  fakeVerifyFields,
  fakeVerifyIntro,
  fakeVerifyNote,
  fakeVerifySubmit,
  getBalanceCopy,
  getOfferingFeedback,
  getOfferingPhaseLabel,
  getOfferingTier,
  offeringDeclineMessage,
  offeringDisclaimer,
  offeringIntro,
  offeringPackages,
  offeringPaymentMethods,
  resetConfirmItems,
  resetSuccessMessage,
  titleEasterEgg,
} from '../data/offeringCopy'

import type {
  DarkHumorLevel,
  OfferingPhase,
  OfferingState,
  UserSettings,
} from '../types/settings'

interface OfferingDrawerProps {
  open: boolean
  settings: UserSettings
  onClose: () => void
  onSettingsChange: (next: UserSettings) => void
  onResetLocalData: () => void
  onNotify: (message: string) => void
}

const darkHumorOptions: Array<{
  value: DarkHumorLevel
  label: string
}> = [
  { value: 'low', label: '低' },
  { value: 'normal', label: '标准' },
  { value: 'high', label: '高' },
]

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function getProcessingDelay(): number {
  return 620 + Math.random() * 260
}

function OfferingDrawer({
  open,
  settings,
  onClose,
  onSettingsChange,
  onResetLocalData,
  onNotify,
}: OfferingDrawerProps) {
  const [offering, setOffering] =
    useState<OfferingState>(() =>
      getOfferingState(),
    )

  const [phase, setPhase] =
    useState<OfferingPhase>('idle')

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [feedback, setFeedback] =
    useState<string | null>(null)

  const [introSeen, setIntroSeen] =
    useState(() => hasSeenOfferingIntro())

  const [resetOpen, setResetOpen] =
    useState(false)

  const [resetDone, setResetDone] =
    useState(false)

  const [titleClicks, setTitleClicks] =
    useState(0)

  const [devMode, setDevMode] =
    useState(false)

  const [verifyOpen, setVerifyOpen] =
    useState(false)

  const timersRef = useRef<number[]>([])

  const introOpen = open && !introSeen

  const tier = getOfferingTier(
    offering.totalOffering,
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((id) => {
        window.clearTimeout(id)
      })
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== 'Escape') {
        return
      }

      if (resetOpen) {
        setResetOpen(false)
        return
      }

      if (introOpen) {
        setIntroSeen(true)
        markOfferingIntroSeen()
        return
      }

      onClose()
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    open,
    introOpen,
    resetOpen,
    onClose,
  ])

  const handleOffer = async (
    id: string,
    amount: number,
  ) => {
    if (phase === 'processing') {
      return
    }

    timersRef.current.forEach((id) => {
      window.clearTimeout(id)
    })

    timersRef.current.length = 0

    setProcessingId(id)
    setPhase('processing')
    setFeedback(null)
    setResetDone(false)

    await wait(getProcessingDelay())

    const next = addOffering(amount)

    setOffering(next)
    setFeedback(getOfferingFeedback())
    setPhase('success')

    const resetId = window.setTimeout(() => {
      setPhase('idle')
      setProcessingId(null)
    }, 1500)

    timersRef.current.push(resetId)
  }

  const handleTitleClick = () => {
    const next = titleClicks + 1

    setTitleClicks(next)

    if (next === 5) {
      setFeedback(titleEasterEgg[0])
      setDevMode(true)
    }

    if (next > 5) {
      setFeedback(titleEasterEgg[1])
    }
  }

  const handleDeclineIntro = () => {
    markOfferingIntroSeen()
    setIntroSeen(true)
    onClose()
    onNotify(offeringDeclineMessage)
  }

  const handleAcceptIntro = () => {
    markOfferingIntroSeen()
    setIntroSeen(true)
  }

  const handleReset = () => {
    onResetLocalData()

    setOffering(getOfferingState())
    setPhase('idle')
    setProcessingId(null)
    setFeedback(null)
    setResetOpen(false)
    setResetDone(true)
  }

  const handleClose = () => {
    setTitleClicks(0)
    markOfferingIntroSeen()
    setIntroSeen(true)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="offering-backdrop"
            aria-label="关闭科研香火"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="offering-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
          >
            <div className="offering-header">
              <div>
                <span className="offering-eyebrow">
                  香火供奉
                </span>

                <h2
                  className="offering-title"
                  onClick={handleTitleClick}
                >
                  科研香火
                </h2>
              </div>

              <button
                type="button"
                className="offering-close"
                aria-label="关闭科研香火"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            <section className="offering-balance">
              <motion.span
                key={offering.balance}
                className="offering-balance-value"
                initial={{
                  opacity: 0,
                  y: 8,
                  filter: 'blur(4px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                }}
              >
                <em className="offering-currency">
                  ¥
                </em>
                {offering.balance}
              </motion.span>

              <span className="offering-balance-label">
                当前香火值
              </span>

              <p className="offering-balance-copy">
                {getBalanceCopy(offering.balance)}
              </p>

              <div className="offering-tier">
                <span className="offering-tier-key">
                  会员等级
                </span>

                <strong className="offering-tier-value">
                  {tier.label}
                </strong>

                <span className="offering-tier-caption">
                  {tier.caption}
                </span>

                <span className="offering-total">
                  累计供奉 ¥{offering.totalOffering}
                </span>
              </div>
            </section>

            <section className="offering-packages">
              <p className="offering-section-label">
                供奉香火
              </p>

              <div className="offering-package-grid">
                {offeringPackages.map((item) => {
                  const isProcessing =
                    phase === 'processing' &&
                    processingId === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`offering-package${
                        isProcessing
                          ? ' processing'
                          : ''
                      }`}
                      disabled={phase === 'processing'}
                      onClick={() =>
                        handleOffer(
                          item.id,
                          item.amount,
                        )
                      }
                    >
                      <span className="offering-package-amount">
                        <em className="offering-currency">
                          ¥
                        </em>

                        <strong>
                          {item.amount}
                        </strong>

                        <small>香火</small>
                      </span>

                      <span className="offering-package-caption">
                        {item.caption}
                      </span>

                      {item.note && (
                        <span className="offering-package-note">
                          {item.note}
                        </span>
                      )}

                      <span className="offering-package-action">
                        {isProcessing
                          ? '计算中…'
                          : `供奉 ¥${item.amount}`}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="offering-pay">
                <p className="offering-pay-label">
                  支付方式
                </p>

                <div className="offering-pay-list">
                  {offeringPaymentMethods.map(
                    (method) => (
                      <button
                        key={method.id}
                        type="button"
                        className="offering-pay-item"
                        disabled={
                          phase === 'processing'
                        }
                        onClick={() => {
                          setFeedback(method.note)
                          setResetDone(false)
                        }}
                      >
                        {method.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </section>

            <div className="offering-feedback">
              <AnimatePresence mode="wait">
                {phase === 'processing' && (
                  <motion.p
                    key="processing"
                    className="offering-feedback-line"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="offering-feedback-tag">
                      系统
                    </span>
                    {getOfferingPhaseLabel(
                      'processing',
                    )}
                  </motion.p>
                )}

                {phase === 'success' && feedback && (
                  <motion.p
                    key="success"
                    className="offering-feedback-line success"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="offering-feedback-tag">
                      系统
                    </span>
                    {feedback}
                  </motion.p>
                )}

                {phase === 'idle' && feedback && (
                  <motion.p
                    key="idle-feedback"
                    className="offering-feedback-line idle"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="offering-feedback-tag">
                      系统
                    </span>
                    {feedback}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <section className="offering-verify">
              <button
                type="button"
                className="offering-verify-toggle"
                aria-expanded={verifyOpen}
                onClick={() =>
                  setVerifyOpen(!verifyOpen)
                }
              >
                <span className="setting-info">
                  <span className="setting-name">
                    实名认证通道
                  </span>

                  <span className="setting-hint">
                    本通道未接通任何真实系统
                  </span>
                </span>

                <span className="offering-verify-arrow">
                  {verifyOpen ? '收起' : '展开'}
                </span>
              </button>

              {verifyOpen && (
                <div className="fake-form">
                  <p className="fake-form-intro">
                    {fakeVerifyIntro}
                  </p>

                  {fakeVerifyFields.map(
                    (field) => (
                      <div
                        className="fake-field"
                        key={field.id}
                      >
                        <span className="fake-field-label">
                          {field.label}

                          <span className="fake-field-purpose">
                            （{field.purpose}）
                          </span>

                          <span className="fake-field-devnote">
                            （{field.devNote}）
                          </span>
                        </span>

                        <input
                          className="fake-field-input"
                          placeholder={
                            field.placeholder
                          }
                          disabled
                        />

                        {field.hint && (
                          <span className="fake-field-hint">
                            {field.hint}
                          </span>
                        )}
                      </div>
                    ),
                  )}

                  <button
                    type="button"
                    className="fake-form-submit"
                    disabled
                  >
                    {fakeVerifySubmit}
                  </button>

                  <p className="fake-form-note">
                    {fakeVerifyNote}
                  </p>
                </div>
              )}
            </section>

            <div className="offering-divider" />

            <section className="offering-settings">
              <div>
                <span className="offering-eyebrow">
                  系统配置
                </span>

                <h3 className="offering-settings-title">
                  系统设置
                </h3>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-name">
                    动画强度
                  </span>

                  <span className="setting-hint">
                    影响扫描与揭示动画
                  </span>
                </div>

                <div className="setting-segments">
                  <button
                    type="button"
                    className={
                      settings.animationLevel ===
                      'full'
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        animationLevel: 'full',
                      })
                    }
                  >
                    完整
                  </button>

                  <button
                    type="button"
                    className={
                      settings.animationLevel ===
                      'reduced'
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        animationLevel: 'reduced',
                      })
                    }
                  >
                    减弱
                  </button>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-name">
                    声音
                  </span>

                  <span className="setting-hint">
                    尚未接入音效素材
                  </span>
                </div>

                <span className="setting-coming">
                  暂未开放
                </span>
              </div>

              {devMode && (
                <div className="dev-config">
                  <div className="dev-config-header">
                    <span className="offering-eyebrow">
                      开发者选项
                    </span>

                    <span className="dev-config-badge">
                      仅开发者
                    </span>
                  </div>

                  <p className="dev-config-note">
                    内部语气调参，不对普通用户展示。
                  </p>

                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-name">
                        地狱笑话浓度
                      </span>

                      <span className="setting-hint">
                        影响重复抽取的吐槽语气
                      </span>
                    </div>

                    <div className="setting-segments">
                      {darkHumorOptions.map(
                        (option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={
                              settings.darkHumorLevel ===
                              option.value
                                ? 'active'
                                : ''
                            }
                            onClick={() =>
                              onSettingsChange({
                                ...settings,
                                darkHumorLevel:
                                  option.value,
                              })
                            }
                          >
                            {option.label}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-info">
                      <span className="setting-name">
                        二旬老人称呼
                      </span>

                      <span className="setting-hint">
                        重复抽取时的彩蛋称呼
                      </span>
                    </div>

                    <div className="setting-segments">
                      <button
                        type="button"
                        className={
                          settings.elderNicknameEnabled
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            elderNicknameEnabled:
                              true,
                          })
                        }
                      >
                        开启
                      </button>

                      <button
                        type="button"
                        className={
                          settings.elderNicknameEnabled
                            ? ''
                            : 'active'
                        }
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            elderNicknameEnabled:
                              false,
                          })
                        }
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="setting-reset"
                onClick={() => {
                  setResetDone(false)
                  setResetOpen(true)
                }}
              >
                <span className="setting-name">
                  重置本地数据
                </span>

                <span className="setting-hint">
                  清空档案、次数、香火与设置
                </span>
              </button>

              {resetDone && (
                <p className="setting-reset-done">
                  {resetSuccessMessage}
                </p>
              )}
            </section>

            <p className="offering-disclaimer">
              {offeringDisclaimer}
            </p>
          </motion.aside>

          <AnimatePresence>
            {introOpen && (
              <motion.div
                className="offering-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="offering-dialog"
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
                  exit={{
                    opacity: 0,
                    y: 8,
                  }}
                  transition={{
                    duration: 0.28,
                    ease: 'easeOut',
                  }}
                >
                  <span className="offering-eyebrow">
                    温馨提示
                  </span>

                  <h3>{offeringIntro.title}</h3>

                  <div className="offering-dialog-lines">
                    {offeringIntro.lines.map(
                      (line) => (
                        <p key={line}>{line}</p>
                      ),
                    )}
                  </div>

                  <p className="offering-dialog-question">
                    {offeringIntro.question}
                  </p>

                  <div className="offering-dialog-actions">
                    <button
                      type="button"
                      onClick={handleAcceptIntro}
                    >
                      {offeringIntro.accept}
                    </button>

                    <button
                      type="button"
                      className="ghost"
                      onClick={handleDeclineIntro}
                    >
                      {offeringIntro.decline}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {resetOpen && (
              <motion.div
                className="offering-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="offering-dialog"
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
                  exit={{
                    opacity: 0,
                    y: 8,
                  }}
                  transition={{
                    duration: 0.28,
                    ease: 'easeOut',
                  }}
                >
                  <span className="offering-eyebrow">
                    数据归零
                  </span>

                  <h3>你即将清除：</h3>

                  <ul className="offering-dialog-list">
                    {resetConfirmItems.map(
                      (item) => (
                        <li key={item}>{item}</li>
                      ),
                    )}
                  </ul>

                  <p className="offering-dialog-question">
                    该操作无法恢复。
                  </p>

                  <div className="offering-dialog-actions">
                    <button
                      type="button"
                      className="ghost"
                      onClick={() =>
                        setResetOpen(false)
                      }
                    >
                      取消
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={handleReset}
                    >
                      确认归零
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

export default OfferingDrawer
