<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
   <el-form ref="form" :model="listQuery" label-width="80px">
<el-row :gutter="20">
  <el-col :span="8">
      <el-form-item label="背景名称">
        <el-input v-model="listQuery.bkName"></el-input>
      </el-form-item>
  </el-col>
  <el-col :span="5">
    <el-form-item label="创建时间">
    <el-date-picker
      v-model="listQuery.startDate"
      type="date"
      value-format='yyyy-MM-dd HH:mm:ss'
      placeholder="选择日期">
    </el-date-picker>
     </el-form-item>
  </el-col>
  <el-col :span="5">
    <el-form-item label="">
    <el-date-picker
      v-model="listQuery.endDate"
      type="date"
      value-format='yyyy-MM-dd HH:mm:ss'
      placeholder="选择日期">
    </el-date-picker>
     </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="分类">
        <el-select v-model="listQuery.bkType" clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="状态">
        <el-select v-model="listQuery.bkStatus" clearable  placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
</el-row>
</el-form>
<el-row style="text-align:right;">
     <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
     <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
    <el-button class="filter-item"   style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
</el-row>
    
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width:100%">
    <el-table-column align="center" label="序号" width="80" type="index">
   </el-table-column>
    <el-table-column width="130" align="center" label="背景名称" sortable="true" :default-sort = "{prop: 'bkName', order: 'ascending'}"> <template slot-scope="scope">
        <span>{{scope.row.bkName}}</span>
      </template> </el-table-column>
    <el-table-column width="150" align="center" label="上传人"> <template slot-scope="scope">
            <!-- <span>{{scope.row.createByName}}</span> -->
            <el-button type="text" @click="handleUserInfo(scope.row)">{{scope.row.createByName}}</el-button>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="创建时间" sortable="true" :default-sort = "{prop: 'bkName', order: 'ascending'}"> <template slot-scope="scope">
            <span >{{scope.row.createDate}}</span>
          </template> </el-table-column>
    <el-table-column width="200" align="center" label="背景图案"> <template slot-scope="scope">
           <!-- <img src="{{scope.row.pendantUrl}}" /> -->
            <img v-if="scope.row.bkUrl" :src="scope.row.bkUrl" style="width:100px;">
          </template> </el-table-column>
    <el-table-column width="130" align="center" label="分类"> <template slot-scope="scope">
        <span v-if="scope.row.bkType==1">最新上架</span>
        <span v-if="scope.row.bkType==2">热门推荐</span>
      </template> </el-table-column>
    <el-table-column width="100" align="center" label="状态"> <template slot-scope="scope">
        <span v-if="scope.row.bkStatus==1" style="color:red;">下架</span>
        <span v-if="scope.row.bkStatus==0" style="color:green;">上架</span>
      </template> </el-table-column>
    <el-table-column align="center" label="操作" width="230"> <template slot-scope="scope"  >
        <div v-if="scope.row.status==0">
        <el-button v-if="scope.row.bkStatus==0" size="small" type="danger" @click="handleForce(scope.row)">下架
        </el-button>
        <el-button v-if="scope.row.bkStatus==1" size="small" type="success" @click="handleForce(scope.row)">上架
        </el-button>
        <el-button size="small" type="primary"  @click="handleUpdate(scope.row)">编辑背景
        </el-button>
        </div>
        
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="背景墙名称" prop="bkName">
        <el-input v-model="form.bkName" placeholder="请输入背景墙名称"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="bkType">
            <el-radio-group v-model="form.bkType">
              <el-radio :label="1">最新上架</el-radio>
              <el-radio :label="2">热门推荐</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="bkStatus">
            <el-radio-group v-model="form.bkStatus">
              <el-radio :label="0">上架</el-radio>
              <el-radio :label="1">下架</el-radio>
            </el-radio-group>
        </el-form-item>
      <el-form-item label="背景墙图案" prop="bkUrl">
          <!-- action="/api/cmyManage/sys/uploadFile" -->
          <!-- action="https://api.yinzhongchang.cn/api/upload/ue" -->
          <el-upload
            class="avatar-uploader"
            action="/api/cmyManage/sys/uploadFile" 
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.bkUrl" :src="form.bkUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="dialogStatus=='update'" @click="handleDelete('form')" style="text-align:left;" type="danger" >删除</el-button>
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-if="dialogStatus=='update'" type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="用户信息" :visible.sync="userInfoShow">
  <el-form :model="userInfo" label-width="100px">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="userInfo.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="photoUrl">
        <!-- <el-input v-model="userInfo.photoUrl" auto-complete="off"></el-input> -->
        <img v-if="userInfo.photoUrl" :src="userInfo.photoUrl" style="width:100px;">
      </el-form-item>
    <el-form-item label="手机号码" prop="mobilePhone">
        <el-input v-model="userInfo.mobilePhone" ></el-input>
      </el-form-item>
  </el-form>
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
        bkName:'',
        createByName:'',
        createDate:'',
        bkUrl:'',
        bkStatus:''
      },
      rules: {
        bkName: [
          {
            required: true,
            message: "请输入背景墙名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
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
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        bkName:'',
        startDate:'',
        endDate:'',
        bkType:'',
        bkStatus:'',
        name: undefined
      },
      userInfo:{
        name:'',
        photoUrl:'',
        mobilePhone:''
      },
      // formLabelWidth: '120px',
      sexOptions: ["男", "女"],
      typeOptions: [{code:null,name:'全部'},{code:'1',name:'最近上架'},{code:'2',name:'热门推荐'}],
      statusOptions:[{code:null,name:'全部'},{code:'0',name:'上架'},{code:'1',name:'下架'}],
      dialogFormVisible: false,
      
      dialogStatus: "",userInfoShow:false,
      textMap: {
        update: "编辑背景",
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
      
        this.form.bkUrl = res.url;
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const ispnG = file.type === 'image/png';
        const isLt250k = file.size / 1024  < 250;
        if (!(isJPG || ispnG)) {
          this.$message.error('上传头像图片只能是 JPG  PNG格式!');
        }
        if (!isLt250k) {
          this.$message.error('上传头像图片大小不能超过 250KB!');
        }
        return (isJPG || ispnG) && isLt250k;
    },
    getList() {
      this.listLoading = false;
      this.handleFilter();
      
    },
    handleFilter() {
    request({
        url:'/community/background/queryListBackGround',
        method:'post',
        data:this.listQuery
    }).then(res =>{
        this.list=res.data.rows;
    })
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
          url:'/community/background/queryBackGroundDetail',
          method:'get',
          params:{'id':row.id}
      }).then(response => {
        // 这里是处理正确的回调
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handleForce(row) {
      var text='';
      if(row.bkStatus==0){
          text='下架';
      }else{
         text='上架';
      }
      this.$confirm(`${text}官网背景, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request({
          url:'/community/background/forceBackGround',
          method:'post',
          data:row
      }).then(() => {
        this.$message({
          message: text + '成功',
          type: 'success'
        });
          this.getList();
         
        });
      });
    },
    handleDelete(formName){
      this.$confirm("删除官网背景, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request({
          url:'/community/background/deleteBackGround',
          method:'post',
          params:{'id':this.form.id}
          // data:{'id':this.form.id}
      }).then(() => {
        this.$message({
          message:'删除成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.getList();
        });
      });
    },
    handleUserInfo(row){
      request({
          url:'/community/user/getUserInfo',
          method:'get',
          params:{'userId':row.createBy}
      }).then(response => {
        // 这里是处理正确的回调
        this.userInfo = response.data;
        this.userInfoShow = true;
        
      });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
         request({
          url:'/community/background/insertBackGround',
          method:'post',
          data:this.form
          }).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          request({
          url:'/community/background/updateBackGround',
          method:'post',
          data:this.form
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
    resetTemp() {
      this.form = {
        bkName: '',
        bkType: '',
        bkStatus: '',
        bkUrl: '',
      };
      this.listQuery = {
        bkName: '',
        bkType: '',
        bkStatus: '',
        startDate:'',
        endDate:''
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