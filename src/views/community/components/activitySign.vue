<template>
    <div>   
        <div> 
            <el-form label-width="100px"  style="width:600px;">
                <el-row label-width="100px">
                        <el-form-item label="活动名称: ">{{activityData.activityTitle}}</el-form-item>
                </el-row>
                <el-row label-width="100px">
                        <el-form-item label="报名时间: ">{{activityData.signStartTime}}~{{activityData.signEndTime}}&ensp;&ensp;
                            <span v-if="activityData.signStatus == 0"><font color='#67C23A'>即将开启&ensp;&ensp;</font></span>
                            <span v-if="activityData.signStatus == 1"><font color='#FF0000'>火热预约&ensp;&ensp;</font></span>
                            <span v-if="activityData.signStatus == 2"><font color='#909399'>报名结束&ensp;&ensp;</font></span>
                            
                            <el-button v-if="activityData.signStatus!=2" type="danger" size="mini" plain @click="closeSign()">关闭报名</el-button>
                            <!-- <el-button v-if="activityData.activityStatus==2" type="warning" size="mini" plain>报名已满</el-button> -->




                        </el-form-item>
                </el-row>
                <el-row label-width="100px">
                        <el-form-item label="活动时间: ">
                            {{activityData.activityStartTime}}~{{activityData.activityEndTime}}&ensp;&ensp;
                            <!-- <span v-if="activityData.activityStatus == 1"><font color='#E6A23C'>未开始</font></span> -->
                            <span v-if="activityData.activityStatus == 2"><font color='#67C23A'>活动开始&ensp;&ensp;</font></span>
                            <span v-if="activityData.activityStatus == 3"><font color='#FF0000'>活动结束&ensp;&ensp;</font></span>
                        </el-form-item>
                </el-row>
                <el-row label-width="100px">
                        <el-form-item label="浏览量: ">{{activityData.pageviews}}</el-form-item> 
                </el-row>
               
            </el-form>
             <hr>
        </div>
        <div>
             报名用户:&ensp;&ensp;<font color='green'>共{{signTotal}}人报名</font>
            <el-button>发送提醒</el-button>
            <el-table :data="signData"  border style="width: 83%" height="133px">
                <el-table-column align="center" type="index"  label="序号" width="60"></el-table-column>
                <el-table-column align="center" prop="userType" label="类别"  width="120"></el-table-column>
                <el-table-column align="center" prop="carType" label="用户车型" width="120"></el-table-column>
                <el-table-column align="center" prop="name" label="用户名" width="150"></el-table-column>
                <el-table-column align="center" prop="nickName" label="昵称" width="150"></el-table-column>
                <el-table-column align="center" prop="mobilePhone" label="联系方式" width="130"></el-table-column>
                <el-table-column align="center" label="性别"  width="100">

                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==0" >男</span>
                        <span v-else-if="scope.row.sex==1" >女</span>
                        <span v-else>保密</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  prop="age" label="年龄" width="100"></el-table-column>
                <el-table-column align="center" prop="signTime" label="报名时间"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryParam.page" :page-sizes="[2]" :page-size="queryParam.limit" layout="total, sizes, prev, pager, next, jumper" :total="signTotal"> </el-pagination>
            </div>
             <hr style="weight:100px">
        </div>
        <div>
             感兴趣用户:&ensp;&ensp;<font color='green'>共{{intrestTotal}}人感兴趣</font>
            <el-button>发送提醒</el-button>
            <el-table :data="intrestData"  border style="width: 83%" height="133px">
                <el-table-column align="center" type="index"  label="序号" width="60"></el-table-column>
                <el-table-column align="center" prop="userType" label="类别"  width="120"></el-table-column>
                <el-table-column align="center" prop="carType" label="用户车型" width="120"></el-table-column>
                <el-table-column align="center" prop="name" label="用户名" width="150"></el-table-column>
                <el-table-column align="center" prop="nickName" label="昵称" width="150"></el-table-column>
                <el-table-column align="center" prop="mobilePhone" label="联系方式" width="130"></el-table-column>
                <el-table-column align="center" label="性别"  width="100">

                    <template slot-scope="scope">
                        <span v-if="scope.row.sex==0" >男</span>
                        <span v-else-if="scope.row.sex==1" >女</span>
                        <span v-else>保密</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  prop="age" label="年龄" width="100"></el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination @size-change="handleInSizeChange" background @current-change="handleInCurrentChange" :current-page.sync="instrestQueryParam.page" :page-sizes="[2]" :page-size="instrestQueryParam.limit" layout="total, sizes, prev, pager, next, jumper" :total="intrestTotal"> </el-pagination>
            </div>
             <el-row label-width="100px" style="text-align:center;">
                    <el-button v-if="activityData.publishStatus!=2" type="danger" @click="downActivity()">下架</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>
