<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import VueJsoneditor from "vue3-ts-jsoneditor";
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'; // For vite
import ace from 'ace-builds';
import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url';
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl);
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);
import { UserIcon, CheckIcon } from "@vue-icons/feather";
import Credentials from "../services/aws";

// Init aws
//
const AWS = require("aws-sdk");

// reactive variables
//
const message = ref("");
const isSaveDisabled = ref(true);
const errorMessage = ref("");
const filetype = ref("unknown")

// Properties
//
const props = defineProps({
  s3url: {
    type: String,
  },
  s3bucket: {
    type: String,
  },
});

let updatedContent:any = undefined

const json = ref('{ name: "value" }');

// functions
//
const getFileType = (url:string)=>{
  if (url.endsWith(".json")){
    return "json"
  }
  if(url.endsWith(".js")){
    return "javascript"
  }
  if(url.endsWith(".py")){
    return "python"
  }
  if(url.endsWith("xml")){
    return "xml"
  }
  if(url.endsWith("yml") || url.endsWith("yaml")){
    return "yaml"
  }
  return "unknown"
}

// handlers
//
const saveContent = () => {

  AWS.config.update({
    accessKeyId: Credentials.getAccessKey(),
    secretAccessKey: Credentials.getSecretKey()
  });
  const s3 = new AWS.S3();

  console.log(updatedContent);
  isSaveDisabled.value = true
  message.value = "Saving...."
  errorMessage.value = ""

  if(updatedContent == undefined || updatedContent == ""){
    console.log("Invalid content");
    message.value = ""
    errorMessage.value = "Invalid Content"
  }

  s3.putObject(
    {
      Bucket: props.s3bucket,
      Key: props.s3url,
      Body: updatedContent,
    },
    (err:any, data:any) => {
      if (err) {
        console.error("Error writing JSON content to S3 object:", err);
        errorMessage.value = "Error writing JSON content to S3 object:" + err
        message.value = ""
        return;
      }
      message.value = "Saved successfully."
      errorMessage.value = ""
      isSaveDisabled.value = false
      console.log("JSON content successfully written to S3 object!");
    }
  );
};

const onJsonChange = (content:any) => {
  console.log(content.text);
  updatedContent = content.text
};

const onChange = (content:any) => {
  console.log(content);
  updatedContent = content
};



// watchers
//
watchEffect(() => {
  if (props.s3bucket == undefined || props.s3url == undefined) {
    return;
  }

  filetype.value = getFileType(props.s3url)

  if (filetype.value == "unknown"){
    return
  }

  AWS.config.update({
    accessKeyId: Credentials.getAccessKey(),
    secretAccessKey: Credentials.getSecretKey()
  });
  const s3 = new AWS.S3();

  s3.getObject(
    {
      Bucket: props.s3bucket,
      Key: props.s3url,
    },
    (err:any, data:any) => {
      if (err) {
        console.error("Error getting JSON object from S3:", err);
        return;
      }
      // Parse the JSON object
     // const jsonObject = JSON.parse(data.Body.toString());
      json.value = data.Body.toString();
      isSaveDisabled.value = false;
    }
  );
});
</script>

<template>
  <div class="file-editor">
    <el-row>
      <el-col :span="20" class="file-name">
        <el-text v-if="s3url == undefined">Please select a file</el-text>
        <el-text v-else>s3://{{ s3bucket }}/{{ s3url }}</el-text>
      </el-col>
      <el-col :span="4" class="file-actions">
        <el-button
          :disabled="isSaveDisabled"
          @click="saveContent"
          type="success"
          :icon="CheckIcon"
          >Save</el-button
        >
      </el-col>
    </el-row>
  </div>
  <div>
    <el-text type="danger">{{ errorMessage }}</el-text>
    <el-text type="success">{{ message }}</el-text>
  </div>
  <div class="s3editor">
    <v-ace-editor v-if="filetype !='unknown' && filetype !='json'" v-model:value="json" @update:value="onChange" lang="filetype" :options="{ useWorker: true }" style="height: 720px" />
    <vue-jsoneditor v-else-if="filetype =='json'"
      height="725"
      mode="text"
      v-model:text="json"
      @change="onJsonChange"
    />
    <el-text v-else> Please select a file or unknown file type </el-text>
  </div>
</template>

<style scoped>
.file-editor {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
.s3editor {
  text-align: left;
  padding: 10px;
}

.file-name {
  text-align: left;
}

.file-actions {
  text-align: right;
}
</style>
