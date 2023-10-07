<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
defineProps<{ parent_file: string; file_path: string }>();

import S3Url from "./S3Url.vue"
import S3Buckets from "./S3Buckets.vue"
import S3Prefixes from "./S3Prefixes.vue"
import S3FileEditor from "./S3FileEditor.vue";

const s3bucket = ref<string|undefined>(undefined)
const prefixes = ref<string[]>([])
const s3prefix = ref<string|undefined>(undefined)
const selectedFile = ref<string|undefined>(undefined)
const selectedFileLastModified = ref("")
const selectedFileSize = ref(0)

const prefixClicked = (prefixIndex:number,prefix:string) => {
  console.log(prefixIndex)
  
  prefixes.value = prefixes.value.splice(0,prefixIndex+1)
  s3prefix.value = prefixes.value.join("/")
  console.log(prefixes)
}

const onResetAll = () => {
  prefixes.value = []
  s3prefix.value = undefined
  s3bucket.value = undefined
}

const bucketClicked = (bucketName:string) => {
  console.log(bucketName)
  
  prefixes.value = []
  s3prefix.value = undefined
  console.log(prefixes)
}


const bucketSelected = (bucketName:string) => {
  console.log(bucketName)
  s3bucket.value = bucketName
  prefixes.value = []
  s3prefix.value = undefined
  selectedFile.value = undefined
}

const keySelected = (keyName: string,isLeaf:boolean,lastModified:string="",size:number=0) => {
  if (keyName != undefined && isLeaf == false){
    prefixes.value.push(keyName)
    s3prefix.value = prefixes.value.join("/")
    console.log(s3prefix.value)
  }
  else {
    console.log(s3prefix.value)
    selectedFileSize.value = size
    selectedFileLastModified.value = lastModified
    if (s3prefix.value != undefined && s3prefix.value != null && s3prefix.value != ""){
      selectedFile.value = `${s3prefix.value}/${keyName}`
    }
    else{
      selectedFile.value = `${keyName}`
    }

    

    console.log(keyName)
    console.log(selectedFile.value)
    
  }
}

</script>

<template>
  <div class="home-view">
    <el-row>
      <S3Url @on-reset-all="onResetAll" @prefix-clicked="prefixClicked" @bucket-clicked="bucketClicked" :s3bucket='s3bucket' :prefixes='prefixes'/>
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
        <S3FileEditor :size="selectedFileSize" :lastmodified="selectedFileLastModified" :s3bucket="s3bucket" :s3url="selectedFile"/>
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
