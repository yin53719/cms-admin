<template>
    <div class="app-container calendar-list-container">
      <div class="filter-container" >
        <el-form  label-width="100px">
            <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="用户等级">
                    <el-select v-model="queryList.articleRoleCode" placeholder="请选择">
                      <el-option
                        v-for="item in articleRoleCodes"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="注册时间">
                  <el-date-picker
                    v-model="queryList.registerTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="最后登录时间">
                  <el-date-picker
                    v-model="queryList.lastLoginTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="text-align:right;" >
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleQquery">查询</el-button>
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
      </div>

      <!-- 数据列表 -->
      <div>
        <el-table :data="userDate" border style="width: 100%">
          <el-table-column align="center" type="index" fixed  label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="nickName" label="昵称" width="180px"></el-table-column>
          <el-table-column align="center" prop="name" label="用户账号" width="180px"></el-table-column>
          <el-table-column align="center" label="注册时间" width="180px">
            <template slot-scope="scope">
              <span v-format-date-all="scope.row.registerDate"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="最后登录时间" width="180px">
            <template slot-scope="scope">
              <span v-format-date-all="scope.row.lastLoginDate"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="articleNumber" label="发帖数" width="110px"></el-table-column>
          <el-table-column align="center" prop="commentNumber" label="回帖数" width="110px"></el-table-column>
          <el-table-column align="center" prop="articleRoleCode" label="用户等级" width="120px">
            <template slot-scope="scope">
                <span v-if="scope.row.articleRoleCode==1" >超级管理员</span>
                <span v-else-if="scope.row.articleRoleCode==2" >管理员</span>
                <span v-else-if="scope.row.articleRoleCode==3" >版主</span>
                <span v-else-if="scope.row.articleRoleCode==4" >普通用户</span>
                <!-- <span v-else-if="scope.row.articleRoleCode==5" >黑名单</span> -->
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否黑名单" width="100px">
            <template slot-scope="scope">
                <span v-if="scope.row.isBlack==0" >是</span>
                <span v-else-if="scope.row.isBlack==1" >否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.saicUserId)" type="info">查看</el-button>
            </template>
          </el-table-column>
        </el-table> 
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryList.page" :page-sizes="[10,20,30, 50]" :page-size="queryList.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>                          
      </div>

      <!-- 查看用户详情 -->
      <div>
        <el-dialog title="查看用户" :visible.sync="dialogFormVisible">
          <el-form :model="formDetail" ref="formDetail">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户账号" :label-width="'100px'">
                  <template>
                  <span v-text="formDetail.name"></span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户昵称" :label-width="'100px'" 
                 prop="nickName" :rules="[{ required: true, message: '昵称不能为空'}]">
                  <el-input style="width:200px;" v-model="formDetail.nickName" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户权限" :label-width="'100px'">
                  <el-select v-model="formDetail.articleRoleCode" placeholder="请选择权限" @change="selectChange(formDetail.articleRoleCode)">
                    <el-option label="管理员" :value="2"></el-option>
                    <el-option label="版主" :value="3"></el-option>
                    <el-option label="普通用户" :value="4"></el-option>
                    <el-option label="小黑屋" :value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="板块" :label-width="'100px'" v-show="showStatus">
                  <el-select v-model="formDetail.blockId" placeholder="请选择权限">
                    <el-option
                      v-for="item in blockLists"
                      :key="item.id"
                      :label="item.blockName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20" v-if="banSendShow">
                <el-col :span="24">
                  <el-form-item label="禁言时效" :label-width="'100px'">
                    <template>
                      <el-radio-group v-model="radio" @change="radioChange">
                        <el-radio :label="1">24小时</el-radio>
                        <el-radio :label="3">3天</el-radio>
                        <el-radio :label="7">7天</el-radio>
                        <el-radio :label="30" style="padding-bottom:10px;">30天</el-radio>
                        <br>
                        <el-radio :label="5">其他</el-radio>
                      </el-radio-group>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="banSendOtherShow" style="padding-left:110PX;">
                 
                      <el-radio-group v-model="radio1" @change="radio1Change">
                        <el-radio :label="1">
                          <el-input :disabled="inputDis1" v-model="bandHour" @blur="showyusheBandtime(bandHour)" style="width:80px;"></el-input>&ensp;小时
                        </el-radio>
                        <el-radio :label="2">
                          <el-input :disabled="inputDis2" v-model="bandDay" @blur="showyusheBandtime(bandDay)" style="width:80px;"></el-input>&ensp;天
                        </el-radio>
                        <el-radio :label="3"><el-input :disabled="inputDis3" v-model="bandYear" @blur="showyusheBandtime(bandYear)" style="width:80px;"></el-input>&ensp;年</el-radio>
                        <el-radio :label="4">永久</el-radio>
                      </el-radio-group>
           
                </el-col>
                <el-col :span="24">
                  <el-form-item>
                    <div  v-if="bandYusheShow && presetTime != null" style="color:green;padding-left:100PX;">当前禁言至:<span style="color:green;" v-format-date-all="presetTime"></span></div>
                    <div  v-if="!bandYusheShow" style="color:green;padding-left:100PX;">当前禁言至:&ensp;永久<span style="color:green;" ></span></div>
                    <div  v-if="yusheShow1" style="color:red;padding-left:100PX;">预设禁言至:<span style="color:red;" v-format-date-all="presetTime1"></span></div>
                  </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="点赞数" :label-width="'100px'">
                    <span v-text="formDetail.praiseNumber"></span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="置顶数" :label-width="'100px'">
                    <span v-text="formDetail.topNumber"></span>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="回帖数" :label-width="'100px'">
                    <span v-text="formDetail.commentNumber"></span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="精华数" :label-width="'100px'">
                  <span v-text="formDetail.superNumber"></span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发帖数" :label-width="'100px'">
                  <span v-text="formDetail.articleNumber"></span>
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
        //权限级别
        articleRoleCodes:[
          {'code':'','name':'全部'},
          {'code':1,'name':'超级管理员'},
          {'code':2,'name':'管理员'},
          {'code':3,'name':'版主'},
          {'code':4,'name':'普通用户'}
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
          blockId: 0,
          bansendTimelength: 0,
          bansendStarttime: null
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
      restBandTime(){
        this.bandHour= null;
        this.bandDay=null;
        this.bandYear= null;
      },
      radio1Change(val){
        this.presetTime1 = null;
        this.yusheShow1 = true;
        this.yusheShow2 = false;
        this.radio = 5;
        this.banSendOtherShow = true;
        this.restBandTime();//重置数据
        this.radio1 = val;
        if(val == 1){
          this.inputDis1 = false;
          this.inputDis2 = true;
          this.inputDis3 = true;
        }else if(val == 2){
          this.inputDis1 = true;
          this.inputDis2 = false;
          this.inputDis3 = true;
        }else if(val == 3){
          this.inputDis1 = true;
          this.inputDis2 = true;
          this.inputDis3 = false;
        }else{
          this.formDetail.bansendTimelength = -1;//-1代表永久禁言
          this.presetTime1 = '永久';
          this.yusheShow1 = true;
          this.yusheShow2 = true;
          this.inputDis1 = true;
          this.inputDis2 = true;
          this.inputDis3 = true;
          
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
        //处理禁言时间开始
        if(this.radio == 5){
            if(this.bandHour != null){
              if(this.regTest(this.bandHour)){
                this.formDetail.bansendTimelength = this.bandHour;
              }else{
                return false;
              }
            }else if(this.bandDay != null){
              if(this.regTest(this.bandDay)){
                this.formDetail.bansendTimelength = this.bandDay*24;
              }else{
                return false;
              }
            }else if(this.bandYear != null){
              if(this.regTest(this.bandYear)){
                this.formDetail.bansendTimelength = this.bandYear*365*24;
              }else{
                return false;
              }
            }else{//
              if(this.radio1 != 4){
                this.$message({
                      title: "提示",
                      message: "请输入数字禁言时长",
                      type: "warrning",
                      duration: 2000
                });
                return false;
              }
            }
        }
        if(this.radio == 1){//处理默认选中时数据提交不了的情况
           this.formDetail.bansendTimelength = 24;//24小时
        }
        this.$refs[form].validate(valid => {
          request({
            url: '/community/user/updateUserBlock',
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
          });
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
        request({
          url: '/community/article/queryListBlock',
          method: 'post',
          data: {
              limit: 10,
              page: 1
          }
        }).then(response => {
          console.log(response.data.rows);
          this.blockLists = response.data.rows;
        });
        //获取用户详情
        this.presetTime = null;
        request({
          url: '/community/user/getUserDetail',
          method: 'get',
          params: {'id':val},
        }).then(response => {
          // console.log(response.data);
          this.dialogFormVisible = true;
          this.formDetail = response.data;
          // console.log(this.formDetail.superNumber);
          // console.log(this.presetTime);
          this.selectChange(this.formDetail.articleRoleCode);//选中用户权限
          this.presetTime = response.data.bansendStarttimeLong+this.formDetail.bansendTimelength*3600*1000;
          //判断禁言时长，选中时间按钮处理
          console.log(this.formDetail.bansendTimelength);
          if(this.formDetail.bansendTimelength != null){
            this.selectTimeLenChange(this.formDetail.bansendTimelength);
            this.yusheShow1 = true;
            this.yusheShow2 = false;
          }else{
            this.yusheShow1 = false;
            this.yusheShow2 = false;
          }
          this.presetTime1 = null;
        });

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
  
        if(this.queryList.registerTime && this.queryList.registerTime.length>0){
          this.queryList.registerStartDate = this.queryList.registerTime[0];
          this.queryList.registerEndDate = this.queryList.registerTime[1];
        }else{
           this.queryList.registerStartDate = '';
           this.queryList.registerEndDate = '';
        }
        if(this.queryList.lastLoginTime && this.queryList.lastLoginTime.length>0){
          this.queryList.lastLoginStartDate = this.queryList.lastLoginTime[0];
          this.queryList.lastLoginEndDate = this.queryList.lastLoginTime[1];
        }else{
          this.queryList.lastLoginStartDate = '';
          this.queryList.lastLoginEndDate = '';
        }
        request({
          url: '/community/user/getListUser',
          method: 'post',
          data:postData(this.queryList),
        }).then(response => {
          // console.log(response.data.rows)
          this.userDate = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
            // var list= response.data.rows;
            // this.total = response.data.total;
            //   for(var i=0;i<list.length;i++){
            //       list[i]['message']=this.hostIp + '/saicui/preview?id=' + list[i].activityId + '&type=activity'
            //   }
            // this.list = list;
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
