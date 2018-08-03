<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
   <el-form ref="form" :model="query" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="6">
          <el-form-item label="举报类型">
            <el-select v-model="query.businesstype" clearable placeholder="请选择" @change="checkBusinessType(query.businesstype)">
              <el-option
                v-for="item in typeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="举报理由">
            <el-select v-model="query.contenttype" clearable placeholder="请选择">
              <el-option
                v-for="item in resonOptions"
                :key="item.type"
                :label="item.typename"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态">
            <el-select v-model="query.status" clearable  placeholder="请选择">
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
    <el-row :gutter="20">
      <el-col :span="6">
          <el-form-item label="举报人">
                <el-input v-model="query.username"></el-input>
          </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="发表用户">
            <el-input v-model="query.createby"></el-input>
          </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="举报对象">
            <el-input v-model="query.content" placeholder="请选择">
            </el-input>
          </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row style="text-align:right;">
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">查询</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
  </el-row>
  </div>

  <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="65"  type="index"> </el-table-column>
    <el-table-column width="180" align="center" label="举报类型"> <template slot-scope="scope">
        <span v-if="scope.row.businesstype==1004">资讯举报</span>
        <span v-if="scope.row.businesstype==1005">资讯评论举报</span>
        <span v-if="scope.row.businesstype==1007">主贴举报</span>
        <span v-if="scope.row.businesstype==1008">主贴跟帖举报</span>
        <span v-if="scope.row.businesstype==1009">跟帖评论举报</span>
      </template> </el-table-column>
    <el-table-column width="150" align="center" label="举报人"> <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="举报理由"> <template slot-scope="scope">
            <span>{{scope.row.contenttype}}</span>
          </template> </el-table-column>
    <el-table-column width="220" align="center" label="举报对象"> <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template> </el-table-column>
    <el-table-column width="100" align="center" label="发表用户"> <template slot-scope="scope">
          <span style="cursor:pointer;color:#E6A23C;" @click="preview(scope.row.activityId,0)" >
              {{scope.row.createby}}
          </span>
        </template> </el-table-column>
    <el-table-column width="100" align="center" label="状态"> <template slot-scope="scope">
        <span v-if="scope.row.status==0" style="color:red;">待处理</span>
        <span v-if="scope.row.status==1" style="color:green;">已处理</span>
    </template> </el-table-column>
    
    <el-table-column align="center" fixed="right" label="操作" width="200"> <template slot-scope="scope">
        <el-button size="small" type="danger" v-if="scope.row.status==0" @click="handleClose(scope.row)">关闭 </el-button>
        
        <el-button  size="small" v-if="scope.row.status==0" type="danger" @click="handleDelete(scope.row)">删除内容</el-button>
      </template> 
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="query.page" :page-sizes="[10,20,30, 50]" :page-size="query.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</div>
</template>

<script>
import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
export default {
    name: "user",
  data() {
    return {
      query:{
          businesstype:'',
          username:'',
          contenttype:'',
          status:'',
          content:'',
          createby:'',
          page: 1,
          limit: 10,
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
      userInfo:{
        name:'',
        photoUrl:'',
        mobilePhone:''
      },
      // formLabelWidth: '120px',
      typeOptions: [{code:null,name:'全部'},{code:'1004',name:'资讯举报'},{code:'1005',name:'资讯评论举报'},{code:'1007',name:'主贴举报'},
      {code:'1008',name:'主贴跟帖举报'},{code:'1009',name:'跟贴评论举报'}],
      resonOptions:'',
      statusOptions:[{code:null,name:'全部'},{code:'0',name:'待处理'},{code:'1',name:'已处理'}],
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
    getList() {
      this.listLoading = false;
      request({
            url:'/cmyManage/review/toFindReviewAndReport',
            method:'post',
            data:postData(this.query)
        }).then(res =>{
            this.list=res.data.rows;
            this.total = res.data.total;

        })
    },

    handleSizeChange(val) {
      this.query.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
   
    handleDelete(row){
        this.$confirm("删除本条记录状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request({
          url:'cmyManage/review/toUpdateReviewNewsAccusationCommunity',
          method:'get',
          params:{'id':row.id,'businesstype':row.businesstype}
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
          this.getList();
         
        });
      });
    },
    resetTemp() {
      this.query = {
         businesstype:'',
          username:'',
          contenttype:'',
          status:'',
          content:'',
          createby:'',
          page: 1,
          limit: 10,
      };
      this.getList();
    },
    handleClose(row){
        this.$confirm("关闭举报状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        request({
          url:'/cmyManage/review/updateStatus',
          method:'get',
          params:{'id':row.id}
      }).then(() => {
        this.$message({
          message: '关闭举报状态成功',
          type: 'success'
        });
          this.getList();
         
        });
      });
    },
    checkBusinessType(businesstype){
       if(businesstype && businesstype!=null && businesstype!=''){
          request({
              url:'/cmyManage/review/toFindReviewReason',
              method:'get',
              params:{'status':businesstype}
          }).then((res)=>{
            this.resonOptions=res.data;
          });
       }else{
         this.resonOptions=[];
       }
        
   },
  }
};

</script>
