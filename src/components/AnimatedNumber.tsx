import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  suffix?: string
  delay?: number
  duration?: number
}

function AnimatedNumber({
  value,
  suffix = '',
  delay = 0,
  duration = 650,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] =
    useState(0)

  useEffect(() => {
    let frameId = 0
    let timeoutId = 0
    let startTime: number | null = null

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time
      }

      const elapsed = time - startTime

      const progress = Math.min(
        elapsed / duration,
        1,
      )

      const eased =
        1 - Math.pow(1 - progress, 3)

      setDisplayValue(
        Math.round(value * eased),
      )

      if (progress < 1) {
        frameId =
          window.requestAnimationFrame(
            animate,
          )
      }
    }

    const startAnimation = () => {
      frameId =
        window.requestAnimationFrame(
          animate,
        )
    }

    timeoutId = window.setTimeout(
      startAnimation,
      delay,
    )

    return () => {
      window.clearTimeout(timeoutId)
      window.cancelAnimationFrame(frameId)
    }
  }, [value, delay, duration])

  return (
    <>
      {displayValue}
      {suffix}
    </>
  )
}

export default AnimatedNumber