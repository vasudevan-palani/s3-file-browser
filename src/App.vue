<script lang="ts">
import { ref, defineComponent } from 'vue';
import { SettingsIcon, FileIcon } from '@vue-icons/feather';
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

        let isDragging:boolean = false
        let offsetX:any = undefined
        let offsetY:any = undefined
        
        const startDrag = (e:any) => {
          isDragging = true;
          const rect = e.target.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
        }

        const drag = (e:any) => {
          if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            ipcRenderer.send('move-window',x,y)
          }
        }

        const endDrag = (e:any) => {
          isDragging = false
        }



        // let offset:any = []

        // const onMouseDown = (e:any)=>{
        //   console.log(e.clientX,e.clientY)
        //   offset = [e.clientX, e.clientY]
        // }

        // const dragstart = (e)=>{
        //   console.log(e)
        //   let x = e.clientX
        //   let y = e.clientY
        //   let x1 = Math.round(x - offset[0])
        //   let y1 = Math.round(y - offset[1])
        //   console.log(x1,y1)
        //   //if (x1 > 0){
        //   ipcRenderer.send('move-window',x1,y1)
        //   //}
          
        // }
        

        return {
            showMessage : showMessage,
            showErrorMessage : showErrorMessage,
            error_message : error_message,
            message : message,
            startDrag:startDrag,
            drag : drag,
            endDrag : endDrag,
            dblclickNavBar: dblclickNavBar,
            gotoFolder : gotoFolder,
            gotoAwsSettings : gotoAwsSettings,
            SettingsIcon: SettingsIcon,
            FileIcon : FileIcon
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
</style>
