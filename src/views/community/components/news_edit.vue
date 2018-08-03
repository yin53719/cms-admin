<template>
<div >
   <h4 style="margin-top:0">资讯修改</h4>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" >
        <el-row :gutter="20" style="width:600px;" >
        <el-col >
            <el-form-item label="标题资讯" prop="title" >
                <el-input v-model="form.title" :disabled="isDisable"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span='24'>
            <el-form-item label="发布号" style="width:100%" prop="userId">
                <el-select v-model="form.userId" filterable placeholder="请选择" style="width:100%" :disabled="isDisable">
                <el-option
                    v-for="item in userList"
                    :key="item.saicUserId"
                    :label="item.nickName"
                    :value="item.saicUserId">
                </el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="主体图片">
                <el-upload
                    class="avatar-uploader"
                    :action='action'
                    :show-file-list="false"
                    :on-success="handleAvatarSuccessSingle"
                    :before-upload="beforeAvatarUpload"
                    >
                    <img v-if="form.titleImage" :src="form.titleImage" class="avatar" :disabled="isDisable">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="内容概要" prop="newsSummary" >
                <el-input
                    type="textarea"
                    :rows="4"
                    :disabled="isDisable"
                    placeholder="请输入内容"
                    v-model="form.newsSummary">
                </el-input>
            </el-form-item>
        </el-col>
        <el-col :span="24" >
            <el-form-item label="资讯模板" prop="contentType">
                <el-radio v-model="form.contentType" :label="1" :disabled="true">图文</el-radio>
                <el-radio v-model="form.contentType" :label="3" :disabled="true">图片</el-radio>
                <el-radio v-model="form.contentType" :label="4" :disabled="true">视频</el-radio>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row>
            <el-form-item label="" v-show="form.contentType==1" prop="content">
                <div :id="editor" type="text/plain"  style="line-height:20px;height:200px;width:500px;"></div>
            </el-form-item>
            <el-form-item label="" v-if="form.contentType==3" >
                <el-col v-for="(x,i) in photoList" :key="i" style="position:relative;">
                  <el-upload
                            class="avatar-uploader-my"
                            :action='action'
                            :show-file-list="false"
                            style="float:left;margin-right:10px;"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="x.url" :src="x.url" class="avatar-my" :disabled="isDisable">
                            <i v-else class="el-icon-plus avatar-uploader-icon-my"></i>
                        </el-upload>
                      <div @click="openUpload(i)" style="width:100px;height:100px;position:absolute;top:0;left:0;opacity:0;">1111</div>
                    <el-input   
                              type="textarea"
                              style="width:300px;float:left;"
                              :rows="4"
                              placeholder="请输入内容"
                              v-model="x.summary"
                              :disabled="isDisable">
                          </el-input>
                </el-col>
                <el-col><el-button @click="addPhotos" :disabled="isDisable">点击添加</el-button></el-col>
            </el-form-item>
            <el-form-item label="" v-if="form.contentType==4" prop="content" >
              <el-upload
                class="upload-demo"
                :action='action'
                :on-success="handleChange"
                :before-upload="beforeAvatarUploadVideo"
                :show-file-list="false">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传视频文件，不能大于50M</div>
              </el-upload>
                <video :src="form.content" controls="controls" style="width:500px;">
                    your browser does not support the video tag
                </video>
            </el-form-item>

            <el-col :span='24'>
              <el-form-item label="" >
                <el-checkbox v-model="form.isFullpush" :disabled="isDisable">全站推送</el-checkbox>
                <el-checkbox v-model="form.isShow" :disabled="isDisable">是否显示</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
            <el-form-item label="排序" style="width:100%">
                <el-select v-model="form.sort" placeholder="请选择" style="width:200px;" :disabled="isDisable">
                <el-option
                    v-for="item in orderChildren"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                </el-option>
                </el-select>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row style="text-align:center;">
            <el-button  type="primary" v-waves icon="search" @click="cancel">取消</el-button>
            <el-button  type="primary" v-waves icon="search" v-if="isDisable"  @click="isDisable=false">编辑</el-button>
            <el-button  type="primary" v-waves icon="search"  @click="preview">预览</el-button>
            <el-button  type="primary" v-waves icon="search"  @click="save(1001,1)">保存</el-button>
            <el-button  type="primary" v-waves icon="search"  @click="publish">发布</el-button>
        </el-row>
    </el-form>
      <el-dialog title="预览" :visible.sync="previewShow" width="454px">
       <iframe :src="this.iframeUrl" frameborder="0" style="height:500px;width:100%;"></iframe>
      </el-dialog>
</div>
    
</template>


