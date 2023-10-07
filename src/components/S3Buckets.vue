<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted } from "vue";
import ListItems from "./ListItems.vue";

import S3Client from "../services/s3client";

const emit = defineEmits(["bucketSelected"]);
const items = ref<any[]>([]);

const selectedItem = ref({});

const error = ref<string>("")

const selectItem = (item: any) => {};

const AWS = require("aws-sdk");

const itemSelected = (item: any) => {
  selectedItem.value = item;
  emit("bucketSelected", item.Name);
};

onMounted(() => {
  new S3Client()
    .getBuckets()
    .then((list: any) => {
      items.value = list;
      error.value = ''
    })
    .catch((err) => {
      error.value = err
      console.log(err);
    });
});
</script>

<template>
  <el-text v-if="error != ''" type="danger">{{ error }}</el-text>
  <ListItems :has-more="false" :items="items" @item-selected="itemSelected" />
</template>

<style scoped>
.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  max-height: 770px;
  overflow-y: scroll;
  text-align: left;
}
</style>
