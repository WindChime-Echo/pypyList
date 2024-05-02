<template>
  <div>
    <video ref="plyrVideo" controls class="plyr__video-embed">
      <source :src="props.videoUrl" type="video/mp4" />
    </video>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

const props = defineProps({
  videoUrl: String,
  flip: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["videoEnded"])
const plyrVideo = ref(null)

let plyrInstance = null

// 定义静音然后延迟取消静音的函数
const muteAndUnmuteAfterDelay = (delay = 1000) => {
  if (plyrInstance) {
    plyrInstance.muted = true // 开始时静音
    setTimeout(() => {
      plyrInstance.muted = false // 延迟后取消静音
      plyrInstance.volume = 1 // 可选：同时设置音量为最大
    }, delay)
  }
}

const initPlyr = () => {
  nextTick(() => {
    if (plyrInstance) {
      plyrInstance.destroy()
    }
    if (plyrVideo.value) {
      plyrInstance = new Plyr(plyrVideo.value, {
        autoplay: true,
      })

      plyrInstance.on("ended", () => {
        emit("videoEnded")
      })

      muteAndUnmuteAfterDelay() // 初始化 Plyr 后调用静音/取消静音逻辑

      applyFlipEffect()
    }
  })
}

const applyFlipEffect = () => {
  const wrapper = document.querySelector(".plyr__video-wrapper")
  if (props.flip) {
    wrapper.style.transform = "scaleX(-1)"
  } else {
    wrapper.style.transform = "scaleX(1)"
  }
}

watch(
  () => props.videoUrl,
  (newVal) => {
    if (plyrInstance && newVal) {
      plyrInstance.source = {
        type: "video",
        sources: [
          {
            src: newVal,
            type: "video/mp4",
          },
        ],
      }
      muteAndUnmuteAfterDelay() // 当视频 URL 更新时再次应用静音/取消静音逻辑
      applyFlipEffect()
    }
  },
  { immediate: true }
)

onMounted(() => {
  initPlyr()
})

onUnmounted(() => {
  if (plyrInstance) {
    plyrInstance.destroy()
  }
})
</script>
