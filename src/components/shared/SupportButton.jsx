import { useRef, useState } from 'react'
import { BiCoffee } from 'react-icons/bi'
import SupportDialog from './SupportDialog.jsx'

export default function SupportButton({ className, iconSize = 14 }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)

  function closeDialog() {
    setIsOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={className}
      >
        <BiCoffee size={iconSize} aria-hidden="true" />
        <span>BUY ME A COFFEE</span>
      </button>
      {isOpen && <SupportDialog onClose={closeDialog} />}
    </>
  )
}
