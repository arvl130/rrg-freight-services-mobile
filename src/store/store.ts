import { create } from "zustand"

type CountTimer = {
  timer: number
  disbaleBtn: boolean
  decrement: () => void
  reset: () => void
  setDisable: () => void
  setEnable: () => void
}

export const useCountTimer = create<CountTimer>((set) => ({
  timer: 180,
  disbaleBtn: false,
  decrement: () => {
    set((state) => ({ timer: state.timer - 1 }))
  },
  reset: () => {
    set({ timer: 180 })
  },
  setDisable: () => {
    set({ disbaleBtn: true })
  },
  setEnable: () => {
    set({ disbaleBtn: false })
  },
}))
