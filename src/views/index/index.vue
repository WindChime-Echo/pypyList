<script setup>
import Menu from '@/components/menu/index.vue'
import router from '@/router';
import { RouterView } from 'vue-router'
import { usePypyListStore } from '@/stores/pypyDance'
import { useCollectionStore } from '@/stores/collection';
const pypyListStore = usePypyListStore()
const collectionStore = useCollectionStore();
pypyListStore.getPypyList()
collectionStore.getCollectionList()
const changeMenu = (url => {
  router.push(url)
})

</script>

<template>
  <el-container>
    <el-aside width="300px">
      <Menu @change="changeMenu" />
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</template>

<style scoped></style>
