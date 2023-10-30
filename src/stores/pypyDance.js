import { ref } from 'vue'
import { defineStore } from 'pinia'
import getPypyDance from '@/service/pypydance/index'

const PYPY_LIST = 'pypylist'
export const usePypyListStore = defineStore('pypyList', () => {
  const pypyList = ref([])
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
    window.location.reload();
  }

  return { pypyList, getPypyList }
})
