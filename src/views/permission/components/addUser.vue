<template>
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
            <el-input v-model="addForm.nickname" ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
            <el-select v-model="addForm.roles" placeholder="请选择">
                <el-option v-for="item in role_options" :key="item.role_id" :label="item.role_name" :value="item.role_id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addForm.sex">
                <el-radio class="radio" :label="1">男</el-radio>
                <el-radio class="radio" :label="0">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
            <el-upload
                class="avatar-uploader"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
            <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
            <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
import request from '@/utils/request'
  export default {
    name: 'addUser', 
    data() {
      return {
          action:process.env.BASE_API+'/api/upload',
          role_options:[],
          addFormRules: {
                        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                        sex:[{required: true}],
                        nickname:[{required: true}],
                        birth:[{required: true}],
                        avatar:[{required: true}],
                        roles:[{required: true}],
                        addr:[{required: true}],
                         age:[{required: true}]
                        },
          addForm: {
					username: '',
                    sex: 1,
                    nickname:'',
					age: 10,
					birth: '',
                    addr: '',
                    avatar: '',
                    roles:""
				},
      };
    },
    mounted() {
        this.getRoles()
    },
    methods:{
        getRoles(){
            request({url:'/api/roles'}).then((res)=>{

                this.role_options=res.data;
            });
        },
        handleAvatarSuccess(res, file) {
            this.addForm.avatar =res.url;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        addSubmit: function () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        var obj={
                            url:'/api/users',
                            method:'post',
                            data:para
                        }
                        request(obj).then((res) => {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.$parent.$parent.fetchData()
                            this.$parent.$parent.isShowadd = false;
                        });
                    });
                }
            });
        },
    }
  };
</script>

<style>
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