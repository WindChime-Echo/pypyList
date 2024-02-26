<template>
  <div>
    <el-row>
      <el-col :span="7">
        <PlayListTable ref="PlayListTable" :tableData="playList" />
      </el-col>
      <el-col :span="17" class="searchTable">
        <Search
          v-model="totalData"
          :rawData="pypyList"
          @reset="resetSearch"
          @findIndex="findIndex" />
        <MusicTable
          ref="MusicTableRef"
          :tableData="tableData"
          type="playList"
          v-model:totalData="totalData"
      /></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { usePypyListStore } from "@/stores/pypyDance"
import { usePlayListStore } from "@/stores/playList"
import MusicTable from "@/components/musicTable/index.vue"
import Search from "@/components/search/index.vue"
import PlayListTable from "@/components/playListTable/index.vue"

const pypyListStore = usePypyListStore()
const playListStore = usePlayListStore()

const { pypyList } = storeToRefs(pypyListStore)
const { playList } = storeToRefs(playListStore)

const MusicTableRef = ref()
const totalData = ref(pypyList.value)
const tableData = computed(() => {
  const pages = MusicTableRef.value ?? {}
  const startIndex = (pages.pageNum - 1) * pages.pageSize
  const endIndex = pages.pageNum * pages.pageSize

  // 使用slice方法来获取对应页的数据
  return totalData.value?.slice(startIndex, endIndex)
})

// reset
const resetSearch = () => {
  MusicTableRef.value.reset()
}
// 搜索id跳转对应位置
const findIndex = (index) => {
  MusicTableRef.value.findIndex(index)
}
</script>

<style scoped></style>
