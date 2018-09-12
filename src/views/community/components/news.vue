 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
   <el-form ref="form" :model="form" label-width="80px">
<el-row :gutter="20">
  <el-col :span="8">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
  </el-col>
  <el-col :span="10">
    <el-form-item label="发布时间">
    <el-date-picker
      v-model="form.releaseTime"
      type="datetimerange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['23:59:59', '23:59:59']"
      :picker-options="pickerOptions2">
    </el-date-picker>
     </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="创建人">
        <el-input v-model="form.releaseName"></el-input>
      </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="发布号">
        <el-select v-model="form.userId" filterable placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item.saicUserId"
            :label="item.nickName"
            :value="item.saicUserId">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="状态">
        <el-select v-model="form.status" clearable  placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="是否显示">
        <el-select v-model="form.isShow" clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
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
     <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleQuery">查询</el-button>
     <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleReset">重置</el-button>
    <el-button class="filter-item"    style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
     <el-button class="filter-item"    style="margin-left: 10px;" @click="synNews" type="primary" icon="edit">同步</el-button>
</el-row>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width:100%">
    <el-table-column align="center" label="序号" width="80" type="index">
        </el-table-column>
    <el-table-column width="150" align="center" label="创建人"> <template slot-scope="scope">
            <el-button type="text" @click="handleUserInfo(scope.row)">{{scope.row.createBy}}</el-button>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="发布时间"> <template slot-scope="scope">
        <span>{{scope.row.releaseDate}}</span>
      </template> </el-table-column>
    <el-table-column width="180" align="center" label="标题"> <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">{{scope.row.title}}</el-button>
          </template> </el-table-column>
    <el-table-column width="200" align="center" label="发布号"> <template slot-scope="scope">
           <span>{{scope.row.name}}</span>
          </template> </el-table-column>
    <el-table-column width="200" align="center" label="资讯情况"> 
      <template slot-scope="scope">
        <span class="newsInfo"> <img :src="eye" alt="浏览量" /> {{scope.row.browseNumber}}</span>，
        <span class="newsInfo"> <img :src="comment" alt="评论数" /> {{scope.row.commentNumber}}</span>，
        <span class="newsInfo"> <img :src="Fabulous" alt="点赞数" /> {{scope.row.praiseNumber}}</span>
      </template> 
    </el-table-column>
    <el-table-column width="130" align="center" label="预览"> 
      <template slot-scope="scope">

        <span style="cursor:pointer;" @click="preview(scope.row.message)" >查看</span>
      </template> 
    </el-table-column>
    <el-table-column width="130" align="center" label="链接"> 
      <template slot-scope="scope">
        <span  style="cursor:pointer;"
          v-clipboard:copy="scope.row.message"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          
          >
          点击复制</span>
      </template> 
    </el-table-column>
    <el-table-column width="130" align="center" label="是否显示"> 
      <template slot-scope="scope">
        <span>{{scope.row.isShow? '是' : '否'}}</span>
      </template> 
    </el-table-column>
    <el-table-column align="center" label="操作" width="230"> <template slot-scope="scope">
      <el-button  size="small" type="success" @click="handleDetail(scope.row)">详情
        </el-button>
        <el-button  size="small" v-if="scope.row.status!=1002" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button  v-if="scope.row.status!=1002" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange"  background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog title="预览" :visible.sync="previewShow" width="414px">
     <iframe :src="this.iframeUrl" frameborder="0" style="height:500px;width:100%;"></iframe>
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
import { postData,formatdate } from '@/utils';
import { findOfficialUser } from '@/api/community/user';
import eye from '@/assets/image/eye.png'
import comment from '@/assets/image/comment@3x.png'
import Fabulous from '@/assets/image/Fabulous@3x.png'
export default {
  name: "user",
  data() {
    return {
      userList:[],
      hostIp:'',
      eye:eye,
      comment:comment,
      Fabulous:Fabulous,
      previewShow:false,
      iframeUrl:'',
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      form: {
        title:'',
        releaseName:'',
        releaseNumber:'',
        startDate:'',
        endDate:'',
        status:'',
        isShow:'',
        limit:10,
        page:1,
        releaseTime:'',
      },
        userInfo:{
        name:'',
        photoUrl:'',
        mobilePhone:''
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
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
      userInfoShow:false,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined
      },
      typeOptions: [{code:null,name:'全部'},{code:1,name:'是'},{code:0,name:'否'}],
      statusOptions:[{code:null,name:'全部'},{code:1001,name:'草稿'},{code:1002,name:'已删除'},{code:1004,name:'有效'}],
      dialogFormVisible: false,
      dialogStatus: "",
      updateStatus:"",
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

  mounted(){
    this.getList();

    var url=window.location.href;
    var host=window.location.host.toString();
    var str=url.split(host)[0]+host;
    this.hostIp=str;
    findOfficialUser({
      userPublishType:1
    }).then((res)=>{
       this.userList=res.data;
       this.userList.unshift({saicUserId:'',nickName:'全部'})
    })
  },
  methods: {
    getList() {
      this.listLoading = false;
      this.handleQuery()
    },
    onCopy: function (e) {

      this.$message({
          message: '复制成功,地址：'+e.text,
          type: 'succcess'
        });
    },
    onError: function (e) {
      this.$message({
          message: '复制失败',
          type: 'error'
        });
    },
    preview(url){

       this.iframeUrl=url;
       this.previewShow=true;
    },
    handleQuery() {

      if(this.form.releaseTime && this.form.releaseTime.length>0){
       this.form.startDate=formatdate(this.form.releaseTime[0]);
       this.form.endDate=formatdate(this.form.releaseTime[1]);
      }else{
        this.form.startDate='';
        this.form.endDate='';
      }
      request({
          url:'/community/news/queryListNews',
          method:'post',
          data:postData(this.form)
      }).then(res =>{
        var list=res.data.rows;
           for(var i=0;i<list.length;i++){
             var type='';
              if(list[i].contentType==1){
                 type='Default'
              }else if(list[i].contentType==3){
                 type='NewsImg'
              }else if(list[i].contentType==4){
                 type='NewsVedio'
              }
              if(list[i].title.length>=12){
                list[i].title = list[i].title.substr(0,12) +'...'
              }
               list[i]['message']=this.hostIp + '/saicui/preview?id=' + list[i].id + '&type='+ type
           }
          this.list=list;
           this.total = res.data.total;
      })
    },
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleCreate() {
      this.$parent.show='newsadd'
    },
    handleUpdate(row) {
      
      this.$parent.newsid=row._id;
      this.$parent.show='newsedit'
    },
    handleDetail(row){
      this.$parent.newsid=row.id;
      this.$parent.show='newsdetail'
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        
          request({
            url:'/community/news/web/deleteNews',
            method:'post',
            data:{'status':1002,'id':row.id,'userId':row.userId}
          }).then(() => {
          this.$message({
            message:'删除成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.getList();
        });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
     
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
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
          putObj(this.form.id, this.form).then(() => {
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
        title:'',
        releaseName:'',
        releaseNumber:'',
        startDate:'',
        endDate:'',
        status:'',
        isShow:'',
        limit:10,
        page:1,
        releaseTime:'',
      };
      this.getList();
    },
    handleUserInfo(row){
      request({
          url:'/community/user/getUserInfo',
          method:'get',
          params:{'userId':row.userId}
      }).then(response => {
        // 这里是处理正确的回调
        this.userInfo = response.data;
        this.userInfoShow = true;
        
      });
    },
    handleReset(){
      this.form = {
        title:'',
        releaseName:'',
        releaseNumber:'',
        startDate:'',
        endDate:'',
        status:'',
        isShow:'',
        limit:10,
        page:1,
        releaseTime:'',
      };
      this.getList();
    },
    synNews() {
      request({
          url:'/community/news/searchDataSynch',
          method:'get'
      }).then(response => {
        // 这里是处理正确的回调
      });
    },
  }
};
</script>
<style>
.newsInfo{
  height: 20px;
}
 .newsInfo img{
   width: 18px;
   display: inline-block;
   vertical-align: middle;
 }

 
</style>
