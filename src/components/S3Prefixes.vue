<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted, watch, onUpdated } from "vue";
import ListItems from "./ListItems.vue";
import S3Client from "../services/s3client";
// AWS Initialization
//
const AWS = require("aws-sdk");

//Inputs and Outputs declarations
//
const emit = defineEmits(["keySelected"]);

const props = defineProps({
  s3bucket: {
    type: String,
  },
  s3prefix: {
    type: String,
  },
});

//Variables
//

const items = ref<any[]>([]);

const hasMore = ref<boolean>(false);

const nextToken = ref<string>("");

// handlers
//
const itemSelected = (item: any) => {
  emit("keySelected", item.Name, item.isLeaf);
};

const onClickedMore = () => {
  console.log("S3Prefixes::onClickedMore");
  getS3Items(props.s3bucket, props.s3prefix, nextToken.value);
};

// resuable functions
//

const getS3Items = (
  s3bucket: string | undefined,
  s3prefix: string | undefined,
  continuationToken: string
) => {
  new S3Client()
    .getItems(String(s3bucket), String(s3prefix), continuationToken)
    .then((result: any) => {
      console.log(result)
      if (result.nextToken != undefined && result.nextToken != null) {
        hasMore.value = true;
        nextToken.value = result.nextToken;
      } else {
        hasMore.value = false;
        nextToken.value = "";
      }

      if (result.nextToken == "") {
        items.value = [];
      }
      items.value = items.value.concat(result.items);
    })
    .catch((err) => {
      console.log(err);
    });
};

//lifecycles and watches
//
onMounted(() => {
  getS3Items(props.s3bucket, props.s3prefix, "");
});

watchEffect(() => {
  getS3Items(props.s3bucket, props.s3prefix, "");
});
</script>

<template>
  <ListItems
    :has-more="hasMore"
    @clicked-more="onClickedMore"
    :items="items"
    @item-selected="itemSelected"
  />
</template>

<style scoped>
.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
</style>
