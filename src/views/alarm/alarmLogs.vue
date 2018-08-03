 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="服务名称" v-model="listQuery.appName"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="规则组名称" v-model="listQuery.groupName"> </el-input>
        <template >
          <el-select v-model="listQuery.status" placeholder="请选择状态"  class="filter-item">
            <el-option  v-for="item in statusMapselect" :key="item.value"  :label="item.label"  :value="item.value">
            </el-option>
          </el-select>
        </template>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> 
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
 
  <!-- <el-table-column align="center" label="序号" width="65">
      <template scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column> -->

    <el-table-column  type="index" :index="indexMethod">
    </el-table-column>
    
  

    <el-table-column  align="center" label="规则组名称">
        <template slot-scope="scope">
            <span>{{scope.row.groupName}}</span>
        </template>
    </el-table-column>

    <el-table-column  align="center" label="服务名称">
        <template slot-scope="scope">
            <span>{{scope.row.appName}}</span>
        </template>
    </el-table-column>

      <el-table-column align="center" label="报警时间">
      <template slot-scope="scope">
          <span>{{getLocalTimes(scope.row.createDate)}}</span>
      </template>
    </el-table-column>

    <!-- <el-table-column  align="center" label="报错信息">
        <template scope="scope">
            <span class="lengthtext"> {{scope.row.alertDetail}}</span>
        </template>
    </el-table-column>  -->

    <el-table-column  align="center" label="报错信息">
        <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <span>{{scope.row.alertDetail}}</span>
          <div slot="reference" class="name-wrapper">
           <span class="lengthtext"> {{scope.row.alertDetail}}</span>
          </div>
        </el-popover>
        </template>
    </el-table-column> 


  
      <el-table-column align="center" label="状态">
      <template slot-scope="scope">
          <el-tag  v-if="scope.row.status=='Trigger'" type="danger">{{statusMap[scope.row.status]}}</el-tag>
          <el-tag  v-else-if="scope.row.status=='Notice'" type="danger">{{statusMap[scope.row.status]}}</el-tag>
          <el-tag  v-else-if="scope.row.status=='Handle'" type="warning">{{statusMap[scope.row.status]}}</el-tag>
          <el-tag  v-else-if="scope.row.status=='Finished'" type="success">{{statusMap[scope.row.status]}}</el-tag>
          <el-tag  v-else type="info">{{statusMap[scope.row.status]}}</el-tag>
          
      </template>
    </el-table-column>

    

    <el-table-column align="center" label="操作" >
      
      <template slot-scope="scope">
        <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">
          更改状态
        </el-button> 
    </template>
    </el-table-column>

</el-table>

  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>

 
    <!-- 详情模态框 -->
  <el-dialog  title="更改报警状态"   :visible.sync="dialogFormVisible">
    
    <el-form :model="form" :rules="rules" ref="form">
       <el-form-item label="选择状态">
        <el-radio-group v-model="form.status"  border=true size="medium">
          <el-radio  label="Handle">开始处理</el-radio>
          <el-radio  label="Finished">报警已解除</el-radio>
        </el-radio-group>
      </el-form-item>
  </el-form>
 
    <div slot="footer" class="dialog-footer"> 
      
      <el-button  type="primary"    @click="dialogFormVisible = false">取消</el-button>
      <el-button  type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

 <script>
import {
  page,
  getAlarmInfoList, 
  putObj,
  getObj
} from "@/api/alarm/alarmLogs";
import {getLocalTime} from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  name: "alarmLogs",
  data() {
    return {
      form: {
        id:undefined,
        alertDetail:undefined,
        groupId:undefined,
        groupName:undefined,
        status: undefined,
        createDate:undefined
      },
        rules: { 
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        status:undefined,
        page: 1,
        limit: 20,
        groupName: undefined,
        appName:undefined
      },
      dialogForScript: false,
      showScriptdata: undefined,
      dialogFormVisible: false,
      dialogStatus: "",
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      groupTypeManager_btn_add: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
       statusMap: {Trigger:"已触发",Notice:"已通知",Handle:"处理中",Finished:"已解除"},
       statusMapselect:[ 
        {value: 'Trigger', label: '已触发'},
        {value: 'Notice', label: '已通知'},
        {value: 'Handle', label: '处理中'},
        {value: 'Finished', label: '已解除'},
        {value: '', label: '全部状态'}, 
       ], 
      tableKey: 1
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
    
  getLocalTimes(ms){
    return getLocalTime(ms);
  },
    indexMethod(index) {
      return index * 2;
    },
    //获取列表
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
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
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 更新列表
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
   
  
   
    update(formName) {
        
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    resetTemp() {
      this.form = {
         id:undefined,
        alertDetail:undefined,
        groupId:undefined,
        groupName:undefined,
        status: undefined
      };
    }
  }
};
</script>
<style>
.lengthtext{
    display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6; 
  overflow: hidden;
  }
</style>

