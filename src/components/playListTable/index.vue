<template>
  <div class="playListTable">
    <el-card ref="playListRef" class="playlist" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-row :gutter="20">
            <el-col :span="6">
              <span>播放列表</span>
            </el-col>
            <el-col :span="8" :offset="9">
              <div class="btns">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="是否自动播放"
                  placement="top-start"
                >
                  <el-switch
                    :value="isPlayRandomly"
                    @change="switchPlayRandomly"
                  />
                </el-tooltip>

                <el-button @click="playNext">下一首</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" :height="tableHeight">
        <el-table-column prop="id" label="ID" width="55" align="center" />
        <el-table-column prop="name" label="曲名" width="255" />
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="topSong(scope.row)"
              >顶歌</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { usePlayListStore } from "@/stores/playList"
import { ref, onMounted, nextTick } from "vue"
import { storeToRefs } from "pinia"

const playListRef = ref(null)
const tableHeight = ref("auto")

const emit = defineEmits([])
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
})

const playListStore = usePlayListStore()
const { isPlayRandomly } = storeToRefs(playListStore)

const topSong = (row) => {
  playListStore.topSong(row)
}

const playNext = () => {
  playListStore.nextVideo()
}

const switchPlayRandomly = () => {
  console.log(111, isPlayRandomly.value)
  playListStore.switchPlayRandomly()
}

onMounted(async () => {
  await nextTick() // 确保DOM已经更新完毕
  if (playListRef.value) {
    if (playListRef.value) {
      const cardBody = playListRef.value.$el.querySelector(".el-card__body")
      if (cardBody) {
        const style = window.getComputedStyle(cardBody)
        const paddingTop = parseFloat(style.paddingTop)
        const paddingBottom = parseFloat(style.paddingBottom)
        const heightWithoutPadding =
          cardBody.clientHeight - paddingTop - paddingBottom
        tableHeight.value = `${heightWithoutPadding}px`
      }
    }
  }
})
</script>

<style scoped>
.playListTable {
  height: 100%;
}
.playlist {
  margin-right: 1vw;
  height: 100%;
}

::v-deep .el-card__header {
  height: 7%;
}
::v-deep .el-card__body {
  height: 93%;
}

.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
