<script setup lang="ts">
import { ref } from 'vue'
import { UserIcon, CheckIcon } from '@vue-icons/feather';
import { useRouter, useRoute } from 'vue-router';

defineProps<{ msg: string }>()
const emit = defineEmits(["showMessage"]);
const router = useRouter()

const saveAwsSettings = () =>{
    emit('showMessage','AWS settings saved.')
    router.push('/')
}

const count = ref(0)
const aws_profile = ref("")
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
        <el-button @click="saveAwsSettings" type="success" :icon="CheckIcon">Success</el-button>
    </el-row>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
.form-row{
  margin-bottom: 10px;
}
</style>
