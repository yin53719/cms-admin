 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="srcUrl" v-model="listQuery.srcUrl"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="authService" v-model="listQuery.authService"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
 
  
    <el-table-column  type="index" :index="indexMethod">
    </el-table-column>
    
  

    <el-table-column   align="center" label="srcUrl">
        <template slot-scope="scope">
            <span>{{scope.row.srcUrl}}</span>
        </template>
    </el-table-column>


    <el-table-column  align="center" label="authService">
        <template slot-scope="scope">
            <span> {{scope.row.authService}}</span>
        </template>
    </el-table-column>


    <el-table-column   align="center" label="acceptType">
        <template slot-scope="scope">
            <span >{{scope.row.acceptType}}</span>
        </template>
    </el-table-column>  
    <el-table-column align="center" label="操作" width="200">
      
      <template slot-scope="scope">
        <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">
          编辑
        </el-button>
    <el-button v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
    </el-button>
    </template>
    </el-table-column>

</el-table>

  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>

  <!-- 模态框 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"> 
    
    <el-form :model="form" :rules="rules" ref="form" label-width="100px"> 
        
        <el-form-item label="URL" prop="srcUrl">
          <el-input v-model="form.srcUrl" placeholder="请输入URL"></el-input>
        </el-form-item>
        <el-form-item label="服务" prop="authService">
          <el-input v-model="form.authService" placeholder="请输入服务"></el-input>
        </el-form-item> 
         <el-form-item label="执行接受方式" prop="acceptType">
          <el-select v-model="form.acceptType" placeholder="执行接受方式">
            <el-option label="user" value="user"></el-option>
            <el-option label="userAndPassword" value="userAndPassword"></el-option>
          </el-select>
        </el-form-item> 
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

 

</div>
</template>

 <script>
import {
  page,
  getGateList,
  delObj,
  addObj,
  putObj,
  getObj
} from "@/api/gate/gate_auth_provider";
import { mapGetters } from "vuex";
export default {
  name: "filter",
  data() {
    return {
      form: {
        id: undefined, 
        srcUrl: undefined,
        authService: undefined,
        acceptType: undefined,
      },
      rules: { 
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serviceId: undefined
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
    showScript(row) {
      this.dialogForScript = true;
      this.showScriptdata = row.script;
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
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.id).then(() => {
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
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
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
        srcUrl: undefined,
        authService: undefined,
        acceptType: undefined, 
      };
    }
  }
};
</script>
