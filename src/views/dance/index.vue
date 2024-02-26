<template>
  <div>
    <PlyrWrapper
      v-if="videoList.length > 0"
      :videoUrl="currentVideoUrl"
      @videoEnded="playNext"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"

import PlyrWrapper from "@/components/PlyrWrapper/index.vue"
import { usePlayListStore } from "@/stores/playList"

const playListStore = usePlayListStore()
const { playList } = storeToRefs(playListStore)
const refPlayList = ref(playList.value)

const videoList = computed(() => {
  // console.log(refPlayList.value)
  return refPlayList.value.map((item) => {
    const { id } = item
    return `https://jd.pypy.moe/api/v1/videos/${id}.mp4`
  })
})

// 计算当前视频ID
const currentVideoUrl = computed(() => videoList.value[0])

// // 切换视频的逻辑

const playNext = () => {
  playListStore.nextVideo()
}
</script>
