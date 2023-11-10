<template>
  <div class="search">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="keyword" @keyup.enter.native="search" :placeholder="`请输入${searchType === '0' ? 'ID' : '曲名'}`">
          <template #prepend>
            <el-select v-model="searchType" placeholder="" style="width: 80px">
              <el-option label="ID" value="0" />
              <el-option label="曲名" value="1" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="typeKey" placeholder="选择歌曲类型" @change="search">
          <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { storeToRefs } from "pinia";
import { usePypyListStore } from "@/stores/pypyDance";

const pypyListStore = usePypyListStore();
const { typeOption } = storeToRefs(pypyListStore);


const props = defineProps(['modelValue', 'rawData'])
const emit = defineEmits(['update:modelValue', 'reset'])


// 搜索
const keyword = ref('')
const searchType = ref('0')
const typeKey = ref('')
const search = () => {
  if (!keyword.value?.trim() && !typeKey.value) return;
  const originData = !typeKey.value ? props.rawData : props.rawData.filter(item => item.group === typeKey.value)
  if (!keyword.value?.trim()) return emit('update:modelValue', originData);

  switch (String(searchType.value)) {
    case '0':
      const numReg = /^[1-9]\d*$/
      if (!numReg.test(keyword.value)) return ElMessage.error('请输入数字类型ID')
      const index = originData.findIndex(item => String(item.id) === keyword.value)
      if (index === -1) return ElMessage.error('此分类没有该ID歌曲或需更新')
      emit('update:modelValue', originData);
      emit('findIndex', index);
      break;
    case '1':
      const lowerCasedKeyword = keyword.value.trim().toLocaleLowerCase();

      const searchData = originData.filter((item) => {
        const nameMatch = item.name?.toLocaleLowerCase().includes(lowerCasedKeyword);
        return nameMatch;
      });
      emit('update:modelValue', searchData);
      break;

    default:
      break;
  }
}


// 重置
const reset = () => {
  keyword.value = ''
  typeKey.value = ''
  searchType.value = '0'
  emit('reset')
  emit('update:modelValue', props.rawData)
};

</script>

<style lang="less" scoped>
.search {
  display: block;

  ::v-deep .el-form--inline .el-form-item {
    margin-right: 12px;
  }
}
</style>