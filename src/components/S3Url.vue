<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
const props = defineProps({
    s3bucket :{
        type : String
    },
    prefixes : {
        type: Array
    }
});

const full_url = ref("s3://");

watchEffect(async () => {
    console.log(props.s3bucket)
    full_url.value = "s3://"

    if (props.s3bucket != undefined){
        full_url.value = "s3://" + props.s3bucket
    }

    if(props.prefixes != undefined && props.prefixes.length > 0){
        full_url.value = full_url.value + "/" + props.prefixes.join("/")
    }
})

</script>

<template>
    <div class="filepath">
    <el-text>File : {{ full_url }}</el-text>
    </div>
</template>

<style scoped>

.filepath {
  border: #999 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

</style>
