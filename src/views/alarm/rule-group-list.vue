 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="规则组名称"  v-model="listQuery.groupName" > </el-input>
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="规则名称"   v-model="listQuery.ruleName" > </el-input>
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="规则关键字"   v-model="listQuery.keyword" > </el-input>
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="服务名"   v-model="listQuery.appName" > </el-input>  
     <el-select v-model="listQuery.status" style="width: 200px;" class="filter-item" placeholder="请选择状态"> 
        <el-option  v-for="item in statusOptions" :key="item.label"  :label="item.label" :value="item.value">
        </el-option>
        <el-option label="全部状态" value=""></el-option>
     </el-select> 
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
 
    <el-table-column  style="width: 200px;" type="index" :index="indexMethod">
    </el-table-column> 

    <el-table-column  align="center" label="规则名称">
        <template slot-scope="scope">
            <span>{{scope.row.ruleGroupName}}</span>
        </template>
    </el-table-column>


    <el-table-column  align="center" label="启动 " >
        <template slot-scope="scope"> 
            <span v-if="scope.row.ruleGroupStatus==true" type="info" class="text-success" > {{status[scope.row.ruleGroupStatus]}} </span>
             <span v-else type="info" class="text-warning" > {{status[scope.row.ruleGroupStatus]}} </span>
        </template>
    </el-table-column> 
 
     
     <el-table-column  align="center" label="报警规则 " width="300px">
        <template slot-scope="scope">
            <span v-if="item!=null" v-for="item in scope.row.rules" :key="item.id"> {{item.time}}分钟:{{item.keyword}} 连续 {{item.count}}  次 则报警;<br/></span>
        </template>
    </el-table-column> 
      <el-table-column align="center" label="受控服务 ">
      <template slot-scope="scope">
         <span v-for="item in scope.row.ruleScopes" :key="item.id">{{item.ipApp}}<br/></span> 
      </template>
    </el-table-column>

    
    <el-table-column  align="center" label="通知对象">
        <template slot-scope="scope">
            <el-button size="small"  style="color:#409EFF"  @click="showUsers(scope.row)">人员查看</el-button>
        </template>
    </el-table-column>



    <el-table-column align="center" label="操作"  width="280">
      
      <template slot-scope="scope">
        <router-link   :to="{path:'/alarm/add',query:{id:scope.row.ruleGroupId}}" >
        <el-button v-if="groupTypeManager_btn_edit" size="small" type="success">
          编辑
        </el-button>
          
       </router-link>
          
    <!-- <el-button size="small" type="info"  @click="showScript(scope.row)">查看</el-button> -->

    <el-button v-if="scope.row.ruleGroupStatus==true" size="small" type="danger" @click="updateStatus(scope.row,false)">禁用
    </el-button> 
    <el-button v-else size="small" type="success" @click="updateStatus(scope.row,true)">启用
    </el-button>

    <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除
    </el-button>
    </template>
    </el-table-column>

</el-table>

  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>

  

    <!-- 详情模态框 -->
  <el-dialog  :title="textMap[dialogStatus]"  :visible.sync="dialogForScript">
   <el-row v-for="(item, index) in userGroupList" :key="item.id" >
      
       <el-col class="el-header"><h3>{{index+1}}.{{item.name}}</h3> 
         </el-col> 
       
          <el-table v-if="item.members!=''"    :key='tableKey' :data="item.members" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
              <el-table-column  align="center" label="姓名">
                  <template slot-scope="scope">
                      <span>{{scope.row.name}}</span> 
                  </template> 
              </el-table-column> 
              <el-table-column  align="center" label="用户名称">
                  <template slot-scope="scope">
                      <span>{{scope.row.username}}</span> 
                  </template> 
              </el-table-column> 
              
               <el-table-column  align="center" label="用户手机">
                  <template slot-scope="scope">
                      <span>{{scope.row.telPhone}}</span> 
                  </template> 
              </el-table-column> 
                <el-table-column  align="center" label="用户邮件">
                  <template slot-scope="scope">
                      <span>{{scope.row.email}}</span> 
                  </template> 
              </el-table-column> 
        
          </el-table>
   </el-row>

 
    <div slot="footer" class="dialog-footer">
      <el-button  type="success"    @click="dialogForScript = false">关闭</el-button> 
    </div>
  </el-dialog>

