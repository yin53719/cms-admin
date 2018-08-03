<template>
    <div>
        <el-row style="padding:0 0 20px 0;">
            <el-col :span="2"> 资讯标题: </el-col> 
             <el-col :span="10" > <h2 style="margin:0;">{{ title }}</h2>  </el-col>
             
            <el-col :span="8" v-if="formFieldValues.status !=0 && $parent.level==1">
                <span style="color:red" >
                    <span v-if="formFieldValues.status==1">优质内容</span>
                    <span v-if="formFieldValues.status==2">一般内容</span>
                    <span v-if="formFieldValues.status==3">劣质内容</span>
                    <span>审核时间：{{ formFieldValues.auditTime }}</span>  
                    <el-button  size="small"  @click="openupdatahandleForce(formFieldValues)" type="success">修改</el-button>
                </span>
              </el-col>
              <el-col :span="4"><el-button @click="$parent.show='auditContent'">返回</el-button></el-col>
        </el-row>
        <el-row style="padding:20px 0;">
            <el-col :span="2"> {{ formFieldValues.commenterName }}: </el-col>  <el-col :span="20"> {{ formFieldValues.commentContent }} </el-col>
        </el-row>
        <el-row style="padding:20px 0;" v-if="$parent.level==2">
            <el-col :span="2"> &nbsp;</el-col>  
            <el-col :span="20"> 
                <el-row v-for="(i,n) in formFieldValues.level2List" :key="n" style="padding:3px 0;">
                    <el-col :span="12" v-if="i.commenterToName"><a style="color:#409eff">{{ i.commenterToName }} </a>回复 <a style="color:#409eff">{{i.commenterName }} </a>：{{i.commentContent }}</el-col>
                    <el-col :span="12" v-else> <a style="color:#409eff">{{ i.commenterName }} </a>：{{i.commentContent }}</el-col>
                    <el-col :span="12" v-if="i.status ==0" >
                        <el-button size="small"  @click="handleForcePing(i,3)" type="primary">劣质内容</el-button>
                        <el-button size="small" @click="handleForcePing(i,2)" type="danger">一般内容</el-button>
                        <el-button size="small" @click="handleForcePing(i,1)" type="success">优质内容</el-button>
                    </el-col>
                    <el-col :span="12" v-else style="color:red">
                        <span v-if="i.status==1">优质内容</span>
                        <span v-if="i.status==2">一般内容</span>
                        <span v-if="i.status==3">劣质内容</span>
                        <span>审核时间：{{ i.auditTime }}</span>  
                        <el-button size="small"  @click="updatahandleForce(i)" type="success">修改</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="text-align:center;margin-top:30px;" v-if="$parent.level==1 && formFieldValues.status == 0">
            <el-button  size="small" @click="handleForce(formFieldValues,3)" type="warning">劣质内容</el-button>
            <el-button size="small" @click="handleForce(formFieldValues,2)" type="primary">一般内容</el-button>
            <el-button  size="small" @click="handleForce(formFieldValues,1)" type="success">优质内容</el-button>
        </el-row>
        <el-dialog title="修改" :visible.sync="dialogFormVisible11">
               <el-radio v-model="radio" :label="1">优质内容</el-radio>
               <el-radio v-model="radio" :label="2">一般内容</el-radio>
               <el-radio v-model="radio" :label="3">劣质内容</el-radio>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible11 = false">取 消</el-button>
            <el-button type="primary" @click="saveUser">保 存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="dialogFormVisiblezhu">
               <el-radio v-model="radio" :label="1">优质内容</el-radio>
               <el-radio v-model="radio" :label="2">一般内容</el-radio>
               <el-radio v-model="radio" :label="3">劣质内容</el-radio>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblezhu = false">取 消</el-button>
            <el-button type="primary" @click="saveUserzhu">保 存</el-button>
          </div>
        </el-dialog>
    </div>
</template>
  
<script>
import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
  export default {
    name:"iframeiframe",
    data () {
      return {
        formFieldValues:'',
        list:[],
        tieziId:this.$parent.tieziId,
        limit:10,
        page:1,
        blockId:this.$parent.blockId,
        userId:'',
        dialogFormVisiblezhu:false,
        radio:1,
        dialogFormVisible11:false,
        autdingDataList:{},
        title:'',
        total:100,
        userList:[]
      }
    }, 
    components:{
    },
     mounted () {
      this.getDataZhu()
    },
    methods: {
        getDataZhu(){
           request({
                url:'/community/audit/queryAuditingDetailList',
                method:'get',
                params:{id:this.$parent.tieziId,businessType:this.$parent.businessType,level:this.$parent.level}
            }).then((res)=>{
                this.formFieldValues=res.data.commentDto;
                this.title=res.data.title
            })
        },
       openupdatahandleForce(){
            this.dialogFormVisiblezhu=true;
            this.radio=this.formFieldValues.status;
        },
    
       updatahandleForce(row){
          this.autdingDataList=row;
          this.radio=row.status;
          this.dialogFormVisible11=true;
       },
       saveUser(){
         this.handleForcePing(this.autdingDataList,this.radio)
       },
       saveUserzhu(){
         this.handleForce(this.formFieldValues,this.radio)
       },
       handleForceHui(){
         
       },
       handleForcePing(row,t) {
           let text = '';
           var data=Object.assign({},row);

           data.status=t;
           data.id=row.commentId;
           data.businessType=this.$parent.businessType;
           if(t==3){
              text='劣质'
           }else if(t==2){
              text='一般'
           }else if(t==1){
              text='优质'
           }
            this.$confirm(`确认为${text}内容?`, "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.dialogFormVisible11=false;
                request({
                    url:'/community/audit/updateAuditStatus',
                    method:'post',
                    data:data
                }).then(() => {
                    this.$message({
                        message:'审核成功',
                        type: 'success'
                    });
                    
                    this.getDataZhu()
                });
            });
    },
    handleForce(row,t) {
           let text = '';
           var data=row;
           data.status=t;
           data.id=row.commentId;
           data.businessType=this.$parent.businessType;
           data.level=this.$parent.level;
           if(t==3){
              text='劣质'
           }else if(t==2){
              text='一般'
           }else if(t==1){
              text='优质'
           }
            this.$confirm(`确认为${text}内容?`, "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.dialogFormVisiblezhu=false;
                request({
                    url:'/community/audit/updateAuditStatus',
                    method:'post',
                    data:data
                }).then(() => {
                    this.$message({
                    message:'审核成功',
                    type: 'success'
                    });
                    
                    this.getDataZhu()
                });
            });
    },
    }
  }
</script>