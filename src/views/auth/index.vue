 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="服务" v-model="listQuery.serviceId"> </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="路径" v-model="listQuery.path"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

    <el-table-column align="center" label="id" width="65"> 
        <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
        </template>
    </el-table-column>

    <el-table-column width="200px" align="center" label="路径">
        <template slot-scope="scope">
            <span>{{scope.row.path}}</span>
        </template>
    </el-table-column>


    <el-table-column width="200px" align="center" label="服务名称">
        <template slot-scope="scope">
            <span> {{scope.row.serviceId}}</span>
        </template>
    </el-table-column>


    <el-table-column width="200px" align="center" label="url">
        <template slot-scope="scope">
            <span>{{scope.row.url}}</span>
        </template>
    </el-table-column>


    <el-table-column width="200px" align="center" label="除去前缀">
        <template slot-scope="scope">
        <span>{{scope.row.stripPrefix}}</span>
        </template>
    </el-table-column>


    <el-table-column width="200px" align="center" label="是否重试">
        <template slot-scope="scope">
            <span>{{scope.row.retryable}}</span>
        </template>
    </el-table-column> 

    <el-table-column align="center" label="操作" width="150">
      
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
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" placeholder="请输入路径"></el-input>
      </el-form-item>
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="form.serviceId" placeholder="请输入服务名称"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="form.url" placeholder="请输入URL"></el-input>
      </el-form-item>
       
      <el-form-item label="除去前缀">
        <el-radio-group v-model="form.stripPrefix"  border=true size="medium">
          <el-radio  label="true">是</el-radio>
          <el-radio  label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item label="是否重试">
        <el-radio-group v-model="form.retryable"  border=true size="medium">
          <el-radio  label="true">是</el-radio>
          <el-radio  label="false">否</el-radio>
        </el-radio-group>
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
import {page, getGateList, delObj,addObj,putObj,getObj } from "@/api/gate/index";
import { mapGetters } from "vuex";
export default {
  name: "gatelist",
  data() {
    return {
      form: {
        path: undefined,
        serviceId: undefined,
        url: undefined,
        stripPrefix: true,
        retryable: true
      },
      rules: {
        path: [
          {
            required: true,
            message: "请输入路径",
            trigger: "blur"
          },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur"
          }
        ],
        serviceId: [
          {
            required: true,
            message: "请输入serviceId",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        url: [
          {
            min: 3,
            max: 2000,
            message: "长度在 3 到 2000 个字符",
            trigger: "blur"
          }
        ],
        stripPrefix: [
          {
            required: true,
            message: "请输入前缀",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        retryable: [
          {
            required: true,
            message: "是否重试",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serviceId: undefined
      },
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
    this.groupTypeManager_btn_add = this.elements["route:add"];
  },
  computed: {
    //获取state里面的listName对象
    ...mapGetters(["elements"])
  },
  methods: {
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
              title: '成功',
              message: '创建成功',
              type: 'success',
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
        path: undefined,
        serviceId: undefined,
        url: undefined,
        stripPrefix: "true",
        retryable: "true"
      };
    }
  }
};
</script>
