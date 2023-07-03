import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

const COLLECTION = 'collection'
export const useCollectionStore = defineStore('collection', () => {
  const collectionList = ref([])
  function saveCollection() {
    localStorage.setItem(COLLECTION, JSON.stringify(collectionList.value))
  }
  async function getCollectionList() {
    collectionList.value = JSON.parse(localStorage.getItem(COLLECTION)) ?? []
  }
  function addCollection(row) {
    const index = getIndex(row)
    if (index !== -1) {
      ElMessage.error('已存在该收藏')
      return
    }
    collectionList.value.push(row)
    collectionList.value.sort((a, b) => {
      return a.id - b.id
    })
    saveCollection()
  }
  function deleteCollection(row) {
    const index = getIndex(row)
    if (index === -1) ElMessage.error('未找到该收藏')
    else collectionList.value.splice(index, 1)
    saveCollection()
  }
  function getIndex(row) {
    const originalUrl = row.originalUrl
    const index = collectionList.value.findIndex(item => {
      return originalUrl === item.originalUrl
    })
    return index
  }

  return { collectionList, getCollectionList, getIndex, addCollection, deleteCollection }
})
