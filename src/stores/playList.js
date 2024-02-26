import { ref, toRaw, reactive } from "vue"
import { defineStore } from "pinia"
import { ElMessage } from "element-plus"

// BroadcastChannel
const channel = new BroadcastChannel("playlist_channel")

export const usePlayListStore = defineStore("playList", () => {
  const playList = ref([])

  function initPlayList(list) {
    if (!list) return
    // 保持响应式 先清空数组再逐个加入
    playList.value.splice(0, playList.value.length)

    list.forEach((item) => playList.value.push(item))
  }

  function serializeReactiveArray(reactiveArray) {
    return toRaw(reactiveArray).map((item) => {
      return {
        ...item,
        originalUrl: toRaw(item.originalUrl),
      }
    })
  }

  // // 新页面加载时请求播放列表
  function requestPlaylist() {
    console.log("新页面加载时请求播放列表")
    channel.postMessage({ action: "requestPlaylist" })
  }

  // 发送当前播放列表
  function sendPlaylist() {
    console.log("发送当前播放列表")
    console.log(serializeReactiveArray(playList.value))
    channel.postMessage({
      action: "currentPlaylist",
      playlist: serializeReactiveArray(playList.value),
    })
  }

  function addPlayList(row) {
    const { originalUrl } = row
    const exists = playList.value.some((item) => {
      return originalUrl?.[0] === item.originalUrl?.[0]
    })
    if (exists) {
      ElMessage.error("已存在播放列表")
      return
    }

    playList.value.push(row)
    sendPlaylist()
  }

  function nextVideo() {
    if (playList.value.length === 0) {
      ElMessage.error("播放列表暂无歌曲")
      return
    }
    playList.value.shift()
    sendPlaylist()
  }
  function topSong(row) {
    const index = playList.value.findIndex((item) => {
      return item.id === row.id
    })
    if (index === -1) return
    if (index === 0) {
      ElMessage.error("正在播放")
      return
    }
    if (index === 1) {
      ElMessage.error("已至下一首")
      return
    }
    playList.value.splice(index, 1)
    playList.value.splice(1, 0, row)
    sendPlaylist()
  }

  requestPlaylist()

  return {
    playList,
    addPlayList,
    nextVideo,
    topSong,
    initPlayList,
    sendPlaylist,
  }
})

const playListStore = usePlayListStore()
// 监听消息
channel.onmessage = (event) => {
  console.log(event.data)
  if (event.data.action === "requestPlaylist") {
    // 如果收到播放列表请求，发送当前播放列表
    playListStore.sendPlaylist()
  } else if (event.data.action === "currentPlaylist") {
    // 如果收到当前播放列表，更新本地播放列表
    playListStore.initPlayList(event.data.playlist)
  }
}
