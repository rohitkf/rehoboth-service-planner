import { useCallback } from 'react'

export function usePrintTrigger() {
  const handlePrint = useCallback(() => {
    document.body.setAttribute('data-printing', 'true')
    window.print()
    const cleanup = () => {
      document.body.removeAttribute('data-printing')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
  }, [])

  return { handlePrint }
}
