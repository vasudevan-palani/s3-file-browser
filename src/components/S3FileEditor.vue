<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import VueJsoneditor from 'vue3-ts-jsoneditor';
const props = defineProps({
    s3url :{
        type : String
    }
});

const json = ref({"name":"value"})

const onJsonChange = (data)=>{
    console.log(data)
}

</script>

<template>
    <div class="file-editor">
          <el-text v-if="s3url == undefined">Please select a file</el-text>
          <el-text v-else>{{s3url}}</el-text>
    </div>
    <div class="s3editor">
        <vue-jsoneditor
            height="400"
            mode="tree"
            v-model:json="json"
        />
        
    </div>
</template>

<style scoped>

.file-editor {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
.s3editor{
    text-align: left;
}
</style>
