 <template>
<div class="app-container calendar-list-container">
   <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="任务名" v-model="listQuery.jobName"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item" v-if="task_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>  
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

    <el-table-column  type="index" :index="indexMethod">
    </el-table-column>

    <el-table-column align="center" label="任务组" width="200px"> 
        <template slot-scope="scope">
            <span>{{scope.row.jobGroup}}</span>
        </template>
    </el-table-column>
  <el-table-column width="200px" align="center" label="任务名">
        <template slot-scope="scope">
            <span>{{scope.row.jobName}}</span>
        </template>
    </el-table-column>  


    <el-table-column width="130px" align="center" label="cron表达式">
        <template slot-scope="scope">
            <span> {{scope.row.cronExpression}}</span>
        </template>
    </el-table-column>

        <el-table-column width="130px" align="center" label="状态">
        <template slot-scope="scope">
            <span> {{scope.row.status}}</span>
        </template>
    </el-table-column>


    <el-table-column width="200px" align="center" label="url">
        <template slot-scope="scope">
            <span>{{scope.row.url}}</span>
        </template>
    </el-table-column> 

    <el-table-column width="200px" align="center" label="描述">
        <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
        </template>
    </el-table-column> 

 <el-table-column align="center" label="操作" width="250">
      
    <template slot-scope="scope">
        <el-button v-if="groupTypeManager_btn_edit" size="small" type="info" @click="handleStop(scope.row)">
          暂停
        </el-button>
    <el-button v-if="groupTypeManager_btn_del" size="small" type="success" @click="handleRest(scope.row)">恢复
    </el-button>
    <el-button v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
    </el-button>
    </template>
    </el-table-column> 

</el-table>

  

  <!-- 模态框 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="任务组" prop="path">
        <el-input v-model="form.jobGroup" placeholder="任务组"></el-input>
      </el-form-item>
      <el-form-item label="任务名" prop="name">
        <el-input v-model="form.jobName" placeholder="请输入任务名"></el-input>
      </el-form-item> 
      <el-form-item label="任务类型" prop="executeType">  
            <el-input v-model="form.executeType"  value="executeUrl" :disabled="true"></el-input>
        </el-form-item> 
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="form.cronExpression" placeholder="请输入cron表达式"></el-input>
        <span class="cron-tips"><a  href="http://cron.qqe2.com/" target="_blank"> 在线表达式生成器：http://cron.qqe2.com 如：0 0/1 * * * ?</a> </span>
      </el-form-item>

      <el-form-item label="执行的url" prop="url">
        <el-input v-model="form.url" placeholder="请输入执行的url"></el-input>
      </el-form-item>
       
       <el-form-item label="备注" prop="description">
        <el-input v-model="form.description" type="textarea"  placeholder="备注"></el-input>
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
import {getTasklist,addObj,delObj,putStop ,resume } from "@/api/task/index";
import { mapGetters } from "vuex";
export default {
  name: "task",
  data() {
    return {
      form: {
        jobGroup: undefined,
        jobName: undefined,
        executeType: "executeUrl",
        cronExpression: undefined,
        url: undefined,
        beanName:undefined,
        description:undefined, 
      },  
      rules: {
        jobName: [
          {
            required: true,
            message: "请输入jobName",
            trigger: "blur"
          }
        ],
        executeType: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
          ],
        },
       
      list: null,
      listLoading: true,
      listQuery: {
        jobName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      task_btn_add: true,
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
    this.task_btn_add = this.elements["tasklist:btn_add"];
  },
  computed: {
    //获取state里面的listName对象
    ...mapGetters(["elements"])
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true;
      getTasklist(this.listQuery).then(response => {
        var row={};
        row=response.page
        this.list=row; 
        // this.list=response.page;
        this.listLoading = false;
      });
    },
    indexMethod(index) {
      return index * 2;
    },
    handleFilter() {
      this.getList();
    }, 
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.form = {
         jobGroup: undefined,
        jobName: undefined,
        executeType: "executeUrl",
        cronExpression: undefined,
        url: undefined,
        description:undefined
      };
    },
    handleStop(row){
      this.$confirm("此操作将暂停服务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        putStop(row.jobName,row.jobGroup).then(() => {
          this.$notify({
            title: "成功",
            message: "暂停成功",
            type: "success",
            duration: 2000
          }); 
          this.getList();
        });
      });
    },
    handleRest(row){
       this.$confirm("此操作将回复服务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        resume(row.jobName,row.jobGroup).then(() => {
          this.$notify({
            title: "成功",
            message: "重启成功",
            type: "success",
            duration: 2000
          }); 
          this.getList();
        });
      });
    }, 
      // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(row.jobName,row.jobGroup).then(() => {
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
          // alert(1);
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
  }
};
</script>
<style lang="postcss">
.cron-tips{
  color: red
}
</style>
