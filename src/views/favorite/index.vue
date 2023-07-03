<template>
  <div class="favorite">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="keyword" placeholder="请输入ID/曲名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <MusicTable :tableData="tableData" :total="collectionList.length" @emitPage="emitPage" @collection="collection" />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePypyListStore } from "@/stores/pypyDance";
import { useCollectionStore } from "@/stores/collection";
import MusicTable from "@/components/musicTable/index.vue";

const pypyListStore = usePypyListStore();
const collectionStore = useCollectionStore();
const { pypyList } = storeToRefs(pypyListStore);
const { collectionList } = storeToRefs(collectionStore);

const pageNum = ref(1);
const pageSize = ref(20);
const totalData = ref(collectionList.value);
const tableData = computed(() => {
  const startIndex = (pageNum.value - 1) * pageSize.value;
  const endIndex = pageNum.value * pageSize.value;

  // 使用slice方法来获取对应页的数据
  return totalData.value?.slice(startIndex, endIndex).map((item) => {
    const index = collectionStore.getIndex(item);
    if (index === -1) return { ...item, collection: 0 };
    else return { ...item, collection: 1 };
  });
});

const emitPage = (val, type) => {
  switch (type) {
    case "pageNum":
      pageNum.value = val;
      break;
    case "pageSize":
      pageSize.value = val;
      break;
    default:
      break;
  }
};

// 搜索
const keyword = ref("");
const search = () => {
  if (!keyword.value) return;
  if (/^-?\d+(?:\.\d+)?$/.test(keyword.value)) {
    const item = collectionList.value[Number(keyword.value) - 1];
    totalData.value = !item ? [] : [item];
  } else {
    totalData.value = collectionList.value.filter((item) =>
      item.name?.includes(keyword.value)
    );
  }
};
const reset = () => {
  keyword.value = "";
  totalData.value = collectionList.value;
};

// options
const collection = (row) => {
  console.log(row);
  const collectionTag = row.collection;
  const initRow = { ...row, collection: null };
  console.log(initRow);
  collectionTag === 0
    ? collectionStore.addCollection(initRow)
    : collectionStore.deleteCollection(initRow);
};
</script>

<style scoped>
.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
