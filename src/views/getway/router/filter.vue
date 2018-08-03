 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
 
  <!-- <el-table-column align="center" label="序号" width="65">
      <template scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column> -->

    <el-table-column  type="index" :index="indexMethod">
    </el-table-column>
    
  

    <el-table-column  align="center" label="过滤名称">
        <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
        </template>
    </el-table-column>


    <el-table-column  align="center" label="过滤类型">
        <template slot-scope="scope">
            <span> {{scope.row.type}}</span>
        </template>
    </el-table-column> 

    <!-- <el-table-column width="100px" align="center" label="执行顺序">
        <template scope="scope">
            <span>{{scope.row.orders}}</span>
        </template>
    </el-table-column> -->


    <!-- <el-table-column width="150px" align="center" label="执行环境">
        <template scope="scope">
        <span>{{scope.row.execSetting}}</span>
        </template>
    </el-table-column> -->


    <!-- <el-table-column width="150px" align="center" label="金丝雀环境">
        <template scope="scope">
            <span>{{scope.row.canarySetting}}</span>
        </template>
    </el-table-column>  -->

    
    <!-- <el-table-column width="150px" align="center" label="版次">
        <template scope="scope">
            <span>{{scope.row.version}}</span>
        </template>
    </el-table-column>  -->
      <el-table-column align="center" label="服务名称">
      <template slot-scope="scope">
          <span>{{scope.row.serviceName}}</span>
      </template>
    </el-table-column>

    
    <el-table-column  align="center" label="过滤脚本">
        <template slot-scope="scope">
            <el-button size="small" type="info"  @click="showScript(scope.row)">详情</el-button>
        </template>
    </el-table-column> 



    <el-table-column align="center" label="操作" >
      
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

        
        <el-form-item label="过滤名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入过滤名称"></el-input>
        </el-form-item>
        
        <el-form-item label="过滤类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择任务类型">
            <el-option label="pre" value="pre"></el-option>
            <el-option label="post" value="post"></el-option>
          </el-select>
        </el-form-item> 

        <!-- <el-form-item label="执行顺序" prop="url">
          <el-input v-model="form.orders" placeholder="请输入执行顺序"></el-input>
        </el-form-item>  -->

      <!-- <el-form-item label="执行环境">
        <el-radio-group v-model="form.execSetting"  border=true size="medium">
          <el-radio  label="true">是</el-radio>
          <el-radio  label="false">否</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item label="金丝雀环境">
        <el-radio-group v-model="form.canarySetting" size="medium">
          <el-radio  label="true">是</el-radio>
          <el-radio  label="false">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
        <!-- <el-form-item label="版次" prop="description">
          <el-input v-model="form.version" autosize placeholder="请输入版次"></el-input>
        </el-form-item> -->
         <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入服务名称"></el-input>
        </el-form-item> 
      <el-form-item label="过滤脚本" prop="description"> 
        <el-input type="textarea" v-model="form.script" placeholder="请输入过滤脚本"  :autosize="{ minRows: 5, maxRows: 8}"></el-input>
      </el-form-item> 
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>




    <!-- 详情模态框 -->
  <el-dialog  title="过滤脚本详情"  :visible.sync="dialogForScript">
    <el-form>
      <el-form-item > 
        <el-input type="textarea" v-model="showScriptdata" placeholder="请输入过滤脚本"  :autosize="{ minRows: 5}"></el-input>
      </el-form-item> 
  </el-form>
 
    <div slot="footer" class="dialog-footer">
      <el-button  type="success"    @click="dialogForScript = false">关闭</el-button> 
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
} from "@/api/gate/filter";
import { mapGetters } from "vuex";
export default {
  name: "filter",
  data() {
    return {
      form: {
        name: undefined,
        serviceName: undefined,
        type: undefined,
        orders: undefined,
        execSetting: false,
        canarySetting: false,
        version: undefined,
        script: undefined
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
        name: undefined,
        type: undefined,
        serviceName: undefined,
        script: undefined,
        path: undefined, 
      };
    }
  }
};
</script>
