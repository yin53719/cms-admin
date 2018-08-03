<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
   <el-form ref="form" :model="form" label-width="80px">
<el-row :gutter="20">
  <el-col :span="6">
      <el-form-item label="活动名称">
        <el-input v-model="form.activityTitle"></el-input>
      </el-form-item>
  </el-col>
  <el-col :span="6">
      <el-form-item label="发布人">
        <el-input v-model="form.publisher"></el-input>
      </el-form-item>
  </el-col>
  <el-col :span="12">
    <el-form-item label="发布时间">
    <el-date-picker
      v-model="form.publishTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期" :default-time="['23:59:59', '23:59:59']">
    </el-date-picker>
     </el-form-item>
  </el-col>
</el-row>
<el-row :gutter="20">
  <el-col :span="6">
      <el-form-item label="发布状态">
        <el-select v-model="form.publishStatus" placeholder="请选择">
          <el-option
            v-for="item in pubStatus"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
  <el-col :span="6">
      <el-form-item label="活动状态">
        <el-select v-model="form.activityStatus" placeholder="请选择">
          <el-option
            v-for="item in actiStatus"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
  </el-col>
  <el-col :span="6">
      <el-form-item label="活动类型">
        <el-select v-model="form.activityType" placeholder="请选择">
          <el-option
            v-for="item in activityTypes"
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
    <el-button class="filter-item"    style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新建</el-button>
    <el-button class="filter-item"    style="margin-left: 10px;" @click="synActivity" type="primary" icon="edit">同步</el-button>
</el-row>
    

  </div>
  <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="65"  type="index"> </el-table-column>
    <el-table-column width="180" align="center" label="活动名称"> <template slot-scope="scope">
        <span>{{scope.row.activityTitle}}</span>
      </template> </el-table-column>
    <el-table-column width="150" align="center" label="发布人"> <template slot-scope="scope">
            <span>{{scope.row.publisher}}</span>
          </template> </el-table-column>
    <el-table-column width="180" align="center" label="发布时间"> <template slot-scope="scope">
            <span>{{scope.row.publishTime}}</span>
          </template> </el-table-column>
    <el-table-column width="220" align="center" label="活动时间"> <template slot-scope="scope">
            <span>{{scope.row.activityStartTime}}~{{scope.row.activityEndTime}}</span>
          </template> </el-table-column>
    <el-table-column width="100" align="center" label="预览"> <template slot-scope="scope">
          <span style="cursor:pointer;color:#E6A23C;" @click="preview(scope.row.activityId,0)" >查看</span>
        </template> </el-table-column>
    <el-table-column width="100" align="center" label="链接"> <template slot-scope="scope">
        <span  style="cursor:pointer;color:#E6A23C;"
          v-clipboard:copy="scope.row.message"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">
          点击复制</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="浏览量"> <template slot-scope="scope">
      <span>{{scope.row.pageviews}}</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="报名人数"> <template slot-scope="scope">
      <span>{{scope.row.signNum}}</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="报名情况"> <template slot-scope="scope">
      <span style="cursor:pointer;color:#E6A23C;" @click="preview(scope.row.activityId,1)" >查看</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="排序"> <template slot-scope="scope">
      <span>{{scope.row.updName}}</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="发布状态"> <template slot-scope="scope">
      <span v-if="scope.row.publishStatus == 0">未发布</span>
      <span v-if="scope.row.publishStatus == 1">已发布</span>
      <span v-if="scope.row.publishStatus == 2">已下架</span>
      <span v-if="scope.row.publishStatus == 3">已删除</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="活动状态"> <template slot-scope="scope">
      <span v-if="scope.row.activityStatus == 1">报名结束</span>
      <span v-if="scope.row.activityStatus == 2">活动开启</span>
      <span v-if="scope.row.activityStatus == 3">活动结束</span>
      <span v-if="scope.row.activityStatus == 4">即将开启</span>
      <span v-if="scope.row.activityStatus == 5">火热预约</span>
    </template> </el-table-column>
    <el-table-column width="100" align="center" label="活动类型"> <template slot-scope="scope">
      <span v-if="scope.row.activityType == 1004">线上</span>
      <span v-if="scope.row.activityType == 0">全部</span>
      <span v-if="scope.row.activityType == 1005">线下</span>
    </template> </el-table-column>
    <el-table-column align="center" fixed="right" label="操作" width="100"> <template slot-scope="scope">
        <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
