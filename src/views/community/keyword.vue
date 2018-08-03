<template>
    <div style="padding:20px;">
      <el-row  style="padding:10px 0;">
         <el-col style="text-align:right" :span="20">
             <el-button type="primary" @click="dialogFormVisible=true"> 新增</el-button>
              <el-button type="primary" @click="download">下载</el-button>
         </el-col>
         <el-col :span="4" style="text-align:center">
             <el-upload
                class="upload-demo"
                :action='action'
                :on-success="handleChange"
                accept="application/vnd.ms-excel,	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :show-file-list="false">
                <el-button type="primary">导入</el-button>
              </el-upload>
         </el-col>
             
      </el-row>

      <!-- 数据列表 -->
      <div>
        <el-table :data="userDate" border style="width: 100%">
          <el-table-column align="center" type="index" fixed  label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="sensitiveWords" label="敏感词汇" ></el-table-column>
          <el-table-column align="center" prop="createTime" label="添加时间" width="180"></el-table-column>
          
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="saveEdit(scope.row)" type="info">编辑</el-button>
               <el-button @click="remove(scope.row.id)" type="info">删除</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryList.page" :page-sizes="[10,20,30, 50]" :page-size="queryList.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>                          
      </div>

      <!-- 查看用户详情 -->
      <div>
        <el-dialog title="新增" :visible.sync="dialogFormVisible">
          <el-form ref="form"  label-width="80px">
            <el-row :gutter="20" v-for="(x,n) in formDetail" :key="n">
              <el-col :span="4" style="text-align:right;">
                  <span v-if="n==0">添加敏感词汇</span>
                   <span v-else>&nbsp;</span>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :label-width="'1px'">
                  <el-input placeholder="请输入内容"  v-model="x.text">
                </el-input>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form>
          <el-row>
            <el-col>
                <el-button @click="addsensitiveWords">添加</el-button>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveadd">保 存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="dialogFormVisible11">
          <el-form ref="form"  label-width="80px">
          <el-row :gutter="20" v-for="(x,n) in formDetail1" :key="n">
               <el-col :span="4" style="text-align:right;" >
                  <span v-if="n==0">添加敏感词汇</span>
                   <span v-else>&nbsp;</span>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" :label-width="'1px'">
                  <el-input placeholder="请输入内容"  v-model="x.text">
                </el-input>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form>
          <el-row>
            <el-col>
                <el-button @click="addsensitiveWords1">添加</el-button>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible11 = false">取 消</el-button>
            <el-button type="primary" @click="saveUser">保 存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>

import request from '@/utils/request';
export default {
    data() {
      return {
        //定义查询条件
        queryList: {
          'limit': 10,
          'page': 1
        },
        userDate: [],
        action:process.env.BASE_API +'/cmyManage/sensitive/words/import',
        formDetail:[{text:''}],
        formDetail1:[],
        total: 0,
        dialogFormVisible: false,//对话框默认不展示
        dialogFormVisible11:false,
        listLoading:false,
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      saveEdit(row){
          this.id=row.id;
          var list=row.sensitiveWords.split('|');
          var list2=[];
          for(var i=0;i<list.length;i++){
            list2.push({text:list[i]})
         }
          this.formDetail1=list2;
          this.dialogFormVisible11=true;
      },
      addsensitiveWords(){
        this.formDetail.push({text:''})
      },
      addsensitiveWords1(){
        this.formDetail1.push({text:''})
      },
      saveUser(){

        var list=[];
        for(var i=0;i<this.formDetail1.length;i++){
            list.push(this.formDetail1[i].text)
         }
          request({
            url: '/cmyManage/sensitive/words/update',
            method: 'post',
            data:{
              id:this.id,
              sensitiveWords:list.join('|')
            } 
          }).then(response => {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 2000
              });
    
          this.dialogFormVisible11 = false;
          this.getList();
          });
  
      },
      saveadd(){
         var list=[];
         for(var i=0;i<this.formDetail.length;i++){
            list.push(this.formDetail[i].text)
         }

         if(list.join('|')==''){
            this.$message({
            message: "至少添加一个",
            type: "waring",
            duration: 2000
          });
          return false;
         }
          request({
            url: '/cmyManage/sensitive/words/add',
            method: 'post',
            data:{sensitiveWords:list.join('|')}
          }).then(response => {
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 2000
              });
    
              this.dialogFormVisible = false;
              this.getList();
          });
   
      },
      getList() {
        this.listLoading = true;
  
        request({
          url: '/cmyManage/sensitive/words/search',
          method: 'post',
          data: this.queryList,
        }).then(response => {
 
          this.userDate = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;

        });
      },
      handleChange(file, fileList) {
            console.log(file);
          if(file.success){
            this.$message({
              message: "导入成功",
              type: "success",
              duration: 2000
            });
             this.getList();
          }else{
            this.$message({
              message: file.data,
              type: "error",
              duration: 2000
            });
          }
          
         
     
      },
      remove(id){
        request({
          url: '/cmyManage/sensitive/words/delWords',
          method: 'get',
          params:{id:id},
        }).then(response => {
          
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 2000
          });
          this.getList();

        });
      },
      handleSizeChange(val) {
        this.queryList.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.queryList.page = val;
        this.getList();
      },
      download(){
        window.location.href='./static/tempFile/sensitiveWordsTemplate.xlsx'
      }
    }
  }
</script>
<style>
</style>
