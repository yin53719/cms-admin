<template>
    <div class="app-container calendar-list-container">
      <!-- 数据列表 -->
      <div>
        <el-table :data="userDate" border>
          <el-table-column align="center" type="index" fixed  label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="actionName" label="任务名称" width="180px"></el-table-column>
           <el-table-column align="center"  label="任务类型" width="180px">
            <template slot-scope="type">
                   <span v-if="formDetail.type==1">每日一次</span>
                   <span v-if="formDetail.type==2">不限次数</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="积分值" prop="energy"  width="180px">
    
          </el-table-column>
          <el-table-column align="center" label="状态" width="180px">
            <template slot-scope="scope">
              <span v-if="scope.row.isShow==0">启用</span>
               <span v-if="scope.row.isShow==1">禁用</span>
            </template>
          </el-table-column>
  
          <el-table-column align="center"  label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="info">编辑</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryList.page" :page-sizes="[10,20,30, 50]" :page-size="queryList.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>                          
      </div>

      <!-- 查看用户详情 -->
      <div>
        <el-dialog title="修改任务" :visible.sync="dialogFormVisible">
          <el-form :model="formDetail" ref="formDetail">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="任务名称" :label-width="'100px'">
                  <template>
                      <span v-text="formDetail.actionName"></span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务类型" :label-width="'100px'" >
                   <span v-if="formDetail.type==1">每日一次</span>
                   <span v-if="formDetail.type==2">不限次数</span>
                </el-form-item>
              </el-col>
       
              <el-col :span="24">
                <el-form-item label="积分值" :label-width="'100px'" >
                  <el-input style="width:200px;" v-model="formDetail.energy" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态" :label-width="'100px'" >
                      <el-select v-model="formDetail.isShow" placeholder="请选择">
                         <el-option label="启用" :value="0"></el-option>
                         <el-option label="停用" :value="1"></el-option>
                      </el-select>
                </el-form-item>
              </el-col>
            </el-row>
 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveUser('formDetail')">保 存</el-button>
          </div>
        </el-dialog>
      </div>
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
          "articleRoleCode":'',
          'registerTime': [],
          "registerEndDate": '',
          "registerStartDate": '',
          'lastLoginTime': '',
          "lastLoginEndDate": '',
          "lastLoginStartDate": '',
          'limit': 10,
          'page': 1
        },
        userDate: [],
        total: 0,
        showStatus: false,
        dialogFormVisible: false,//对话框默认不展示
        formDetail: {
          isShow: 0,
          type: 1,
          energy:'',
          actionName:'',
          itemCode:''
        },
        blockLists: [],
        listLoading:false,
        radio: 0,
        radio1: 0,
        banSendShow: false,
        banSendOtherShow: false,
        banSendTimeShow: false,
        inputDis1: false,
        inputDis2: false,
        inputDis3: false,
        bandHour: null,
        bandDay: null,
        bandYear: null,
        presetTime: null,
        presetTime1: null,
        bandYusheShow: true,
        yusheShow1: false,
        yusheShow2: false
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      showyusheBandtime(val){
        if(val !=null && val !=0){
          if(this.radio1 == 1){//小时
            this.presetTime1 = (new Date()).getTime() + 3600*1000*val;
          }else if(this.radio1 == 2){//天
            this.presetTime1 = (new Date()).getTime() + 24*3600*1000*val;
          }else if(this.radio1 == 3){//年
            this.presetTime1 = (new Date()).getTime() + 365*24*3600*1000*val;
          }else if(this.radio1 == 4){//永久
            this.presetTime1 = null;
            this.yusheShow1 = false;
            this.yusheShow2 = true;
          }
        }else{
          this.presetTime1 = null;
        }
      },
      radioChange(val){
        if(val == 5){
          this.banSendOtherShow = true;
          this.radio1Change(1);//选择其它时设置默认小时
          this.presetTime1 = null;
        }else{
          this.restBandTime();//清清除选择其他时的数据
          this.formDetail.bansendTimelength = 24*val;
          //console.log(this.formDetail.bansendTimelength);
          // console.log((new Date()).getTime);
          this.presetTime1 = (new Date()).getTime() + 24*3600*1000*val;
          // console.log(this.presetTime1);
          this.banSendOtherShow = false;
        }
      },
      regTest(val){//正则匹配 ^[1-9]{1,3}$  匹配1~999
          var reg = /^[1-9][0-9]{0,2}$/;
          if(!reg.test(val)){
              this.$message({
                title: "提示",
                message: "请输入数字1~999",
                type: "warrning",
                duration: 2000
              });
              return false;
          }
          return true;
      },
      saveUser(form){
        //跟新任务
          request({
            url: '/energy/task/updateTask',
            method: 'post',
            data: this.formDetail
          }).then(response => {
            if(response.errMsg == null){//保存成功
                this.$message({
                  title: "成功",
                  message: "保存成功",
                  type: "success",
                  duration: 2000
                });
            }else{
                this.$message({
                title: "提示",
                message: "保存失败",
                type: "warrning",
                duration: 2000
              });
            }
          this.dialogFormVisible = false;
          this.getList();
       
        })
      },
      selectChange(val){
        // console.log(val);
        this.banSendOtherShow = false;//其他时间选项默认不打开
        this.bandYusheShow = true;
        this.presetTime = null;//清除预设禁言至
        this.radio = null;
        this.radio1 = null;
        if(val == 5){//显示小黑屋设置
            this.radio = 1;//设置默认选中1
            this.presetTime1 = (new Date()).getTime() + 24*3600*1000;
            this.radio1 = null;//
            this.showStatus = false;
            this.banSendShow = true;
            this.yusheShow1 = true;
            this.yusheShow2 = false;
        }else if(val != 4 && val != '' && val != null && val != 5){
          this.formDetail.bansendTimelength = null;
          this.showStatus = true;
          this.banSendShow = false;
        }else{
          this.formDetail.bansendTimelength = null;
          this.showStatus = false;
          this.banSendShow = false;
        }
      },
      handleClick(val){
        //查询板块列表
        this.formDetail=val;
        this.dialogFormVisible=true;

      },
      selectTimeLenChange(val){//通过后台禁言时长判断按钮选中状态
        this.bandYusheShow = true;
        if(val == -1){//永久禁言
            this.radio1 = 4;
            this.radio1Change(this.radio1);
            this.bandYusheShow = false;
        }else{
          if(val%365 == 0){//按年算
            this.radio1 = 3;
            this.radio1Change(this.radio1);
            this.bandYear = val/365/24;
          }else if(val%24 == 0){//按天算
            if(val/24 == 1){
              this.radio = 1;
            }else if(val/24 == 3){
              this.radio = 3;
            }else if(val/24 == 7){
              this.radio = 7;
            }else if(val/24 == 30){
              this.radio = 30;
            }else{
              this.radio1 = 2;
              this.radio1Change(this.radio1);
              this.bandDay = val/24;
            }
          }else{
            this.radio1 = 1;
            this.radio1Change(this.radio1);
            this.bandHour = val;
          }
        }
      },
      getList() {
        this.listLoading = true;
  
      
        request({
          url: '/energy/task/queryTaskList',
          method: 'get',
        }).then(response => {
          this.userDate = response.data.rows;
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
            'registerTime': [],
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
