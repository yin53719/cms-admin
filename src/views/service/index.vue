<template>
  <div class="app-container calendar-list-container">
  <span class="demonstration">自动更新</span>
  <el-select v-model="refreshVal" placeholder="请选择" @change="refresh(refreshVal)">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button class="filter-item" type="primary" v-waves icon="search" @click="getServiceInfo">刷新</el-button>
  <el-table :key='tableKey' :data="list"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"  height="460">
<el-table-column fixed width="270px" align="center" label="应用名"><template slot-scope="scope">
  <span>
    {{scope.row.appName}}</span>
</template>

</el-table-column>
<el-table-column width="370px" align="center" label="实例"><template slot-scope="scope">
  <span>
    {{scope.row.instanceId}}</span>
</template>
</el-table-column> 

      <el-table-column width="150px" align="center" label="Host"><template slot-scope="scope">
  <span>
    {{scope.row.hostName}}</span>
</template>
</el-table-column>  
<el-table-column width="100px" align="center" label="状态"><template slot-scope="scope">
  <span>
    {{scope.row.status}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="最后更新时间"><template slot-scope="scope">
  <span>
    {{getLocalTime(scope.row.lastUpdatedTimestamp)}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="lastDirtyTimestamp"><template slot-scope="scope">
  <span>
    {{getLocalTime(scope.row.lastDirtyTimestamp)}}</span>
</template>

</el-table-column>
<el-table-column width="120px" align="center" label="API清单"><template slot-scope="scope">
    <a :href="scope.row.homePageUrl + 'swagger-ui.html'" target="_blank"><u><i>swagger-ui</i></u></a>
</template>

</el-table-column>
<el-table-column width="160px" align="center" label="连接池监控"><template slot-scope="scope">
    <a :href="scope.row.homePageUrl + 'druid'" target="_blank"><u><i>druid</i></u></a>
</template>
      </el-table-column>

  <el-table-column width="100px" align="center" label="操作">
      <template slot-scope="scope">
          <el-button size="small" type="info"  @click="deleteInstance(scope.row)">注销</el-button>
      </template>
  </el-table-column>       
         </el-table>
    </div>
</template>

<script>
import { getService,delInstance} from "@/api/service/index";
export default {
  name: "serviceInfo",
  data() {
    return {
      list: null,
      listLoading: true,
      tableKey: 0,
      options: [{
          value: 5*1000,
          label: '5 seconds'
        }, {
          value: 30*1000,
          label: '30 seconds'
        }, {
          value: 5*60*1000,
          label: '5 minutues'
        }, {
          value: 0,
          label: 'never'
        }],
      refreshVal: 0,
      timer: 0
    };
  },
  created() {
    this.getServiceInfo();
  },
  methods: {
    refresh(intervalTime) {
      clearInterval(this.timer);
      if(intervalTime != 0){
        var self = this;
        console.log("start interval");
        this.timer = setInterval(function(){ 
          self.getServiceInfo();
        },intervalTime);
      } else {
        console.log("stop interval");
      }
    },
    getServiceInfo() {
      this.listLoading = true;
      getService().then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    deleteInstance(row){
      this.$confirm("是否真要注销(注销后状态更新非实时，请稍等片刻再查询)?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delInstance(row.appName, row.instanceId).then(() => {
          this.$notify({
            title: "成功",
            message: "注销成功",
            type: "success",
            duration: 2000
          });
          getServiceInfo();
        });
      });
    },
    getLocalTime(ms) {
      if (ms == null) return null;
      return new Date(parseInt(ms))
        .toLocaleString("chinese", { hour12: false })
        .replace(/年|月/g, "-")
        .replace(/日/g, " ");
    }
  }
};
</script>
