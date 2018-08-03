<template>
   <el-form label-width="100px"  style="width:600px;">
       <el-row label-width="100px">
            <el-form-item label="活动名称: ">{{activityData.activityTitle}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="报名时间: ">{{activityData.signStartTime}}~{{activityData.signEndTime}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="活动时间: ">{{activityData.activityStartTime}}~{{activityData.activityEndTime}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="活动类型: ">
                <el-col v-model="activityData.activityType" v-if="activityData.activityType == 1004">线上</el-col>
                <el-col v-model="activityData.activityType" v-if="activityData.activityType == 1005">线下</el-col>
            </el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="活动地点: ">{{activityData.activityAddress}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="发布人:">{{activityData.saicUserName}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="发布时间: ">{{activityData.publishTime}}</el-form-item>
       </el-row>
       <el-row label-width="100px">
            <el-form-item label="活动信息: ">
                <div v-html="activityData.detailsActivity" class="detailInfo"></div>
            </el-form-item>
       </el-row>
       <el-row label-width="100px" style="text-align:center;">
           <el-button v-if="activityData.publishStatus!=2" type="danger" @click="downActivity()" center>下架</el-button>
       </el-row>
    </el-form>
</template>
<script>
import request from '@/utils/request';
export default {
   data(){
       return{
        activityData: {
            'id':0,
            'activityTitle': '',
            "signStartTime": "",
            "signEndTime": "",
            "activityStartTime": "",
            "activityEndTime": "",
            "activityType": "",
            "activityAddress": "",
            "detailsActivity": "",
            "saicUserName": "",
            "publishTime": '',
            "publishStatus":'',
            "signStatus":''
        },
        actiId: '',
        signStatus:'',
       }
   },
   created() {
        this.activityData.id = this.$parent.$parent.$parent.activityIdForDetail;
        this.signStatus = this.$parent.$parent.$parent.signStatusForMe;
        console.log(this.signStatus);
        request({
            url: '/community/saicActivity/backActivityDetail',
            method: 'get',
            params: {'saicActivityId':this.activityData.id},
        }).then(response => {
            this.activityData = response.data;
        });
   },
   mounted(){

   },
   methods: {
       //下架
        downActivity(){
            request({
            url: '/community/saicActivity/downActivity',
            method: 'get',
            params: {'saicActivityId':this.activityData.id},
        }).then(response => {
            this.activityData.publishStatus = 2;
        });
        }
   }
}
</script>


<style  >
    .detailInfo{
     width: 500px; 
 }

 .detailInfo p img{
     width: 100%;
 }


</style>

