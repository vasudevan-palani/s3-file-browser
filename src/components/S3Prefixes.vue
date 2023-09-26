<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted } from "vue";
import ListItems from './ListItems.vue'
const emit = defineEmits(["keySelected"]);

const props = defineProps({
    s3bucket :{
        type : String
    },
    s3prefix : {
        type: String
    }
});

const items = ref([])

const itemSelected = (item:any) => {
  emit('keySelected',item.Name,item.isLeaf)
}

const AWS = require("aws-sdk");
AWS.config.update({
  profile: process.env.AWS_PROFILE,
});
const s3 = new AWS.S3();

watchEffect(() => {
  console.log("in watch effect", props.s3prefix)
  let params = { Bucket : props.s3bucket }

  if (props.s3prefix != undefined && props.s3prefix != ""){
      params["Prefix"] = props.s3prefix
  }
  console.log(params)
  s3.listObjectsV2(params, (err, data) => {
      if (err) {
          console.log(err);
          return;
      }
      console.log(data);

      let childItems = [];
      for (let i = 0; i < data.Contents.length; i++) {
          let filekey = data.Contents[i].Key;
          console.log(filekey)
          if (props.s3prefix != undefined){
            filekey = filekey.replace(props.s3prefix+"/","")
            console.log(filekey)
          }
          if (filekey.includes("/")) {
              console.log(filekey.split("/")[0])
              childItems.push({"Name":filekey.split("/")[0],"isLeaf":false});
          } else {
              childItems.push({ "Name": filekey,"isLeaf":true });
          }
      }
      const uniqueArray = childItems.filter(
          (obj, index, self) => self.findIndex((o) => o.Name === obj.Name) === index
      );
      items.value = uniqueArray;
  });
});

</script>

<template>
  <ListItems :items="items" @item-selected="itemSelected"/>
</template>

<style scoped>

.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

</style>