</div>
</template>

 <script>
import {
  pagelist,
  putObj,
  delObj,
} from "@/api/alarm/rule_group_list";  
import { mapGetters } from "vuex";
import{groupUserlist}from "@/api/alarm/alarmUserGroup"
export default {
  name: "rulelist",
  data() {
    return {
      form: {
        status:{
          true:"启动",
          false:"禁用"
        }
      },
      rules: { 
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        status:undefined, 
        groupName:undefined,
        ruleName:undefined,
        keyword:undefined,
        appName:undefined,
        page: 1,
        limit: 20
      },
      dialogForScript: false,
      showScriptdata: undefined,
      dialogFormVisible: false,
      dialogStatus: "",
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      groupTypeManager_btn_add: false,
      userGroupList:null,
      textMap: {
        userlist: "关联用户列表",
        create: "创建"
      },
      tableKey: 1,
      status:{
          true:"已启动",
          false:"已禁用"
        }, 
       statusOptions: [
         {
          value: 1,
          label: '启用'
        },{
          value: 0,
          label: '禁用'
        }],
    };
  },
  created() {
    this.getList();
    this.groupTypeManager_btn_edit = this.elements["groupTypeManager:btn_edit"];
    this.groupTypeManager_btn_del = this.elements["groupTypeManager:btn_del"];
    this.groupTypeManager_btn_add = this.elements["groupTypeManager:btn_add"];
  },
  computed: {
    //获取state里面的listName对象
    ...mapGetters(["elements"])
  },
  methods: {
    showScript(row) {
      this.dialogForScript = true;
      this.showScriptdata = row.script;
    },


    showUsers(row){
      this.dialogForScript=true;
      this.dialogStatus="userlist";
      this.listLoading = true;
      groupUserlist({ruleGroupId:row.ruleGroupId}).then(response=>{
        this.userGroupList=response.data;
       console.log(this.userGroupList);
       this.listLoading = false;
      });
    },

    indexMethod(index) {
      return index * 2;
    },
    //获取列表
    getList() {
      this.listLoading = true;
      pagelist(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    handleCreate() {
       this.jump({path: '/alarm/add'});
    },
        jump(url, replace = false) {
      if (/^javas/.test(url) || !url) {
        return;
      }

      let useRouter =
        typeof url === "object" ||
        (this.$router && typeof url === "string" && !/http/.test(url));
      if (useRouter) {
        if (!replace) {
          this.$router.push(url);
        } else {
          this.$router.replace(url);
        }
      } else {
        if (!replace) {
          window.location.href = url;
        } else {
          window.location.replace(url);
        }
      }
    },
     
    updateStatus(row,uptostatus) {
      putObj(row.ruleGroupId,{id:row.ruleGroupId,status:uptostatus}).then(response => {
        this.$notify({
            title: "成功",
            message: "状态已更改",
            type: "success",
            duration: 2000
          });
         this.getList();
      });
    },
   handleUpdate(row) {
      //  this.jump({path: '/alarm/add?'+row.ruleGroupId});
       router.push({ name: '/alarm/add', params: { userId: 123 }});
    },
    
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.ruleGroupId).then(() => {
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
   
  }
};
</script>

<style>
  .text-success{
    color:#67C23A;
  }
   .text-warning{
    color:rgb(248, 9, 9);
  }
  
  /* .el-header{
    background-color: #B3C0D1;
    color: #333; 
    line-height: 60px;
  } */
</style>
