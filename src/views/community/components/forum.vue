<template>
<div>
    <div>
        <el-form  label-width="100px">
            <el-row :gutter="20">
              <el-col :span="6">
                    <el-form-item label="论坛名称">
                      <el-select v-model="form.blockId" placeholder="请选择" @change="changeblockId(form.blockId)">
                        <el-option
                          v-for="item in queryListBlock"
                          :key="item.id"
                          :label="item.blockName"
                          :value="item.id"
                          >
                        </el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5" >
                    <el-form-item label="车友数" >
                      <span>{{ riders }}</span>
                    </el-form-item>
                </el-col>
                 <el-col :span="5" >
                    <el-form-item label="帖子数" >
                         <span>{{ articleNumber }}</span>
                    </el-form-item>
                </el-col>
                 <el-col :span="6" >
                    <el-form-item label="版主" >
                       <span>{{ blockUser }}</span>
                    </el-form-item>
                </el-col>
              
                <el-col :span="6">
                    <el-form-item label="帖子名称">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                     </el-col>
                     <el-col :span="6">
                      <el-form-item label="状态">
                        <el-select v-model="form.publishStatus" placeholder="请选择">
                          <el-option
                            v-for="item in publishStatus"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                          </el-option>
                        </el-select>
                      </el-form-item>
                  </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="form.releaseTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['23:59:59', '23:59:59']"
                >
              </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                    <el-form-item label="是否精华">
                      <el-select v-model="form.superStatus" placeholder="请选择">
                         <el-option label="全部" value=""></el-option>
                         <el-option label="是" :value="0"></el-option>
                         <el-option label="否" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否置顶">
                      <el-select v-model="form.topStatus" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="是" :value="0"></el-option>
                        <el-option label="否" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" >
                    <el-form-item label="发布人" >
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
              
        </el-form>
    </div>
    <el-row :gutter="20">
        <el-col :span="24" style="text-align:right;margin-bottom:10px;" >
          <el-button class="filter-item"  v-waves icon="search" @click="handleFilter" type="primary">查询</el-button>
          <el-button class="filter-item"  v-waves icon="search" @click="resetTemp" type="primary">重置</el-button>
          <el-button class="filter-item"    style="margin-left: 10px;" @click="handleCreate" type="primary" icon="add">新增帖子</el-button>
          <el-button class="filter-item"   style="margin-left: 10px;"  @click="blockUpdata('update')" type="primary" icon="edit">修改板块</el-button>
          <el-button class="filter-item"  style="margin-left: 10px;" @click="blockCreate('create')" type="primary" icon="edit">新增板块</el-button>
          <el-button class="filter-item"    style="margin-left: 10px;" @click="synArticle" type="primary" icon="edit">同步</el-button>
      </el-col>     
  </el-row>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="序号" width="65"  type="index"> </el-table-column>
        <el-table-column width="200" align="center" label="帖子名称"> <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
        </template> </el-table-column>
        <el-table-column width="100" align="center" label="发布人"> <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template> </el-table-column>
        <el-table-column width="180" align="center" label="发布时间"> <template slot-scope="scope">
            <span>{{scope.row.publishDate}}</span>
            </template> </el-table-column>
              <el-table-column width="180" align="center" label="最后回复时间"> <template slot-scope="scope">
            <span>{{scope.row.lastReplyDate}}</span>
            </template> </el-table-column>
            <el-table-column width="60" align="center" label="浏览量"> <template slot-scope="scope">
                <span>{{scope.row.browseNumber}}</span>
            </template> </el-table-column>
             <el-table-column width="60" align="center" label="回复量"> <template slot-scope="scope">
                <span>{{scope.row.commentNumber}}</span>
            </template> </el-table-column>
               <el-table-column width="60" align="center" label="点赞数"> <template slot-scope="scope">
                <span>{{scope.row.praiseNumber}}</span>
            </template> </el-table-column>
              <el-table-column width="100" align="center" label="是否置顶"> <template slot-scope="scope">
                <span>{{scope.row.topStatus? '否' : '是'}}</span>
            </template> </el-table-column>
             <el-table-column width="100" align="center" label="是否精华"> <template slot-scope="scope">
                <span>{{scope.row.superStatus? '否' : '是'}}</span>
            </template> </el-table-column>
             <el-table-column width="100" align="center" label="状态"> <template slot-scope="scope">
                <span v-if="scope.row.publishStatus==1">已发布 </span>
                <span v-if="scope.row.publishStatus==0">未发布 </span>
                <span v-if="scope.row.publishStatus==2">已删除</span>
            </template> </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="270">
          <template slot-scope="scope">
              <el-button  size="small" type="primary" @click="look(scope.row)">查看</el-button>
              <span v-if="scope.row.publishStatus!=2">
                      <el-button  size="small" type="success" v-if="scope.row.superStatus" @click="handleUpdate(scope.row)">加精</el-button>
                      <el-button  size="small" type="danger" v-if="scope.row.topStatus" @click="handleTop(scope.row)">置顶</el-button>
                      <el-button  size="small" type="success" v-if="!scope.row.superStatus"  @click="handleUpdate(scope.row)">取消加精</el-button>
                      <el-button  size="small" type="danger" v-if="!scope.row.topStatus" @click="handleTop(scope.row)">取消置顶</el-button>
                
              </span>
             
          </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">

        <el-form :model="addform" :rules="rules" ref="form" label-width="100px"  style="width:400px;">
             <el-form-item label="板块名称">
                <el-input v-model="addform.blockName"></el-input>
            </el-form-item>
            <el-form-item label="板块头像" >
              <!-- /api/cmyManage/sys/uploadFile -->
              <el-upload
                    class="avatar-uploader"
                    action="/api/cmyManage/sys/uploadFile"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    >
                    <img v-if="addform.blockIcon" :src="addform.blockIcon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

        </el-form>


        <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="saveBlock('form')">确 定</el-button>
        </div>
    </el-dialog>
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
        page: 1,
        limit: 10,
        blockId:'',
        releaseTime:[],
        publishStatus:'',
        superStatus:'',
        topStatus:'',
        userId:'',
        name:''
      },
      queryListBlock:[],
      userList:[],
      rules: {
      
      },
      list: null,
      total: null,
      listLoading: true,
      publishStatus: [{code:null,name:'全部'},{code:0,name:'未发布'},{code:1,name:'已发布'},{code:2,name:'已删除'}],
      dialogFormVisible: false,
      dialogStatus: "",
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: true,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      blockUser:'',
      articleNumber:'',
      riders:'',
      addform:{
         blockName:'',
         blockIcon:'',
         blockImage:'111'
      },
      blockInfoinfo:{}
    };
  },
  mounted() {
      
      request({
          url:'/community/article/queryListBlock',
          method:'post',
          data:{limit:10,page:1}
      }).then(res => {
        this.form.blockId=res.data.rows[0].id;
        this.queryListBlock= res.data.rows;
         this.getqueryDetailBlock(res.data.rows[0].id);
         this.getList();
      });
  },
  methods: {
    changeblockId(t){
     this.getqueryDetailBlock(t);
    },
    getqueryDetailBlock (id){
      request({
        url:'/community/article/queryDetailBlock',
        params:{id:id}
      }).then((res)=>{
        if(res.resultCode==200){
          this.articleNumber=res.data.articleNumber;
          this.riders=res.data.riders;
          this.blockUser=res.data.name
        }
      })

    },
    handleAvatarSuccess(res, file) {
      
        this.addform.blockIcon = res.data;
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const ispnG = file.type === 'image/png';

        if (!(isJPG || ispnG)) {
          this.$message.error('上传头像图片只能是 JPG  PNG格式!');
        }
  
        return (isJPG || ispnG);
    },
    getList() {
      this.listLoading = true;
      var data=this.form;
      if(this.form.releaseTime && this.form.releaseTime.length>0){
       this.form.startDate=formatdate(this.form.releaseTime[0]);
       this.form.endDate=formatdate(this.form.releaseTime[1]);
      }else{
           this.form.startDate = '';
           this.form.endDate = ''; 
        }
      request({
          url:'/community/article/queryListArticle',
          method:'post',
          data:postData(this.form)
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
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    look(row){
      this.$parent.blockId=row.blockId;
      this.$parent.tieziId=row.id
      
      this.$parent.show='tieziInfo'
    },
    saveBlock(){
      if(this.dialogStatus=='create'){
        request({
            url:'/community/article/insertBlock',
            method:'post',
            data:postData(this.addform)
        }).then(response => {
          this.dialogFormVisible = false;
          this.$message({
            message: "新增成功",
            type: "success",
            duration: 2000
          });
        });
      }else{
        request({
            url:'/community/article/updateBlock',
            method:'post',
            data:postData(this.addform)
        }).then(response => {
         this.dialogFormVisible = false;
         this.$message({
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        });
      }
      
    },
    handleCreate() {
      this.$parent.blockId=this.form.blockId;
      this.$parent.show='articleadd'
    },
    blockCreate(t) {
      this.addform = {
        blockName: '',
        blockIcon: '',
        blockImage:'111'
      };
      this.dialogStatus = t;
      this.dialogFormVisible = true;
    },
    blockUpdata(t) {
      request({
          url:'/community/article/queryDetailBlock',
          method:'get',
          params:{id:this.form.blockId}
      }).then(res => {
        this.addform=res.data;
        this.dialogStatus = t;
        this.dialogFormVisible = true;
      });
      
    },
    handleTop(row){
      request({
          url:'/community/article/updateTopStatus',
          method:'post',
          data:{id:row.id,topStatus:row.topStatus,userId:row.userId,blockId:row.blockId}
      }).then(response => {
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 2000
        });
          this.getList();
      });
    },
    synArticle() {
      request({
          url:'/community/article/searchDataSynch',
          method:'get'
      }).then(response => {
        // 这里是处理正确的回调
      });
    },
    handleUpdate(row) {
      request({
          url:'/community/article/toEssenceArticle',
          method:'post',
          data:{id:row.id,superStatus:row.superStatus,userId:row.userId,blockId:row.blockId}
      }).then(response => {
         this.$message({
          message: "操作成功",
          type: "success",
          duration: 2000
        });
          this.getList();

      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
    },
    resetTemp() {
      this.form = {
        page: 1,
        limit: 10,
        blockId:this.queryListBlock[0].id,
        releaseTime:[],
        publishStatus:'',
        superStatus:'',
        topStatus:'',
        userId:''
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