import request from '@/utils/request';
export default {
   data(){
       return{
        queryParam:{
            saicActivityId:'',
            limit: 2,
            page: 1
        },
        instrestQueryParam:{
            saicActivityId:'',
            limit: 2,
            page: 1
        },
        activityData: {
            'id':0,
            'activityTitle': '',
            "signStartTime": "",
            "signEndTime": "",
            "activityStartTime": "",
            "activityEndTime": "",
            "pageviews": 0,
            "activityStatus": "",
            "signStatus":''
        },
        signData: [],
        intrestData: [],
        intrestTotal: 0,
        signTotal: 0
       }
   },
   created() {
       
        this.queryParam.saicActivityId = this.$parent.$parent.$parent.activityIdForDetail;//活动id
        this.instrestQueryParam.saicActivityId = this.$parent.$parent.$parent.activityIdForDetail;//活动id
       
        
        //加载活动信息
        request({
            url: '/community/saicActivity/backActivityDetail',
            method: 'get',
            params: {'saicActivityId':this.queryParam.saicActivityId}
        }).then(response => {
            this.activityData = response.data;
            
        });
        //加载报名情况
       this.getSignList();
       //加载感兴趣用户
       this.getInstrestList();
   },
   mounted(){

   },
   methods: {
        handleSizeChange(val) {
            this.queryParam.limit = val;
            this.getSignList();
        },
        handleCurrentChange(val) {
            console.log(val);
            this.queryParam.page = val;
            this.getSignList();
        },
        handleInSizeChange(val) {
            this.instrestQueryParam.limit = val;
            this.getInstrestList();
        },
        handleInCurrentChange(val) {
            console.log(val);
            this.instrestQueryParam.page = val;
            this.getInstrestList();
        },
        getSignList(){
            request({
                url: '/community/saicActivity/signList',
                method: 'get',
                params: this.queryParam
            }).then(response => {
                this.signData = response.data.rows;
                this.signTotal = response.data.total;
            });
        },
        getInstrestList(){
            request({
                url: '/community/saicActivity/intrestList',
                method: 'get',
                params: this.instrestQueryParam
            }).then(response => {
                this.intrestData = response.data.rows;
                this.intrestTotal = response.data.total;
            });            
        },
        closeSign(){
             request({
                url: '/community/saicActivity/close',
                method: 'get',
                params:{'id':this.queryParam.saicActivityId}
            }).then( (response)=> {
                if(response.resultCode==200){
                    this.$message({
                    title: "成功",
                    message: "关闭报名成功",
                    type: "success",
                    duration: 2000  
                    });
                    this.activityData.signStatus = 2;
                }
               
            });
        },
        downActivity(){
            request({
                url: '/community/saicActivity/downActivity',
                method: 'get',
                params: {'saicActivityId':this.queryParam.saicActivityId}
            }).then(response => {
                if (response.resultCode==200) {
                    this.$message({
                    title: "成功",
                    message: "下架成功",
                    type: "success",
                    duration: 2000
                    });
                this.activityData.publishStatus = 2;
                this.$parent.show = 'activity';
                }
            });
        }

   }
}
</script>