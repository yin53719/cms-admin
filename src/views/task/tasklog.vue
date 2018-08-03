 <template>
<div class="app-container calendar-list-container">
   <div class="filter-container"> 
  <el-form :inline="true" :model="listQuery" class="demo-form-inline">
  <el-form-item label="任务名:">
    <el-input v-model="listQuery.taskName" placeholder="请输入任务名"></el-input>
  </el-form-item>
  <el-form-item label="选择日期时间区间:">
       <el-date-picker v-model="listQuery.startDate" @change="getStartTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
       <el-date-picker v-model="listQuery.endDate"  @change="getEndTime"  type="datetime" placeholder="选择日期时间"> </el-date-picker>
  </el-form-item>
  <el-form-item label="业务返回结果:">
    <el-input v-model="listQuery.responseInfo" placeholder="请输入业务返回结果"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleFilter" icon="search">查询</el-button>
  </el-form-item>
</el-form>

  
  </div>  
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

    <!-- <el-table-column  type="index" :index="indexMethod">
    </el-table-column> -->
  <el-table-column width="130px" align="center" label="cron表达式">
        <template slot-scope="scope">
            <span> {{scope.row.id}}</span>
        </template>
    </el-table-column>

    <el-table-column align="center" label="任务名称"  > 
        <template slot-scope="scope">
            <span>{{scope.row.SCHEDLED_NAME}}</span>
        </template>
    </el-table-column>
  <el-table-column   align="center" label="计划组别">
        <template slot-scope="scope">
            <span>{{scope.row.JOB_GROUP}}</span>
        </template>
    </el-table-column>  


    <el-table-column   align="center" label="url">
        <template slot-scope="scope">
            <span> {{scope.row.URL_NAME}}</span>
        </template>
    </el-table-column>

        <el-table-column  align="center" label="日志时间">
        <template slot-scope="scope">
            <span> {{getLocalTime(scope.row.CREATE_DATE)}}</span>
        </template>
    </el-table-column>


    <el-table-column   align="center" label="执行时长">
        <template slot-scope="scope">
            <span>{{scope.row.WORK_TIME}}</span>
        </template>
    </el-table-column> 

    <el-table-column   align="center" label="业务返回结果">
        <template slot-scope="scope">
            <span>{{scope.row.RESPONSE_INFO}}</span>
        </template>
    </el-table-column> 

 <el-table-column align="center" label="调用执行机器"> 
    <template slot-scope="scope">
            <span>{{scope.row.PC_IP}}</span>
        </template>
    </el-table-column> 

</el-table> 
  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pages" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pages"> </el-pagination>
  </div>
</div>
</template>

 <script>
import {page } from "@/api/task/tasklog";
import { mapGetters } from "vuex";
export default {
  name: "task",
  data() {
    return {
      form: { 
        JOB_GROUP: undefined,  
        SCHEDLED_NAME: undefined,
        URL_NAME: undefined, 
        CREATE_DATE: undefined, 
        WORK_TIME: undefined,  
        PC_IP: undefined, 
        RESPONSE_INFO: undefined, 
        RETURN_FLAG: undefined,
        id: undefined, 
        CREATE_BY: undefined, 
      },   
      list: null,
      pages:null,
      listLoading: true,
      listQuery: {
        taskName: undefined, 
        page: 1,
        pageSize: 10, 
        startDate:"",
        endDate:"",
        responseInfo:"",
        startTime:"",
        endTime:""
        // orderBy:'WORK_TIME',
        // orderType:'desc',
      },
      dialogFormVisible: false,
      dialogStatus: "",
      groupTypeManager_btn_edit: false,
      groupTypeManager_btn_del: false,
      groupTypeManager_btn_add: false, 
      tableKey: 1
    };
  },
  created() {
    this.getList();
    this.groupTypeManager_btn_edit = this.elements["tasklog:btn_edit"];
    this.groupTypeManager_btn_del = this.elements["tasklog:btn_del"];
    this.groupTypeManager_btn_add = this.elements["tasklog:btn_add"];
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
        this.list=response.page.list;
        this.pages = response.page.itemsTotal;
        this.listLoading = false;
      });
    },
    indexMethod(index) {
      return index * 2;
    },
    handleFilter() {
      this.getList();
    },  
      getLocalTime(ms) {
      if(ms==null) return null;
      return new Date(parseInt(ms)).toLocaleString('chinese',{hour12:false}).replace(/年|月/g, "-").replace(/日/g, " ");
    },
 
      handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
     handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
     getStartTime(date){
          this.listQuery.startTime =new Date(date).getTime()
          console.log(this.listQuery.startTime);
        },
      getEndTime(date){
      this.listQuery.endTime =new Date(date).getTime()
      console.log(this.listQuery.endTime);
    }
  }
};
</script>
