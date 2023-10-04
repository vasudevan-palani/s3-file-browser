<script lang="ts">
import { ref, defineComponent } from 'vue';
import { SettingsIcon, FileIcon, MinusIcon, PlusIcon,XIcon } from '@vue-icons/feather';
import { useRouter, useRoute } from 'vue-router';
const { ipcRenderer } = require('electron');


export default defineComponent({
    props : {
    },
    setup(){
        const router = useRouter()
        router.push('/');
        const error_message = ref("")
        const message = ref("Message")
        const gotoAwsSettings = () => {
            router.push('/settings/aws'); // Replace '/about' with the path you want to navigate to      
        }

        const gotoFolder = () => {
            router.push('/home'); // Replace '/about' with the path you want to navigate to      
        }

        const showMessage=(msg:string) =>{
          console.log(msg)
          message.value = msg
        }

        const showErrorMessage=(msg:string) =>{
          error_message.value = msg
        }

        const  dblclickNavBar = () => {
          ipcRenderer.send('dblclick-navbar');
        }

        const isWindows = () => {
          console.log(process.platform)
          return process.platform == "win32"
        }
        

        return {
            showMessage : showMessage,
            showErrorMessage : showErrorMessage,
            error_message : error_message,
            message : message,
            dblclickNavBar: dblclickNavBar,
            gotoFolder : gotoFolder,
            gotoAwsSettings : gotoAwsSettings,
            SettingsIcon: SettingsIcon,
            FileIcon : FileIcon,
            MinusIcon : MinusIcon,
            PlusIcon : PlusIcon,
            XIcon : XIcon,
            isWindows:isWindows
        }
    }
})

</script>

<template>
  <!-- <el-row  v-on:dblclick="dblclickNavBar" class="nav-bar">
    <el-col :span="24">
      <p  class="title"> S3 File Browser</p>
    </el-col>
  </el-row> -->
  <header id="titlebar">
      <div id="drag-region">

        <div id="window-title">
          <span>S3 File Browser</span>
        </div>
        <div v-if="isWindows()" class="window-button-container">
            <el-button class="window-buttons" :icon="MinusIcon"/>
            <el-button class="window-buttons" :icon="PlusIcon"/>
            <el-button class="window-buttons" :icon="XIcon"/>
        </div>
      </div>
    </header>
  <el-row class="body-container">
    <el-col :span="1">
        <el-button class="left-menu-buttons" type="primary" @click="gotoAwsSettings" :icon="SettingsIcon" circle />
        <div class="menu-button-label">Settings</div>
        <el-button class="left-menu-buttons" type="primary" :icon="FileIcon" @click="gotoFolder" circle />
        <div class="menu-button-label">Files</div>
    </el-col>
    <el-col :span="23">
      <div  class="home-area">
        <router-view @showErrorMessage="showErrorMessage" @showMessage="showMessage"></router-view>
      </div>
    </el-col>
  </el-row>
  
</template>

<style>
.window-button-container{
  position:fixed;
  right:0px;
  top:0px;
}
.menu-button-label {
  margin-bottom: 20px;
}
.body-container{
  padding: 1rem;
}
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


.left-menu-buttons{
  padding:20px!important;
  height: 65px;
  font-size: 1.5em;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.window-buttons{
  margin-left:0px!important;
  background-color: #409eff;
  color: white;
}
</style>
