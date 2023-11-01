import { ref } from 'vue'
import { defineStore } from 'pinia'
import getPypyDance from '@/service/pypydance/index'

const PYPY_LIST = 'pypylist'
export const usePypyListStore = defineStore('pypyList', () => {
  const pypyList = ref([])
  const typeOption = ref([
    { value: '2', label: "FitDance" },
    { value: '3', label: "Marshall" },
    { value: '4', label: "Mylee" },
    { value: '5', label: "TML" },
    { value: '6', label: "Golfy" },
    { value: '7', label: "SouthVibes" },
    { value: '9', label: "Others" },
    { value: "1-1", label: "just dance solo" },
    { value: "1-2", label: "just dance duet" },
    { value: "1-3", label: "just dance trio" },
    { value: "1-4", label: "just dance crew" },
    { value: "1-5", label: "just dance fan made" },
  ])
  async function getPypyList(isForceUpdates = false) {
    if (!isForceUpdates) {
      const localStorageList = localStorage.getItem(PYPY_LIST);
      if (!!localStorageList) {
        pypyList.value = JSON.parse(localStorageList)
        return
      }
    }
    const res = await getPypyDance()
    const { songs } = res
    localStorage.setItem(PYPY_LIST, JSON.stringify(songs));
    pypyList.value = songs
  }

  return { pypyList, typeOption, getPypyList }
})
