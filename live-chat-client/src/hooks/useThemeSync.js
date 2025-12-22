import { useEffect } from 'react'

export default function useThemeSync(isLight) {
  useEffect(() => {
    const root = document.documentElement
    if (isLight) {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }, [isLight])
}
