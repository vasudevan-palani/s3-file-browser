<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted, watch, onUpdated } from "vue";
import ListItems from "./ListItems.vue";

// AWS Initialization
//
const AWS = require("aws-sdk");
AWS.config.update({
  profile: process.env.AWS_PROFILE,
});
const s3 = new AWS.S3();

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

const items = ref([]);

// handlers
//
const itemSelected = (item: any) => {
  emit("keySelected", item.Name, item.isLeaf);
};


// resuable functions
//

const getS3Items = (s3bucket,s3prefix) => {
  let params = {
    "Bucket" : s3bucket
  }
  if (s3prefix != undefined && s3prefix != ""){
    params["Prefix"] = s3prefix
  }
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);

    let childItems = [];
    for (let i = 0; i < data.Contents.length; i++) {
      let filekey = data.Contents[i].Key;
      console.log(filekey);
      if (props.s3prefix != undefined) {
        filekey = filekey.replace(props.s3prefix + "/", "");
        console.log(filekey);
      }
      if (filekey.includes("/")) {
        console.log(filekey.split("/")[0]);
        let keyItem = filekey.split("/")[0];
        if (keyItem != undefined && keyItem != "") {
          childItems.push({ Name: keyItem, isLeaf: false });
        }
      } else {
        childItems.push({ Name: filekey, isLeaf: true });
      }
    }
    const uniqueArray = childItems.filter(
      (obj, index, self) => self.findIndex((o) => o.Name === obj.Name) === index
    );
    console.log(uniqueArray)
    items.value =  uniqueArray;
    
  });
};

//lifecycles and watches
//
onMounted(() => {
  getS3Items(props.s3bucket,props.s3prefix)
});

watchEffect(() => {
  getS3Items(props.s3bucket,props.s3prefix)
});

</script>

<template>
  <ListItems :items="items" @item-selected="itemSelected" />
</template>

<style scoped>
.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
</style>
