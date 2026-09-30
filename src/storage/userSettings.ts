import type {
  AnimationLevel,
  DarkHumorLevel,
  UserSettings,
} from '../types/settings'

const STORAGE_KEY =
  'zhanbu-user-settings'

export const DEFAULT_USER_SETTINGS: UserSettings =
  {
    animationLevel: 'full',
    soundEnabled: false,
    darkHumorLevel: 'normal',
    elderNicknameEnabled: true,
  }

const ANIMATION_LEVELS: AnimationLevel[] = [
  'full',
  'reduced',
]

const DARK_HUMOR_LEVELS: DarkHumorLevel[] = [
  'low',
  'normal',
  'high',
]

function sanitize(
  value: unknown,
): UserSettings {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return { ...DEFAULT_USER_SETTINGS }
  }

  const raw = value as Partial<UserSettings>

  return {
    animationLevel: ANIMATION_LEVELS.includes(
      raw.animationLevel as AnimationLevel,
    )
      ? (raw.animationLevel as AnimationLevel)
      : DEFAULT_USER_SETTINGS.animationLevel,

    soundEnabled:
      typeof raw.soundEnabled ===
      'boolean'
        ? raw.soundEnabled
        : DEFAULT_USER_SETTINGS.soundEnabled,

    darkHumorLevel: DARK_HUMOR_LEVELS.includes(
      raw.darkHumorLevel as DarkHumorLevel,
    )
      ? (raw.darkHumorLevel as DarkHumorLevel)
      : DEFAULT_USER_SETTINGS.darkHumorLevel,

    elderNicknameEnabled:
      typeof raw.elderNicknameEnabled ===
      'boolean'
        ? raw.elderNicknameEnabled
        : DEFAULT_USER_SETTINGS
            .elderNicknameEnabled,
  }
}

export function getUserSettings(): UserSettings {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return { ...DEFAULT_USER_SETTINGS }
    }

    return sanitize(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_USER_SETTINGS }
  }
}

export function saveUserSettings(
  settings: UserSettings,
): UserSettings {
  const next = sanitize(settings)

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next),
    )
  } catch {
    // localStorage 不可用时，
    // 设置仅在本次会话内生效。
  }

  return next
}

export function resetUserSettings(): void {
  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    )
  } catch {
    // 同上。
  }
}
