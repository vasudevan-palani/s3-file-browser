<script lang="ts">
import { ref, defineComponent } from 'vue';
import { SettingsIcon, FileIcon } from '@vue-icons/feather';
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
    props : {
    },
    setup(){
        const router = useRouter()
        const error_message = ref("")
        const message = ref("Message")
        const gotoAwsSettings = () => {
            router.push('/settings/aws'); // Replace '/about' with the path you want to navigate to      
        }

        const showMessage=(msg:string) =>{
          console.log(msg)
          message.value = msg
        }

        const showErrorMessage=(msg:string) =>{
          error_message.value = msg
        }

        return {
            showMessage : showMessage,
            showErrorMessage : showErrorMessage,
            error_message : error_message,
            message : message,
            gotoAwsSettings : gotoAwsSettings,
            SettingsIcon: SettingsIcon,
            FileIcon : FileIcon
        }
    }
})

</script>

<template>
  <el-row>
    <el-col :span="1">
      <el-row class="menu-button">
        <el-button type="primary" @click="gotoAwsSettings" :icon="SettingsIcon" circle />
      </el-row>
      <el-row class="menu-button">
        <el-button type="primary" :icon="FileIcon" circle />
      </el-row>
    </el-col>
    <el-col :span="23">
      <div  class="home-area">
        <router-view @showErrorMessage="showErrorMessage" @showMessage="showMessage"></router-view>
      </div>
    </el-col>
  </el-row>
  
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
