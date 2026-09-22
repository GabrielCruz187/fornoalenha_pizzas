import { useLayoutEffect } from 'react'
import { useThemeStore } from '../../store/useThemeStore'

/** Keeps <html data-theme> in sync with the persisted theme choice. */
export function ThemeEffect() {
  const theme = useThemeStore((s) => s.theme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}
