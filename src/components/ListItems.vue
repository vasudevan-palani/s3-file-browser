<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted } from "vue";
const props = defineProps<{ items: [] }>();
const emit = defineEmits(["itemSelected"]);
let selectedItem:any = undefined
let selectedIndex = undefined
const selectItem = (item,index) => {
    if (selectedIndex != undefined){
      props.items[selectedIndex].selected = false
    }
    item.selected = true;
    selectedItem = item;
    emit('itemSelected',item);
    selectedIndex = index
}

const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) {
        return text; // Return the original text if it's shorter than or equal to maxLength
      } else {
        return text.slice(0, maxLength) + '...'; // Truncate and add ellipsis
      }
}
</script>

<template>
  <div class="files">
    <div v-for="(item, index) in items">
      <el-link :type="item.selected ? 'primary' : ''" @click="() => selectItem(item,index)" :underline="false"
        :title="item.Name">{{ index + 1 }}.{{ truncateText(item.Name,30) }}</el-link
      >
    </div>
  </div>
</template>

<style scoped>
.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  max-height: 770px;
  overflow-y: scroll;
}
</style>