<script>
import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
export default {
    name:'news-add',
    data(){
      return {
        ue:'',
        editor:new Date().getTime().toString(),
        userList:[],
        index:0,
        isDisable:true,
        previewShow:false,
        action:process.env.BASE_API +'/cmyManage/sys/uploadFile',
        iframeUrl:'',
        typeOptions: [{code:null,name:'全部'},{code:1,name:'是'},{code:0,name:'否'}],
      statusOptions:[{code:null,name:'全部'},{code:1001,name:'草稿'},{code:1002,name:'已删除'},{code:1004,name:'有效'}],
        form: {
            startDate:'',
            contentType:'',
            userId:'',
            titleImage:'',
            newsSummary:'',
            isFullpush:false,
            isShow:true,
            sort:'',
            title:'',
            photoList:[{
              url:'',
              summary:''
            }],
            content:'',

        },
        photoList:[],
        orderChildren:[{code:'',name:'无特殊排序需求'}],
        rules: {
        title: [
          {
            required: true,
            message: "请输入资讯标题",
            trigger: "blur"
          },
          {
            // min: 0,
            max: 100,
            message: "资讯标题长度不能超过100个字符",
            trigger: "blur"
          }
        ],
        userId: [
          {
            required: true,
            message: "发布号",
            trigger: "blur"
          }
        ],
        newsSummary: [
          {
            required: true,
            message: "内容概要",
            trigger: "blur"
          },
          {
            // min: 3,
            max: 30,
            message: "资讯摘要不能超过30个字符",
            trigger: "blur"
          }
        ],
        contentType:[
          {
            required: true,
            message: "资讯类型",
            trigger: "blur"
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ],
        telPhone:[
          { 
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {validator:function(rule,value,callback){
            if(/^1[34578]\d{9}$/.test(value) == false){
                callback(new Error("请输入正确的手机号"));
            }else{
                callback();
            }
        }, trigger: 'blur'}
        ]
        ,
         email:[
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'  }
        ]
      },
      }
    },
  mounted(){

    this.ue = window.UE.getEditor(this.editor,{
      toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'insertvideo',  'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
        ]],
        height:250,

    });
    for (let i = 1; i <= 99; i++) {
        this.orderChildren.push({code:i,name:i})
    }

    request({
          url:'/community/news/queryDetailNews',
          method:'get',
          params:{'id':this.$parent.newsid}
      }).then(response => {
        // 这里是处理正确的回调
        this.form = response.data;
        if(response.data.contentType==3){
         this.photoList= JSON.parse(response.data.content)
        }
        
        this.ue.setContent(this.form.content);
      });
      request({
        url:'community/user/saicUser/findOfficialUser',
        method:'get',
        params:{userPublishType:1}
    }).then((res)=>{
  
       this.userList=res.data;
       
    })
  },
  methods: {
    handleAvatarSuccess(res, file,i) {
        this.photoList[this.index].url = res.data;
    },
    handleAvatarSuccessSingle(res) {
        this.form.titleImage = res.data;
    },

    handleChange(file, fileList) {

      this.form.content = file.data;
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
        // }
       
        return (isJPG || ispnG);
    },
    beforeAvatarUploadVideo(file) {
        const isJPG = file.type === 'image/jpeg';
        const ispnG = file.type === 'image/png';
        const isVideo50MB = file.size / 1024 /1024 < 51;
        // if (!(isJPG || ispnG)) {
        //   this.$message.error('上传头像图片只能是 JPG  PNG格式!');
        // }
        if (!isVideo50MB) {
          this.$message.error('上传视频大小不能超过 50MB!');
        }
        return isVideo50MB;
    },
    
    cancel(){
      this.$parent.show='news';
    },
    preview(){
      this.save(1001,3)
    },
    publish(){
      this.save(1004,2)
    },
    openUpload(i){
      this.index=i;
      $($('.avatar-uploader-my')[i]).find('.el-upload__input').click();
    },
    deleteNews(formName){

    },
    addPhotos(){

      this.photoList.push({
        url:'',
        summary:''
      });
    },
    save(t,ts){
      var data=this.form;
      var isShow = data.isShow;
      var isFullpush = data.isFullpush;
      if(ts==1 || ts==3){
        var text='修改';
        if(data.status==1004){
          data.oldStatus=1004;
        }else{
           data.oldStatus=data.status;
        }
      }else if(ts==2){
        var text='发布';
         data.oldStatus=1001;
         data.status=1004;

      }
      //是否展示
      if(isShow){
        data.isShow=1;
      }else{
        data.isShow = 0;
      }
      //是否全站推送
      if (isFullpush) {
        data.isFullpush=1;
      }else{
        data.isFullpush=0;
      }
      //校验主题图片是为空
      if (data.titleImage==null || data.titleImage=='') {
        this.$message.error('请选择上传的图片!');
        return false;
      }
     
       var type=null;
      //校验资讯内容不能为空
      
      if(data.contentType==1){
         data['content']=this.ue.getContent();
      
         if (data['content'].length==0) {
           this.$message.error('资讯内容不能为空!');
           return false;
         }
         type='Default';
      }else if(data.contentType==3){
         data['content']=JSON.stringify(this.photoList);
  
          if (data['content'].length==0) {
           this.$message.error('资讯图片不能为空!');
           return false;
         }
         type='NewsImg';
      }else if(data.contentType==4){
          data['content']=this.form.content;
         
          if (data['content'].length==0) {
           this.$message.error('资讯视频不能为空!');
           return false;
         }
          type='NewsVedio';
      }
      
      const set = this.$refs;
      set.form.validate((valid) => {
        if(valid){
          request({
              url:'/community/news/updateNews',
              method:'post',
              data:postData(data)
            }).then((res)=>{
              
              
              if(ts==2 || ts==1){
                this.$message({
                  message: text+"成功",
                  type: "success",
                  duration: 2000
                });
                  this.$parent.show='news';
              }

              if(ts==3){
                  let type='';
                  if(this.form.contentType==1){
                    type='Default';
                  }else if(this.form.contentType==3){
                    type='NewsImg';
                  }else if(this.form.contentType==4){
                    type='NewsVedio';
                  }
                  
                this.iframeUrl=location.origin+'/saicui/preview?id='+this.form.id+'&type='+type;
                this.previewShow=true;
              }
              
          })
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


   .avatar-uploader-my .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-my .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon-my {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar-my {
    width: 100px;
    height: 100px;
    display: block;
  }
  /* .el-upload-list.el-upload-list--text{
    display: none;
  } */
</style>
