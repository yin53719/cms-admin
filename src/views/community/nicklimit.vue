 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
        <el-col :span="8">
            <el-form-item label="限制内容">
                <el-input v-model="form.sensitiveWords"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="10">
            <el-form-item label="发布时间">
            <el-date-picker
            v-model="form.createTime1"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="20">
        <el-col :span="8">
            <el-form-item label="创建人">
                <el-input v-model="form.creater"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align:right;">
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="getList">查询</el-button>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="resetTemp">重置</el-button>
            <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleAdd">添加</el-button>
            <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleNickSet">昵称设置</el-button>
        </el-col>
        </el-row>
    </el-form>
  </div>
  <div>
    <el-table :data="limitWords" v-loading.body="listLoading" border fit highlight-current-row >
        <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
        <el-table-column width="300" prop="sensitiveWords" align="center" label="限制内容"></el-table-column>
        <el-table-column width="150" prop="creater" align="center" label="创建人"></el-table-column>
        <el-table-column width="180" prop="createTime" align="center" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
                <el-button @click="handleUpda(scope.row)" type="text">编辑</el-button>
                <el-button @click="handleDele(scope.row)" type="text">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange"  background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
  <div>
      <el-dialog title="限制编辑" :visible.sync="limitEditVisible">
        <el-form>
            <el-form-item label="限制文本">
                <el-input type="textarea" v-model="textareaLimitWords"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" v-if="upda" @click="updateLimit">确 定</el-button>
            <el-button type="primary" v-if="add" @click="addLimit">确 定</el-button>
        </div>
      </el-dialog>
  </div>
  <div>
      <el-dialog title="昵称设置" :visible.sync="limitNickVisible">
        <el-form label-width="80px">
            <el-form-item label="字数限制">
                <el-input v-model="nickSetData.nickLenLimit" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item label="修改次数">
                <template>
                    <el-radio-group v-model="radio" @change="radioChange">
                        <el-radio :label="1" style="padding-bottom:10px;"><el-input v-model="nickSetData.nickModTimes" :disabled="inputDis1" style="width:80px;"></el-input>&ensp;次</el-radio><br>
                        <el-radio :label="2" style="padding-bottom:10px;"><el-input v-model="nickSetData.nickDaymodTimes" :disabled="inputDis2" style="width:80px;"></el-input>&ensp; 天一次</el-radio><br>
                        <el-radio :label="3">无限制</el-radio>
                    </el-radio-group>
                </template>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelNick">取 消</el-button>
            <el-button type="primary" @click="updaNick">确 定</el-button>
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
        form: {
            sensitiveWords: '',
            creater: '',
            createTime1: '',
            createStartTime: '',
            createEndTime: '',
            limit: 10,
            page: 1
        },
        limitWords: [],
        total: 0,
        listLoading: false,
        limitEditVisible: false,
        textareaLimitWords: '',
        id: null,   //用于修改
        add: false,
        upda: false,
        limitNickVisible: false,
        nickSetData: {
            id: '',
            nickLenLimit: null,
            nickModTimes: null,
            nickDaymodTimes: null
        },
        radio: 0,
        inputDis1: false,
        inputDis2: false
    };
  },

  mounted(){
    this.getList();
  },
  methods: {
    updaNick(){
        //判断字数限制是否为数字
        if(this.nickSetData.nickLenLimit != null && $.trim(this.nickSetData.nickLenLimit) == ''){
            this.nickSetData.nickLenLimit = null;
        }
        var reg = /^[1-9]\d*$/;
        if(this.nickSetData.nickLenLimit != null && !reg.test(this.nickSetData.nickLenLimit)) {
            this.$message({
                message: '字数限制请输入正数字值',
                type: 'warning'
            });
            return false;
        }
        //判断修改次数限制是否为数字
        if(this.radio == 1){
            var reg = /^[1-9]\d*$/;
            if(!reg.test(this.nickSetData.nickModTimes)) {
                this.$message({
                    message: '修改次数请输入正数字值',
                    type: 'warning'
                });
                return false;
            }
        }
        if(this.radio == 2){
            var reg = /^[1-9]\d*$/;
            if(!reg.test(this.nickSetData.nickDaymodTimes)) {
                this.$message({
                    message: '修改次数请输入正数字值',
                    type: 'warning'
                });
                return false;
            }
        }
        request({
          url:'/community/changeCode/nickSetUpdate',
          method:'post',
          data: this.nickSetData
        }).then(res =>{
           if(res.success){
               this.limitNickVisible = false;
               this.$message({
                    message: '修改成功',
                    type: 'success'
                });
           }
        })

    },
    inputDisCtr(val){
        if(val == 3){
            this.inputDis1 = true;
            this.inputDis2 = true;
        }else if(val == 2){
            this.inputDis1 = true;
            this.inputDis2 = false;
        }else if(val == 1){
            this.inputDis1 = false;
            this.inputDis2 = true;
        }
    },
    radioChange(val){//val是回调参数
        this.nickSetData.nickModTimes = null;
        this.nickSetData.nickDaymodTimes = null;
        // console.log(val);
       this.inputDisCtr(val);
        
    },
    cancelNick(){
        this.limitNickVisible = false;
        this.nickSetData = {
            nickLenLimit: null,
            nickModTimes: null,
            nickDaymodTimes: null
        };
        this.radio = 0;
    },
    handleNickSet(){
        this.limitNickVisible = true;
        request({
          url:'/community/changeCode/nickSet',
          method:'get'
        }).then(res =>{
            this.nickSetData = res.data;
            if(res.data.nickDaymodTimes!=null){
                this.radio = 2;
            }else if(res.data.nickModTimes!=null){
                this.radio = 1;
            }else{
                this.radio = 3;
            }
            this.inputDisCtr(this.radio);
        })
    },
    cancel(){
        this.limitEditVisible = false;
        this.add = false;
        this.upda = false;
    },
    addLimit(){
        this.limitEditVisible = false;
        this.add = false;
        this.getList();
        request({
          url:'/community/sensitive/addLimit',
          method:'get',
          params: {
              "sensitiveWords": this.textareaLimitWords
          }
        }).then(res =>{
            if(res.success){
                this.getList();
                this.$message({
                    message: '新增成功',
                    type: 'success'
                });
            }else{
                this.getList();
                this.$message({
                    message: '新增失败',
                    type: 'warning'
                });
            }
            
        })
    },
    handleDele(row){
        request({
          url:'/community/sensitive/delWords',
          method:'get',
          params: {
              "id": row.id,
          }
        }).then(res =>{
            if(res.success){
                this.getList();
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            }else{
                this.getList();
                this.$message({
                    message: '删除失败',
                    type: 'warning'
                });
            }
            
        })
        this.getList();
    },
    updateLimit(){
        this.limitEditVisible = false;
        this.upda = false;
        this.getList();
        request({
          url:'/community/sensitive/updaLimit',
          method:'get',
          params: {
              "id": this.id,
              "sensitiveWords": this.textareaLimitWords
          }
        }).then(res =>{
            if(res.success){
                this.getList();
                this.$message({
                    message: '更新成功',
                    type: 'success'
                });
            }else{
                this.getList();
                this.$message({
                    message: '更新失败',
                    type: 'warning'
                });
            }
            
        })
    },
    handleUpda(row){
        this.limitEditVisible = true;
        this.textareaLimitWords = row.sensitiveWords;
        this.id = row.id;
        this.upda = true;
    },
    handleAdd(){
        this.limitEditVisible = true;
        this.textareaLimitWords = '';
        this.id = 0;
        this.add = true;
    },
    getList() {
      if(this.form.createTime1.length > 0){
          this.form.createStartTime = this.form.createTime1[0];
          this.form.createEndTime = this.form.createTime1[1];
      }
      request({
          url:'/community/sensitive/searchLimit',
          method:'post',
          data:this.form
      }).then(res =>{
          console.log(res.data);
        this.total = res.data.total;
        this.limitWords = res.data.rows;
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
    resetTemp() {
      this.form = {
        sensitiveWords: '',
        creater: '',
        createTime1: '',
        createStartTime: '',
        createEndTime: '',
        limit: 10,
        page: 1
      };
    }
  }
}
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
