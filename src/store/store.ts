import { create } from "zustand"

type CountTimer = {
  timer: number
  isButtonDisabled: boolean
  decrement: () => void
  reset: () => void
  setDisabled: () => void
  setEnabled: () => void
}

export const useCountTimer = create<CountTimer>((set) => ({
  timer: 180,
  isButtonDisabled: false,
  decrement: () => {
    set((state) => ({ timer: state.timer - 1 }))
  },
  reset: () => {
    set({ timer: 180 })
  },
  setDisabled: () => {
    set({ isButtonDisabled: true })
  },
  setEnabled: () => {
    set({ isButtonDisabled: false })
  },
}))