</div>
</template>

<script>
import { postData,formatdate } from '@/utils';
import request from '@/utils/request';
export default {
  name: "user",
  data() {
    return {
      form: {
        activityTitle: '',
        publishTime:'',
        publishTimeBegin: '',
        publishTimeEnd:'',
        publisher: '',
        publishStatus:'', 
        activityStatus:'',
        limit: 10,
        page: 1
      },
      iframeUrl:'',
      hostIp: '',
      activeName2:'',
      previewShow:false,
      list: [{
        'activityTitle':'',
        'publisher':'',
        'publishTime':'',
        'activityStartTime':'',
        'activityEndTime':'',
        'pageviews':0,
        'signNum':0,
        'publishStatus':0,
        'activityType':'',
        'activityStatus':3
      }],
      publishStatus:'',
      activityData: {},
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      sorts:[],
      pubStatus: [{code:3,name:'全部'},{code:'0',name:'未发布'},{code:'1',name:'已发布'},{code:'2',name:'已下架'}],
      actiStatus:[{code:4,name:'全部'},{code:'2',name:'活动开启'},{code:'1',name:'报名结束'},{code:'3',name:'活动结束'}
      ,{code:'5',name:'即将开启'},{code:6,name:'火热预约'}
      ],
      activityTypes:[{code:0,name:'全部'},{code:'1004',name:'线上'},{code:'1005',name:'线下'}],
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
  created() {
    var url=window.location.href;
    var host=window.location.host.toString();
    var str=url.split(host)[0]+host;
    this.hostIp=str;
    this.getList();
  },
  mounted(){

  },
  methods: {
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
    preview(val1,val2){
      this.$parent.activityIdForDetail = val1;
     
      if(val2 == 0){
        this.$parent.activeName2 = 'first';
      }
      if(val2 == 1){
        this.$parent.activeName2 = 'second';
      }
      this.$parent.show='activityother';
    },
    getList() {
      this.listLoading = true;
      if(this.form.publishTime && this.form.publishTime.length>0){
        this.form.publishTimeBegin = this.form.publishTime[0];
        this.form.publishTimeEnd = this.form.publishTime[1];
      }else{
           this.form.publishTimeBegin = '';
           this.form.publishTimeEnd = ''; 
        }
      
      request({
        url: '/community/saicActivity/backList',
        method: 'post',
        data:postData(this.form),
    }).then(response => {
       var list= response.data.rows;
        this.total = response.data.total;
           for(var i=0;i<list.length;i++){
             if(list[i].activityTitle.length>=12){
              list[i].activityTitle = list[i].activityTitle.substr(0,12) +'...'
             }
               list[i]['message']=this.hostIp + '/saicui/preview?id=' + list[i].activityId + '&type=activity'
           }
        this.list = list;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.form.page = val;
      this.getList();
    },
    handleCreate() {
     this.$parent.show='activityadd';
     this.$parent.activityUpdata = null;
     this.$parent.publishStatus = 6;
    },
    handleUpdate(row) {
     console.log(row);
     this.$parent.activityUpdata=row.activityId;;

         this.$parent.show='activityadd';
  
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
    synActivity() {
      request({
          url:'/community/saicActivity/searchDataSynch',
          method:'get'
      }).then(response => {
        // 这里是处理正确的回调
      });
    },
    resetTemp() {
      this.form = {
        activityTitle: '',
        publishTime:'',
        publishTimeBegin: '',
        publishTimeEnd:'',
        publisher: '',
        publishStatus:'', 
        activityStatus:'',
        limit: '10',
        page: '1'
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
