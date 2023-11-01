<template>
  <div class="favorite">
    <Search v-model="totalData" :rawData="collectionList" @reset="resetSearch" @findIndex="findIndex" />
    <MusicTable ref="MusicTableRef" :tableData="tableData" v-model:totalData="totalData" />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useCollectionStore } from "@/stores/collection";
import MusicTable from "@/components/musicTable/index.vue";
import Search from "@/components/search/index.vue";

const collectionStore = useCollectionStore();
const { collectionList } = storeToRefs(collectionStore);

const MusicTableRef = ref()
const totalData = ref(collectionList.value);
const tableData = computed(() => {
  const pages = MusicTableRef.value ?? {}
  const startIndex = (pages.pageNum - 1) * pages.pageSize;
  const endIndex = pages.pageNum * pages.pageSize;

  // 使用slice方法来获取对应页的数据
  return totalData.value?.slice(startIndex, endIndex).map((item) => {
    const index = collectionStore.getIndex(item);
    if (index === -1) return { ...item, collection: 0 };
    else return { ...item, collection: 1 };
  });
});

// reset
const resetSearch = () => {
  MusicTableRef.value.reset()
}
// 搜索id跳转对应位置
const findIndex = (index) => {
  MusicTableRef.value.findIndex(index)
}
</script>

<style scoped>
.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
