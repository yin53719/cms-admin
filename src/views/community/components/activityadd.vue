<template>
    <div>    

        <el-form :model="addform" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="发布号" prop="saicUserId">
            <el-select v-model="saicUserId" filterable placeholder="请选择" @change="userBlur(saicUserId)">
              <el-option
                v-for="item in userList"
                :key="item.saicUserId"
                :label="item.nickName"
                :value="item.saicUserId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="活动名称" prop="activityTitle">
                <el-input maxlength='100' style="width:350px" v-model="addform.activityTitle" placeholder="请输入活动名称"></el-input>
            </el-form-item>
            <el-form-item label="报名时间" prop="signTime">
                <el-date-picker @change="signBlur(signTime)"
                v-model="signTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" 
                :default-time="['23:59:59', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动时间" prop="activityTime">
                <el-date-picker @change="activityBlur(activityTime)"
                v-model="activityTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" :default-time="['23:59:59', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动类型" prop="activityType">
                <el-select v-model="addform.activityType" placeholder="请选择"  @change="selectChange(addform.activityType)">
                <!-- <el-option label="全部" value="1003"></el-option> -->
                <el-option label="线上" value="1004"></el-option>
                <el-option label="线下" value="1005"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动地点" prop="activityAddress" v-if="addressStatus == 'show'">
                <el-input style="width:350px" v-model="addform.activityAddress" placeholder="请输入活动地点"></el-input>
            </el-form-item>
            <el-form-item label="排序号" prop="sort">
                <el-select class="filter-item" v-model="addform.sort" placeholder="请选择">
                <el-option v-for="item in  sorts" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="外漏图片" prop="outPic">
                <el-upload
                    class="avatar-uploader"
                    :action='action'
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess1"
                    >
                    <img v-if="addform.outPic" :src="addform.outPic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="详情图片" prop="detailsPic">
                <el-upload
                    class="avatar-uploader"
                    :action='action'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <img v-if="addform.detailsPic" :src="addform.detailsPic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="活动说明" prop="detailsActivity" >
                <div id="editor" type="text/plain"  style="line-height:20px;height:200px;width:500px;"></div>
            </el-form-item>
            <el-row style="text-align:center;">
                <el-button class="filter-item" v-if="addform.publishStatus==0" type="danger" v-waves icon="info" @click="deleteActivity('form')">删除</el-button>
                <el-button class="filter-item" type="info" v-waves icon="info" @click="handleCancel">取消</el-button>
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="save('form')">保存</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" @click="publish('form')" type="success" icon="edit">发布</el-button>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import request from '@/utils/request';
export default {
    data(){
      return {
        ue:'',
        saicUserId: '',
        addform: {
            'activityTime':[],
            "signTime": [],
            'id':0,
            "activityAddress": '',
            "activityEndTime": '',
            "activityStartTime": '',
            "activityTitle": '',
            "activityType": '',
            "detailsActivity": '',
            "detailsPic": '',
            "outPic": '',
            "saicUserId": '',
            "saveOrPublsih": 0,
            "signEndTime": '',
            "signStartTime": '',
            "sort": '',
            "deleteStatus":''
        },
        signTime:[],
        action:process.env.BASE_API +'/cmyManage/sys/uploadFile',
        activityTime: [],
        addressStatus: 'hidden',
        sorts:[],
        userList:[],
        buttonSwitch: true,
        rules: {
        activityTitle: [
          {
            required: true,
            message: "请输入活动名",
            trigger: "blur"
          },
          {
            max: 100,
            message: "长度最多100个字符",
            trigger: "blur"
          }
        ],
        signTime: [
          {
            required: true,
            message: "请选择报名时间",
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            message: "请选择排序号",
            trigger: "change"
          }
        ],
        activityTime: [
          {
            required: true,
            message: "请选择活动时间",
            trigger: "blur"
          }
        ],
        saicUserId: [
          {
            required: true,
            message: "请选择发布号",
            trigger: "change"
          }
        ],
        activityAddress:[
          {
            required: true,
            message: "请填写活动地址",
            trigger: "change"
          }
        ],
        activityType:[
          {
            required: true,
            message: "请选择活动类型",
            trigger: "change"
          }
        ],
        detailsActivity:[
          {
            required: true,
            message: "请填写活动内容",
            trigger: "blur"
          }
        ],
      },
      }
    },
  mounted(){
    UE.delEditor('editor');
    this.ue = window.UE.getEditor('editor');
    this.addform.deleteStatus = this.$parent.publishStatus;
    console.log(this.addform.deleteStatus+"*********");
    if(this.$parent.activityUpdata){
      request({
        url: '/community/saicActivity/queryActivityForUpdate',
        method: 'get',
        params: {'saicActivityId':this.$parent.activityUpdata}
      }).then(response => {
        this.addform = response.data
        console.log(this.addform.publishStatus);
        
        if(this.addform.activityType == 1005){
              this.addressStatus='show'
        }
        var resdata = response.data;
        this.signTime = [new Date(response.data.signStartTime),new Date(response.data.signEndTime)];

        this.activityTime = [new Date(resdata.activityStartTime),new Date(resdata.activityEndTime)];
        this.saicUserId = resdata.publisherId;
        this.addform.saicUserId = resdata.publisherId;
        this.ue.setContent(resdata.detailsActivity);
        
      });
    }
    request({
        url:'community/user/saicUser/findOfficialUser',
        method:'get',
        params:{'userPublishType':0}
    }).then((res)=>{
       console.log(res);
       this.userList=res.data;
    })
    for(var i = 1 ; i < 100 ; i++){
      this.sorts.push(i);
    }
  },
  methods: {
    activityBlur(activityTime){
      this.addform.activityTime = activityTime;
    },
    signBlur(signTime){
      this.addform.signTime = signTime;
    },
    userBlur(val){
      this.addform.saicUserId = val;
    },
    notifyUser(val1,val2){
      if(val1.length==0){
        this.$message({
          title: "提示",
          message: "请上传外漏图片",
          type: "warrning",
          duration: 2000
        });
        return false;
      }
      if(val2.length==0){
        this.$message({
          title: "提示",
          message: "请上传详情图片",
          type: "warrning",
          duration: 2000
        });
        return false;
      }
      return true;
    },
    save(formName){

      //判断buttonSwitch是否开启，未开启，不允许发送请求
      if(!this.buttonSwitch){
        return false;
      }
      this.buttonSwitch = false;//开关关闭
      //处理时间
      this.addform.activityTime = this.activityTime;
      this.addform.signTime = this.signTime;
      if(this.addform.activityTime != null && this.addform.activityTime.length>0){
        this.addform.activityStartTime = this.addform.activityTime[0];
        this.addform.activityEndTime = this.addform.activityTime[1];
      }
      if(this.addform.signTime != null && this.addform.signTime.length>0){
        this.addform.signStartTime = this.addform.signTime[0];
        this.addform.signEndTime = this.addform.signTime[1];
      }
      this.addform.detailsActivity = this.ue.getContent();
      // return false;
      this.addform.saveOrPublsih = 0;
      // const set = this.$refs;
      this.$refs[formName].validate(valid => {
        console.log(valid);
        
        if (valid && this.notifyUser(this.addform.outPic,this.addform.detailsPic)) {
          request({
              url: '/community/saicActivity/save',
              method: 'post',
              data: this.addform,
          }).then(response => {
             if(response.resultCode == 200){
                this.$message({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                  duration: 2000
                });
               this.$parent.show='activity';
               this.buttonSwitch = true;//开关打开
             }else{
                this.buttonSwitch = true;//开关打开
                return false;
             }
          });
        }else{
          this.buttonSwitch = true;//开关打开
          return false;
        }
      })
    },
    publish(formName){
      //判断buttonSwitch是否开启，未开启，不允许发送请求
      if(!this.buttonSwitch){
        return false;
      }
      this.buttonSwitch = false;//开关关闭
      //处理时间
      this.addform.activityTime = this.activityTime;
      this.addform.signTime = this.signTime;
      if(this.addform.activityTime != null && this.addform.activityTime.length>0){
        this.addform.activityStartTime = this.addform.activityTime[0];
        this.addform.activityEndTime = this.addform.activityTime[1];
      }
      if(this.addform.signTime != null && this.addform.signTime.length>0){
        this.addform.signStartTime = this.addform.signTime[0];
        this.addform.signEndTime = this.addform.signTime[1];
      }
      this.addform.detailsActivity = this.ue.getContent();
      // return false;
      this.addform.saveOrPublsih = 1;
      const set = this.$refs;
      set[formName].validate((valid) => {
        console.log(valid);
        if (valid && this.notifyUser(this.addform.outPic,this.addform.detailsPic)) {
          request({
              url: '/community/saicActivity/save',
              method: 'post',
              data: this.addform,
          }).then(response => {
            if(response.resultCode == 200){
                this.$message({
                  title: "成功",
                  message: "发布成功",
                  type: "success",
                  duration: 2000
                });
                this.$parent.show='activity';
                this.buttonSwitch = true;//开关打开
            }else{
                this.buttonSwitch = true;//开关打开
                return false;
            }
          });
        }else{
          this.buttonSwitch = true;//开关打开
          return false;
        }
      })
    },
    handleCancel() {
      this.$confirm('是否保存修改内容?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.save('form')){
            this.$parent.show='activity' ;//跳转页面
          };
          return false;
        }).catch(() => {
          this.$parent.show='activity' //跳转页面
        });
    },
    selectChange(val){
      if(val == ''){
        this.$refs[formName].activityType.validate();
      }
      if(val == 1005){
         this.addressStatus='show'
      }else{
        this.addressStatus='hidden';
        this.addform.activityAddress = '';
      }
    },
    handleAvatarSuccess(res, file) {
      
       this.addform.detailsPic = res.data;
    },
     handleAvatarSuccess1(res, file) {
      this.addform.outPic = res.data;
        
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const ispnG = file.type === 'image/png';
        // const isLt250k = file.size / 1024  < 251;
        
        if (!(isJPG || ispnG)) {
          this.$message.error('上传头像图片只能是 JPG  PNG格式!');
        }
        // if (!isLt250k) {
        //   this.$message.error('上传头像图片大小不能超过 250KB!');
        //  }
       
        return (isJPG || ispnG);
    },
    deleteActivity(formName){
      request({
              url: '/community/saicActivity/delete',
              method: 'get',
              params:{'id':this.$parent.activityUpdata}
          }).then(response => {
            if(response.resultCode == 200){
                this.$message({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 2000
                });
                this.$parent.show='activity';
            }else{
              return false;
            }
          });
    }
  }
}
</script>



<style >
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>