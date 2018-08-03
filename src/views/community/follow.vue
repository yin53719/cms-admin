<template>
    <div style="padding:20px;">

        <el-table :data="userDate" border style="width: 100%">
          <el-table-column align="center" type="index" fixed  label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="remName" label="配置名称" width="280"></el-table-column>
          <el-table-column align="center" prop="createDate" label="创建时间" width="180"></el-table-column>
           <el-table-column align="center" prop="updateDate" label="更新时间" width="180"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="saveEdit(scope.row)" type="info">编辑</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryList.page" :page-sizes="[10,20,30, 50]" :page-size="queryList.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>                          

        <el-dialog title="修改" :visible.sync="dialogFormVisible11">
          <el-form ref="form" :model="query" label-width="80px">

                <el-form-item label="配置名称" :label-width="'80px'">
                  <el-input placeholder="请输入内容"  v-model="form.remName">
                </el-input>
                </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible11 = false">取 消</el-button>
            <el-button type="primary" @click="saveUser">保 存</el-button>
          </div>
        </el-dialog>
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
        formDetail:[{text:''}],
        formDetail1:[],
        total: 0,
        dialogFormVisible: false,//对话框默认不展示
        dialogFormVisible11:false,
        remName:'',
        form:{}
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      saveEdit(row){
          this.form=row;
          this.dialogFormVisible11=true;
      },
      saveUser(){
          request({
            url: '/cmyManage/watch/property/info',
            method: 'post',
            data:this.form
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
      getList() {
        this.listLoading = true;
  
        request({
          url: '/cmyManage/watch/page/properties',
          method: 'get',
          params: this.queryList,
        }).then(response => {
 
          this.userDate = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;

        });
      },
      handleSizeChange(val) {
        this.queryList.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.queryList.page = val;
        this.getList();
      }
    }
  }
</script>
<style>
</style>
