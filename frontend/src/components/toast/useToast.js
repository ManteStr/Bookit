import { useContext } from 'react'
import { ToastContext } from './ToastContext.js'

// const toast = useToast();  toast.success('Išsaugota!');  toast.error('Klaida');
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast turi būti naudojamas viduje ToastProvider')
  return ctx
}
