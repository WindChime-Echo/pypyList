import { ref } from "vue"
import { defineStore } from "pinia"
import getPypyDance from "@/service/pypydance/index"

const PYPY_LIST = "pypylist"
const IS_YOU_TUBE = "isYouTube"
const isYouTube = ref(localStorage.getItem(IS_YOU_TUBE) || false)
export const usePypyListStore = defineStore("pypyList", () => {
  const pypyList = ref([])
  const typeOption = ref([
    { value: 0, label: "just dance solo" },
    { value: 1, label: "just dance duet" },
    { value: 2, label: "just dance trio" },
    { value: 3, label: "just dance crew" },
    { value: 4, label: "just dance fan made" },
    { value: 5, label: "FitDance" },
    { value: 6, label: "Marshall" },
    { value: 7, label: "Mylee" },
    { value: 8, label: "TML" },
    { value: 9, label: "Golfy" },
    { value: 10, label: "SouthVibes" },
    { value: 11, label: "未知分类" },
    { value: 12, label: "未知分类" },
    { value: 13, label: "Others" }
  ])

  async function getPypyList(isForceUpdates = false) {
    if (!isForceUpdates) {
      const localStorageList = localStorage.getItem(PYPY_LIST)
      if (!!localStorageList) {
        pypyList.value = JSON.parse(localStorageList)
        return
      }
    }
    const res = await getPypyDance()
    const { songs } = res
    localStorage.setItem(PYPY_LIST, JSON.stringify(songs))
    pypyList.value = songs
    location.reload()
  }

  function editIsYouTuBe() {
    isYouTube.value = !isYouTube.value
    localStorage.setItem(IS_YOU_TUBE, JSON.stringify(isYouTube.value))
  }

  return { pypyList, typeOption, getPypyList, isYouTube, editIsYouTuBe }
})
