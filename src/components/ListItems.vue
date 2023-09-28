<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted } from "vue";
import { FolderIcon,FileIcon } from "@vue-icons/feather";
const props = defineProps<{ items: any[],hasMore:boolean }>();
const emit = defineEmits(["itemSelected","clickedMore"]);
let selectedItem:any = undefined
let selectedIndex:number|undefined = undefined
const selectItem = (item:any,index:number) => {
  if (item == undefined){
    return
  }
    if (selectedIndex != undefined){
      if (selectedIndex < props.items.length){
        props.items[selectedIndex].selected = false
      }
      
    }
    item.selected = true;
    selectedItem = item;
    emit('itemSelected',item);
    selectedIndex = index
}

const onClickedMore = ()=>{
  emit('clickedMore');
}

const truncateText = (text:string, maxLength:number) => {
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
      <el-link v-if="item.isLeaf == false" :icon="FolderIcon" :type="item.selected ? 'primary' : ''" @click="() => selectItem(item,index)" :underline="false"
        :title="item.Name">&nbsp;&nbsp;{{ truncateText(item.Name,30) }}</el-link>
        <el-link v-if="item.isLeaf == true" :icon="FileIcon" :type="item.selected ? 'primary' : ''" @click="() => selectItem(item,index)" :underline="false"
        :title="item.Name">&nbsp;&nbsp;{{ truncateText(item.Name,30) }}</el-link>
    </div>
    <div>
      <el-link v-if="hasMore" @clicked="onClickedMore">More..</el-link>
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
