<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import VueJsoneditor from "vue3-ts-jsoneditor";
import { UserIcon, CheckIcon } from "@vue-icons/feather";
const AWS = require("aws-sdk");
AWS.config.update({
  profile: process.env.AWS_PROFILE,
});

const message = ref("");

const isSaveDisabled = ref(true);

const errorMessage = ref("");

const s3 = new AWS.S3();

const props = defineProps({
  s3url: {
    type: String,
  },
  s3bucket: {
    type: String,
  },
});

let updatedContent:any = undefined

const json = ref({ name: "value" });

const saveContent = () => {
  console.log(updatedContent);
  isSaveDisabled.value = true
  message.value = "Saving...."
  errorMessage.value = ""
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

const onChange = (content:any) => {
  console.log(content);
  updatedContent = content.text
};

watchEffect(() => {
  if (props.s3bucket == undefined || props.s3url == undefined) {
    return;
  }

  s3.getObject(
    {
      Bucket: props.s3bucket,
      Key: props.s3url,
    },
    (err, data) => {
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
    <vue-jsoneditor
      height="725"
      mode="text"
      v-model:text="json"
      @change="onChange"
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
