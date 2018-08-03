<template>
<div >
    <h4>帖子新增</h4>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules" >
        <el-row :gutter="20" style="width:600px;" >
        <el-col :span='24' >
            <el-form-item label="帖子标题" prop="title" >
                <el-input v-model="form.title" :max="30"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span='24'>
            <el-form-item label="发布号" style="width:100%" prop="userId">
                <el-select v-model="form.userId" filterable placeholder="请选择" style="width:100%">
                <el-option
                    v-for="item in userList"
                    :key="item.saicUserId"
                    :label="item.nickName"
                    :value="item.saicUserId">
                </el-option>
                </el-select>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row>
            <el-form-item label="帖子内容" >
                <div :id="editor" type="text/plain" style="line-height:20px;height:200px;width:500px;" ></div>
            </el-form-item>

        </el-row>
        <el-row style="text-align:center;">
            <el-button  type="primary" v-waves icon="search" @click="cancel">取消</el-button>
            <el-button  type="primary" v-waves icon="search" @click="save">保存</el-button>
            <el-button  type="primary" v-waves icon="search"  @click="preview">预览</el-button>
            <el-button  type="primary" icon="edit"  @click="publish">发布</el-button>
        </el-row>
    </el-form>
</div>
    
</template>


<script>
import request from '@/utils/request';
export default {
    name:'news-add',
    data(){
      return {
        ue:'',
        userList:[],
        index:0,
        editor:new Date().getTime().toString(),
        typeOptions: [{code:null,name:'全部'},{code:1,name:'是'},{code:0,name:'否'}],
      statusOptions:[{code:null,name:'全部'},{code:1001,name:'草稿'},{code:1002,name:'已删除'},{code:1004,name:'有效'}],
        form: {
            title:'',
            content:'',
            userId:'',
            blockId:this.$parent.blockId,
            publishOrigin:1

        },
        orderChildren:[],
        rules: {
        title: [
          {
            required: true,
            message: "请输入帖子标题",
            trigger: "blur"
          },
          {
            // min: 0,
            max: 30,
            message: "帖子标题长度不能超过30个字符",
            trigger: "blur"
          }
        ],
        userId: [
          {
            required: true,
            message: "发布号",
            trigger: "blur"
          }
        ]
      },
      updateStatus:"",
      editStatus:"",
      saveOk:false,
      }
    },
  mounted(){
    this.ue = window.UE.getEditor(this.editor);
    request({
        url:'community/user/saicUser/findOfficialUser',
        method:'get',
        params:{'userPublishType':2} 
    }).then((res)=>{
       this.userList=res.data;
    })


    for (let i = 1; i <= 99; i++) {
        this.orderChildren.push(i)
    }
  },
  methods: {
    cancel(){
      this.$parent.show='forum';
    },
    preview(){
      
    },
    publish(){
      
      var data=this.form;
      data['content']=this.ue.getContent();
      data.publishStatus=1;

     if (data.title=='') {
        this.$message.error('帖子标题不能为空!');
        return false;
      }
     if (data.userId=='') {
        this.$message.error('发布号不能为空!');
        return false;
      }
      if (data['content'].length==0) {
        this.$message.error('帖子内容不能为空!');
        return false;
      }
      request({
        url:'/community/article/insertArticle',
        method:'post',
        data:data
      }).then(res => {
          this.$message({
            message: "发布成功",
            type: "success",
            duration: 2000
          });
          this.$parent.show='forum';
      });
    },
    save(){
      var data=this.form;
      data['content']=this.ue.getContent();
       if (data.title=='') {
        this.$message.error('帖子标题不能为空!');
        return false;
      }
      if (data.userId=='') {
        this.$message.error('发布号不能为空!');
        return false;
      }
      if (data['content'].length==0) {
        this.$message.error('帖子内容不能为空!');
        return false;
      }
      data.publishStatus=0;
      request({
        url:'/community/article/insertArticle',
        method:'post',
        data:data
      }).then(res => {
        this.$message({
          message: "保存成功",
          type: "success",
          duration: 2000
        });
        this.$parent.show='forum';
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
