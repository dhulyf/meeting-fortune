import { useEffect, useRef } from 'react'
import type { UserSettings } from '../types/settings'
interface Props {
  open: boolean
  settings: UserSettings
  onClose: () => void
  onSettingsChange: (settings: UserSettings) => void
}
export default function SettingsDrawer({ open, settings, onClose, onSettingsChange }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) dialog.current?.showModal()
    else dialog.current?.close()
  }, [open])
  return (
    <dialog ref={dialog} className="settings-dialog" onCancel={onClose} onClick={event => {
      if (event.target === event.currentTarget) onClose()
    }} aria-labelledby="settings-title">
      <div className="settings-content">
        <div className="history-header">
          <div><span className="app-eyebrow">SYSTEM SETTINGS</span><h2 id="settings-title">设置</h2></div>
          <button type="button" className="history-close" aria-label="关闭设置" onClick={onClose}>×</button>
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
                    aria-pressed={settings.animationLevel === 'full'}
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
                    aria-pressed={settings.animationLevel === 'reduced'}
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
                    扫描、揭示与香火到账的提示音
                  </span>
                </div>

                <div className="setting-segments">
                  <button
                    type="button"
                    aria-pressed={settings.soundEnabled}
                    className={
                      settings.soundEnabled
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        soundEnabled: true,
                      })
                    }
                  >
                    开启
                  </button>

                  <button
                    type="button"
                    aria-pressed={!settings.soundEnabled}
                    className={
                      settings.soundEnabled
                        ? ''
                        : 'active'
                    }
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        soundEnabled: false,
                      })
                    }
                  >
                    关闭
                  </button>
                </div>
              </div>

      </div>
    </dialog>
  )
}
