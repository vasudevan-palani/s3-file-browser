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

const prefixClicked = (prefixIndex,prefix) => {
  console.log(prefixIndex)
  
  prefixes.value = prefixes.value.splice(0,prefixIndex+1)
  s3prefix.value = prefixes.value.join("/")
  console.log(prefixes)
}

const bucketClicked = (bucketName) => {
  console.log(bucketName)
  
  prefixes.value = []
  s3prefix.value = undefined
  console.log(prefixes)
}


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
    selectedFile.value = `${s3prefix.value}/${keyName}`
  }
}

</script>

<template>
  <div class="home-view">
    <el-row>
      <S3Url @prefix-clicked="prefixClicked" @bucket-clicked="bucketClicked" :s3bucket='s3bucket' :prefixes='prefixes'/>
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
      <el-col :span="19">
        <S3FileEditor :s3bucket="s3bucket" :s3url="selectedFile"/>
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
