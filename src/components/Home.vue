<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
defineProps<{ parent_file: string; file_path: string }>();

import S3Url from "./S3Url.vue"
import S3Buckets from "./S3Buckets.vue"
import S3Prefixes from "./S3Prefixes.vue"
import S3FileEditor from "./S3FileEditor.vue";

const s3bucket = ref(undefined)
const prefixes = ref([])
const s3prefix = ref(undefined)
const selectedFile = ref(undefined)


const bucketSelected = (bucketName:string) => {
  console.log(bucketName)
  s3bucket.value = bucketName
}

const keySelected = (keyName: string,isLeaf:boolean) => {
  if (keyName != undefined && isLeaf == false){
    prefixes.value.push(keyName)
    s3prefix.value = prefixes.value.join("/")
    console.log(s3prefix.value)
  }
  else {
    selectedFile.value = `s3://${s3bucket.value}/${s3prefix.value}/${keyName}`
  }
}

</script>

<template>
  <div class="home-view">
    <el-row>
      <S3Url :s3bucket='s3bucket' :prefixes='prefixes'/>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div  v-if="s3bucket == undefined">
            <S3Buckets @bucket-selected="bucketSelected"/>
        </div>
        <div  v-else>
            <S3Prefixes :s3bucket="s3bucket" :s3prefix="s3prefix" @key-selected="keySelected" />
        </div>
      </el-col>
      <el-col :span="18">
        <S3FileEditor :s3url="selectedFile"/>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.home-view {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
.filepath {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
.files {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  text-align: left;
}
</style>
