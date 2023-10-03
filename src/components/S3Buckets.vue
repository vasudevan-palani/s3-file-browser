<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted } from "vue";
import ListItems from './ListItems.vue'

import Credentials from "../services/aws";

const emit = defineEmits(["bucketSelected"]);
const items = ref<any[]>([]);

const selectedItem = ref({});

const selectItem = (item: any) => {};

const AWS = require("aws-sdk");

const itemSelected = (item:any)=>{
    selectedItem.value = item
    emit('bucketSelected',item.Name)
}

onMounted(() => {
  AWS.config.update({
    accessKeyId: Credentials.getAccessKey(),
    secretAccessKey: Credentials.getSecretKey()
  });
  const s3 = new AWS.S3();
  console.log("in onmounted")
  s3.listBuckets({}, (err: any, data: any) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    let childItems = [];

    for (let i = 0; i < data.Buckets.length; i++) {
      childItems.push({ Name: data.Buckets[i].Name,isLeaf:false });
    }

    items.value = childItems;
  });
});
</script>

<template>
  <ListItems :has-more="false" :items="items" @item-selected="itemSelected"/>
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
