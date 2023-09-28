<script setup lang="ts">
import { ref } from "vue";
import { UserIcon, CheckIcon } from "@vue-icons/feather";
import { useRouter, useRoute } from "vue-router";

import Credentials  from '../../services/aws'

defineProps<{ msg: string }>();
const emit = defineEmits(["showMessage"]);
const router = useRouter();
const aws_profile = ref<string>("");
const aws_access_key_id = ref<string>("");
const aws_secret_access_key = ref<string>("");
const default_region = ref<string>("");
const saveAwsSettings = () => {

  
  emit("showMessage", "AWS settings saved.");
  Credentials.setAccessKey(aws_access_key_id.value)
  Credentials.setSecretKey(aws_secret_access_key.value)
  process.env.AWS_PROFILE = aws_profile.value;
  process.env.aws_access_key_id = aws_access_key_id.value;
  process.env.aws_secret_access_key = aws_secret_access_key.value;
  process.env.default_region = default_region.value;
  router.push("/home");  
  
};

const count = ref(0);
</script>

<template>
  <el-row class="form-row">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
      >Enter the AWS Profile Name</span
    >
    <el-input
      v-model="aws_profile"
      class="w-50 m-2"
      placeholder="Enter AWS Profile to use"
      :suffix-icon="UserIcon"
    />
  </el-row>
  <el-row class="form-row">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
      >Enter the AWS Access Id</span
    >
    <el-input
      v-model="aws_access_key_id"
      class="w-50 m-2"
      placeholder="Access Key"
      :suffix-icon="UserIcon"
    />
  </el-row>
  <el-row class="form-row">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
      >Enter the AWS Seceret Id</span
    >
    <el-input
      v-model="aws_secret_access_key"
      class="w-50 m-2"
      placeholder="Secret Access Key"
      :suffix-icon="UserIcon"
    />
  </el-row>
  <el-row class="form-row">
    <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
      >Enter default region</span
    >
    <el-input
      v-model="default_region"
      class="w-50 m-2"
      placeholder="Default region"
      :suffix-icon="UserIcon"
    />
  </el-row>
  <el-row class="form-row">
    <el-button @click="saveAwsSettings" type="success" :icon="CheckIcon"
      >Success</el-button
    >
  </el-row>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
.form-row {
  margin-bottom: 10px;
}
</style>
