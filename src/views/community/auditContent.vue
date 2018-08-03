<template>
    <div style="padding: 0 20px">
        <el-form  label-width="100px">
           <el-row :gutter="10" style="padding:10px 0">
                <el-col :span="24" style="" >
                  <div style="padding-left:28px;">
                     当前审核内容： <span style="color:#67C23A"> 论坛： 
                       <span v-if="article_lists[0].show">主贴</span>
                       <span v-if="article_lists[1].show">，回帖</span>
                      <span v-if="article_lists[2].show">，楼中楼</span>
                      <span v-if="!article_lists[0].show && !article_lists[1].show && !article_lists[2].show">无</span></span>
                     
                     <span style="color:#409EFF;margin-left:50px;"> 资讯：
                        <span v-if="news_lists[1].show">评论</span>
                        <span v-if="news_lists[2].show">，楼中楼</span>
                     </span>
                     <span v-if="!news_lists[1].show && !news_lists[2].show">无</span>
                      <el-button class="filter-item" type="primary" style="margin-left:100px;" v-waves icon="search" @click="dialogFormVisible = true">设置</el-button>
                  </div>
                   
                </el-col>
           </el-row>
            <el-row :gutter="20">
               <el-col :span="6">
                <el-form-item label="发布人">
                      <el-input v-model="queryList.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发布类型">
                    <el-select v-model="queryList.releaseType" placeholder="请选择">
                      <el-option
                        v-for="item in releaseType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                 <el-col :span="6">
                  <el-form-item label="状态">
                    <el-select v-model="queryList.status" placeholder="请选择">
                      <el-option
                        v-for="item in status"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                 <el-col :span="6">
                  <el-form-item label="来源">
                    <el-select v-model="queryList.businessType" placeholder="请选择">
                      <el-option
                        v-for="item in businessType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                </el-row>
                <el-row>
                <el-col :span="12">
                  <el-form-item label="发布时间">
                  <el-date-picker
                    v-model="queryList.createTimeFFF"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm">
                  </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="审核时间">
                  <el-date-picker
                    v-model="queryList.auditTimeFFF"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm">
                  </el-date-picker>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:20px;">
                <el-col style="text-align:right;" >
                    <el-button class="filter-item" type="info" v-waves icon="search" @click="handleQquery">查询</el-button>
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
      <!-- 数据列表 -->
        <el-table :data="userDate" border style="width: 100%">
          <el-table-column align="center" type="index" fixed  label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="name" label="发布人" width="180px"></el-table-column>
          
          <el-table-column align="center"  label="发帖类型" width="180px">
            <template slot-scope="scope">
                <span v-if="scope.row.businessType==1007 && scope.row.level==0" >主贴</span>
                <span v-else-if="scope.row.businessType==1007 && scope.row.level==1" >回帖</span>
                <span v-else-if="scope.row.businessType==1007 && scope.row.level==2" >帖子楼中楼</span>
                <span v-else-if="scope.row.businessType==1004 && scope.row.level==1" >资讯评论</span>
                <span v-else-if="scope.row.businessType==1004 && scope.row.level==2" >资讯楼中楼</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="level" label="来源" width="180px">
             <template slot-scope="scope">
                <span v-if="scope.row.businessType==1007" >论坛</span>
                <span v-else-if="scope.row.businessType==1004" >资讯</span>
            </template>
          </el-table-column>
          <el-table-column align="center"  label="发布内容" width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.content || '图片' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发布时间" width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核时间" width="180px">
            <template slot-scope="scope">
              <span >{{ scope.row.auditTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.status==0" >待审核</span>
                <span v-if="scope.row.status==1" >优质内容</span>
                <span v-else-if="scope.row.status==2" >一般内容</span>
                <span v-else-if="scope.row.status==3" >劣质内容</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="400">
            <template slot-scope="scope"> 
              <el-button  @click="look(scope.row)" type="info" size="small">查看</el-button>
              <el-button v-if="scope.row.status==0"  size="small" @click="handleForce(scope.row,3)" type="warning">劣质内容</el-button>
              <el-button v-if="scope.row.status==0"  size="small" @click="handleForce(scope.row,2)" type="primary">一般内容</el-button>
              <el-button v-if="scope.row.status==0"  size="small" @click="handleForce(scope.row,1)" type="success">优质内容</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryList.page" :page-sizes="[10,20,30, 50]" :page-size="queryList.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>                          
       <!-- 审核设置 -->
        <el-dialog title="审核设置" :visible.sync="dialogFormVisible"> 
          <div style="padding-left:200px;">
                    <span style="color:#67C23A"> 论坛{{ riders }}</span>
                  </div>
                   <div style="padding-left:130px;">
                    <span> 内容审核：
                <template>
             <el-checkbox v-model="article_lists[0].show">主贴</el-checkbox>
              <el-checkbox v-model="article_lists[1].show">回帖</el-checkbox>
             <el-checkbox v-model="article_lists[2].show">楼中楼</el-checkbox>
              </template>{{ riders }}</span>
                  </div>
                   <div style="padding-left:200px;">
                    <span style="color:#67C23A"> 资讯{{ riders }}</span>
                  </div>
                 <div style="padding-left:205px;">
                   <el-checkbox v-model="news_lists[1].show">评论</el-checkbox>
                   <el-checkbox v-model="news_lists[2].show">楼中楼</el-checkbox>
                 </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="saveUser('formDetail')">保 存</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>

import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
export default {
    data() {
      return {
        //定义查询条件
        queryList: {
          "releaseType":'',
          "businessType":'',
          'name': '',
          "status": '',
          "createTimeFFF": [],
          'auditTimeFFF': [],
          'startDate':'',
          'endDate':'',
          auditStartDate:'',
          auditEndDate:'',
          'limit': 10,
          'page': 1
        },
        listLoading:false,
        riders:'',
        checked:true,
        //发布类型
        releaseType:[
          {'code':'','name':'全部'},
          {'code':10070,'name':'主贴'},
          {'code':10071,'name':'回帖'},
          {'code':10072,'name':'帖子楼中楼'},
          {'code':10041,'name':'资讯评论'},
          {'code':10042,'name':'资讯楼中楼'},
        ],
        //审核状态
         status:[
          {'code':'','name':'全部'},
          {'code':'0','name':'待审核'},
          {'code':1,'name':'优质'},
          {'code':2,'name':'一般'},
          {'code':3,'name':'劣质'},
        ],
        //来源
        businessType:[
          {'code':'','name':'全部'},
          {'code':1007,'name':'论坛'},
          {'code':1004,'name':'资讯'},
        ],
        userDate: [],
        total: 0,
        showStatus: false,
        dialogFormVisible: false,//对话框默认不展示
        formDetail: {
          name: '',
          nickName: '',
          articleNumber: 0,
          articleRoleCode: '',
          superNumber: 0,
          topNumber:0,
          praiseNumber:0,
          commentNumber:0,
          blockId: 0
        },
        blockLists: [],
        article_lists:[{show:false},{show:false},{show:false}],
        news_lists:[{show:false},{show:false},{show:false}],
        data:{}
      }
    },
    mounted() {
      this.getList();
      this.getAuditTypeList();
    },
    methods: {
      getAuditTypeList(){
        this.article_lists=[{show:false},{show:false},{show:false}];
        this.news_lists=[{show:false},{show:false},{show:false}];
        request({
            url:'/community/audit/getAuditTypeList',
            method:'get'
          }).then((res)=>{
            
              let data=res.data;
              this.data=data;
              if(data && data.article){
                  let article=data.article.auditType.split(',')
                  for(var i=0;i<article.length;i++){
                      this.article_lists[article[i]-1].show=true;
                  }
              }

              if(data && data.news){
                  let news=data.news.auditType.split(',')
                  for(var i=0;i<news.length;i++){
                      this.news_lists[news[i]-1].show=true;
                  }
              }
          })
      },
      cancel(){
        this.getAuditTypeList();
         this.dialogFormVisible = false
        
      },
      saveUser(form){
        let list=[];
        if(this.article_lists[0].show){
          list.push(1)
        }
        if(this.article_lists[1].show){
          list.push(2)
        }
         if(this.article_lists[2].show){
          list.push(3)
        }

        let article=list.join(',')

        let list1=[];
    
        if(this.news_lists[1].show){
          list1.push(2)
        }
         if(this.news_lists[2].show){
          list1.push(3)
        }

         let news=list1.join(',')
         if(this.data && this.data.article){
            this.data.article.auditType=article;
         }else{
           if(article &&article !=''){
              this.data.article={
                businessType:1007,
                auditType:article
              }
           }
          
         }
         if(this.data && this.data.news){
            this.data.news.auditType=news;
         }else{
           if(news && news !=''){
              this.data.news={
                businessType:1004,
                auditType:news
              }
           }
         }
         if(!this.data){
            this.$message({
              message: '没有设置',
              type: 'error'
            });
           return false;
         }
           request({
            url:'/community/audit/updateAuditType',
            method:'post',
            data:this.data
          }).then(()=>{
           this.dialogFormVisible = false
          })
      },
    handleForce(row,t) {
     let text = '';
      row.status=t;
      if(t==3){
        text='劣质'
      }else if(t==2){
        text='一般'
      }else if(t==1){
        text='优质'
      }
      this.$confirm(`确认为${text}内容?`, "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
      }).then(() => {
          request({
              url:'/community/audit/updateAuditStatus',
              method:'post',
              data:row
          }).then(() => {
              this.$message({
              message:'审核成功',
              type: 'success'
              });
              this.getList();
          });
      });
    },
    look(row){
      if(row.businessType==1007){
         this.$parent.show='waitAudit'
      }
        if(row.businessType==1004){
         this.$parent.show='auditNews'
      }
      this.$parent.blockId=row.blockId;
      this.$parent.tieziId=row.id
      this.$parent.level=row.level
      this.$parent.businessType=row.businessType
      
      
    },
      selectChange(val){
        // console.log(val);
        if(val != 4 && val != '' && val != null){
          this.showStatus = true;
        }else{
          this.showStatus = false;
        }
      },
      handleClick(val){
        //查询板块列表
        request({
          url: '/community/article/queryListBlock',
          method: 'post',
          data: {
              limit: 10,
              page: 1
          }
        }).then(response => {
          this.blockLists = response.data.rows;
        });
      },
      getList() {
        this.listLoading = true;
        if(this.queryList.createTimeFFF && this.queryList.createTimeFFF.length>0){
          this.queryList.startDate = this.queryList.createTimeFFF[0];
          this.queryList.endDate = this.queryList.createTimeFFF[1];
        }else{
           this.queryList.startDate ='';
           this.queryList.endDate = '';
        }
        if(this.queryList.auditTimeFFF && this.queryList.auditTimeFFF.length>0){
           this.queryList.auditStartDate = this.queryList.auditTimeFFF[0];
           this.queryList.auditEndDate = this.queryList.auditTimeFFF[1];
         }else{
           this.queryList.auditStartDate ='';
           this.queryList.auditEndDate = '';
        }
        request({
          url: 'community/audit/getAuditInfoList',
          method: 'post',
          data: postData(this.queryList),
        }).then(response => {
          // console.log(response.data.rows)
          var list=response.data.rows;
          // for(var i=0;i<list.length;i++){
          //     list[i].newStatus=list[i].status;
          //     if(list[i].level!=0){
          //       if(list[i].status==1){
          //            list[i].newStatus=2
          //       }else if(list[i].status==2){
          //           list[i].newStatus=1
          //       }
          //     }
          // }
          this.userDate = list;
          this.total = response.data.total;
          this.listLoading = false;
 
        });
      },
      handleQquery(){//执行查询
        this.getList();
      },
      handleSizeChange(val) {
        this.queryList.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.queryList.page = val;
        this.getList();
      },
      resetTemp(){//重置按钮
        this.queryList = {
            'articleRoleCode':'',
            'status':'',
            'releaseType':'',
            'businessType':'',
            'registerTime': '',
            "registerEndDate": '',
            "registerStartDate": '',
            'lastLoginTime': '',
            "lastLoginEndDate": '',
            "lastLoginStartDate": '',
            'limit': 10,
            'page': 1
        }
        this.getList();
      }
    }
  }
</script>
<style>
</style>
