<template>
  <div class="tab-container">
    <div style="border:solid 1px #f5f5f5;padding:15px;padding-bottom:0;margin-bottom:15px;">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="formInline.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formInline.nickname" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="formInline.roles" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="formInline.sex" placeholder="性别"></el-input>
        </el-form-item>

      </el-form>
      <el-row style="margin-bottom:20px;text-align:right;margin-right:50px;">
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
      </div>
      <el-row style="margin-bottom:20px">
        <el-button type="primary" @click="addUser">新增用户</el-button>
      </el-row>
    
    
    <el-table :data="list" border  style="max-width:1200px;">
        
        <el-table-column prop="id" label="序号" type='index' align="center"  width="50"> </el-table-column>
        <el-table-column prop="username" label="用户名"  width="120" align="center"> </el-table-column>
        <el-table-column label="角色" width="150" align="center"> 
            <template slot-scope="scope">
              <a herf="#">{{scope.row.role_name}}</a>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="姓名" width="80" >
          <!-- <template slot-scope="scope">
            <a href="javascript:void(0)" @click="handleClick(scope.row)" style="color:#409EFF">{{scope.row.nickname}}</a>
          </template> -->
        </el-table-column>
        <!-- <el-table-column align="center" label="姓名" width="80" >
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="handleClick(scope.row)" style="color:#409EFF">{{scope.row.nickname}}</a>
          </template>
        </el-table-column> -->
        <el-table-column prop="sex" label="性别" width="150" align="center"> </el-table-column>
        <el-table-column prop="age" label="年龄" width="150" align="center"> </el-table-column>
        <!-- <el-table-column prop="code" label="CODE" width="150" align="center"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="150" align="center"> </el-table-column> -->
        <el-table-column prop="addr" label="地址" width="150" align="center"> </el-table-column>
        <el-table-column  label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="editUser(scope.row)" >编辑</el-button>
                    <el-button @click="removeUser(scope.row)" type="text" >删除</el-button>
                </template>
        </el-table-column>
    </el-table>
   <el-dialog title="新增用户" :visible.sync="isShowadd" width="60%">
      <add-user v-if="isShowadd"></add-user>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isShowadd=false">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="isShowedit" width="60%">
      <edit-user v-if="isShowedit" ></edit-user>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isShowedit=false">取 消</el-button>
          <el-button type="primary" @click="editSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import editUser from './components/editUser'
  import addUser from './components/addUser'

  export default {
    name: 'users',
    components: { addUser ,editUser},
    data() {
      return {
        list:[],
        id:'',
        isShowadd:false,
        isShowedit:false,
        addForm: {
					username: '',
                    sex: 1,
                    nickname:'',
					age: 0,
					birth: '',
                    addr: '',
                    avatar: '',
                    roles:""
        },
        formInline: {
          username: '',
          rolea: '',
          age:'',
          sex:''
        }
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
      removeUser(rows){
        request({
           url:'/api/users/'+rows.user_id,
           method:'delete'
        }).then((res)=>{
            this.fetchData()
        })
      },
      addSave(){
        this.$children[4].$children[2].addSubmit();
      },
      editSave(){
        
        this.$children[4].$children[2].addSubmit();
      },
      search(){
          console.log(this.formInline);
          this.fetchData(this.formInline)
      },
      addUser(){
         this.isShowadd=true;
      },
      editUser(row){
         this.id=row.user_id;
         this.isShowedit=true;
      },
      formatter(row, column){
        console.log(row, column);
        return `<a>'sss'</a>`
      },
      fetchData (params){
        request({
           url:'/api/users',
           method:'get',
           params:params || {}
        }).then((res)=>{
            this.list=res.data.rows;
        })
      }
    }
  }
</script>
<style scoped>
  .tab-container{
    margin: 20px 10px;
  }
</style>