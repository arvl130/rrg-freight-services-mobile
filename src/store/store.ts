import { create } from "zustand"

type CountTimer = {
  timer: number
  packagesStored: string[]
  isButtonDisabled: boolean
  addPackageId: (packageId: string) => void
  removePackageId: (packageId: string) => void
  reset: () => void
  setDisabled: () => void
  setEnabled: () => void
}

export const useCountTimer = create<CountTimer>((set) => ({
  timer: 180,
  packagesStored: [],
  addPackageId: (packageId: string) => {
    set((state) => ({ packagesStored: [...state.packagesStored, packageId] }))
  },
  removePackageId: (packageId: string) => {
    set((state) => ({
      packagesStored: state.packagesStored.filter((_package) => {
        return _package !== packageId
      }),
    }))
  },
  isButtonDisabled: false,
  reset: () => set({ timer: 180 }),
  setDisabled: () => {
    set({ isButtonDisabled: true })
  },
  setEnabled: () => {
    set({ isButtonDisabled: false })
  },
}))
