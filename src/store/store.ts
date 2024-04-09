import { create } from "zustand"

type CountTimer = {
  timer: number
  isButtonDisabled: boolean
  reset: () => void
  setDisabled: () => void
  setEnabled: () => void
}

export const useCountTimer = create<CountTimer>((set) => ({
  timer: 180,
  isButtonDisabled: false,
  reset: () => set({ timer: 180 }),
  setDisabled: () => {
    set({ isButtonDisabled: true })
  },
  setEnabled: () => {
    set({ isButtonDisabled: false })
  },
}))
