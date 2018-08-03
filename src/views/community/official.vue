<template>
<div class="app-container calendar-list-container">
    <div class="filter-container" >
        <el-form  label-width="100px">
            <el-row :gutter="20">
                <el-col :span="6" >
                    <el-form-item label="官方号名称" >
                        <el-input v-model="listQuery.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="登录账号">
                        <el-input v-model="listQuery.account"></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="12" style="text-align:right;" >
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
                    <el-button class="filter-item"   style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">创建</el-button>
                </el-col>     
            </el-row>
        </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="序号" width="65"  type="index"> </el-table-column>
        <el-table-column width="200" align="center" label="官方号名称"> <template slot-scope="scope">
            <span>{{scope.row.nickName}}</span>
        </template> </el-table-column>
        <el-table-column width="150" align="center" label="用户类型"> <template slot-scope="scope">
            <span v-if="scope.row.userType==1">普通用户</span>
            <span v-if="scope.row.userType==2">媒体用户</span>
            <span v-if="scope.row.userType==3">官方用户</span>
            </template> </el-table-column>
        <el-table-column width="150" align="center" label="状态"> <template slot-scope="scope">
            <span>{{scope.row.accountStatus}}</span>
            </template> </el-table-column>
        <el-table-column width="300" align="center" label="登录名"> <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template> </el-table-column>
        <el-table-column  align="center" label="手机号"> <template slot-scope="scope">
            <span>{{scope.row.mobilePhone}}</span>
            </template> </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button  size="small" type="primary" @click="handleUpdate(scope.row)">编辑账号
            </el-button>
          </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px"  style="width:600px;">
        <el-form-item label="手机号" prop="mobilePhone">
          <el-row v-if="dialogStatus=='create'">
            <el-col :span="20">
            <el-input v-if="dialogStatus=='create'" v-model="form.mobilePhone" placeholder="请输入手机号"></el-input>
            </el-col>
           <el-col :span="4">
            <el-button style="margin-left:10px;" v-if="dialogStatus=='create'" type="primary" @click="fetchUser(form.mobilePhone)">获 取</el-button>
           </el-col>
          </el-row>
            <el-input v-else v-model="form.mobilePhone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发布号名称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入发布号名称"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
            <el-radio-group v-model="form.userType">
              <el-radio :label="1">普通用户</el-radio>
              <el-radio :label="2">媒体用户</el-radio>
              <el-radio :label="3">官方用户</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="使用范围" prop="userPublishType">
            <el-radio-group v-model="form.userPublishType">
              <el-radio :label="1">资讯</el-radio>
              <el-radio :label="2">论坛</el-radio>
              <el-radio :label="3">全部</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="photoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/cmyManage/sys/uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.photoUrl" :src="form.photoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="update('form')">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>


import request from '@/utils/request';
export default {
  name: "user",
  data() {
    return {
      form: {
        mobilePhone: '',
        photoUrl: '',
        nickName:'',
        userType: '1',
        userPublishType:'1'
      },
      rules: {
        userType: [
          {
            required: true,
            message: "请选择用户类型",
            trigger: "blur"
          }
        ],
        userPublishType: [
          {
            required: true,
            message: "请选择使用范围",
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请输入官方号名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        mobilePhone:[
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

      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        limit: 10,
        account: '',
        name: ''
      },
      sexOptions: ["男", "女"],
      dialogFormVisible: false,
      dialogStatus: "",
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: true,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {

    handleAvatarSuccess(res, file) {
      
        this.form.photoUrl = res.data;
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const ispnG = file.type === 'image/png';
        const isLt250k = file.size / 1024  < 251;
        if (!(isJPG || ispnG)) {
          this.$message.error('上传头像图片只能是 JPG  PNG格式!');
        }
        if (!isLt250k) {
          this.$message.error('上传头像图片大小不能超过 250KB!');
        }
        return (isJPG || ispnG) && isLt250k;
    },
    getList() {
      this.listLoading = true;
      request({
          url:'/community/user/saicUser/queryUserList',
          method:'get',
          params:this.listQuery
      }).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {

      request({
          url:'/community/user/saicUser/fetchOfficialUserByMobilePhone',
          method:'get',
          params:{'mobilePhone':row.mobilePhone}
      }).then(response => {
        // 这里是处理正确的回调
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    cancel(formName) {
      this.resetTemp();
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          this.form.createDate = undefined;
           this.form.updateDate = undefined;
          request({
          url:'/community/user/saicUser/updateOfficialUser',
          method:'get',
          params:this.form
          }).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    fetchUser(mobilePhone){
      if(!/^1[34578]\d{9}$/.test(mobilePhone)){
        this.$message({
          message: '输入正确的手机号',
          type: 'warning'
        });
        return false;
      }
        request({
          url:'/community/user/saicUser/fetchOfficialUserByMobilePhone',
          method:'get',
          params:{'mobilePhone' :mobilePhone}
          }).then(response => {

        this.form = response.data;
        this.listLoading = false;
      });
    },
    resetTemp() {
      this.form = {
        mobilePhone: '',
        photoUrl: '',
        nickName:''
      };
      this.listQuery = {
        name: '',
        account: '',
      };
      this.getList();
    }
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
