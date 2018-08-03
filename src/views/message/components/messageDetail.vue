<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
<el-table-column width="200px" align="center" label="队列名"><template slot-scope="scope">
  <span>
    {{scope.row.queueName}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="应用名"><template slot-scope="scope">
  <span>
    {{scope.row.appName}}</span>
</template>
</el-table-column> 

      <el-table-column width="200px" align="center" label="消费者ID"><template slot-scope="scope">
  <span>
    {{scope.row.consumerId}}</span>
</template>
</el-table-column>  
      <el-table-column align="center" label="IP" width="165">
        <template slot-scope="scope">
          <span>{{scope.row.host}}</span>
</template>
</el-table-column>
<el-table-column width="200px" align="center" label="消息Key"><template slot-scope="scope">
  <span>
    {{scope.row.msgKey}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="msg"><template slot-scope="scope">
  <span>
    {{scope.row.msg}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="消息体"><template slot-scope="scope">
  <span>
    {{scope.row.data}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="是否成功"><template slot-scope="scope">
  <span>
    {{scope.row.success}}</span>
</template>

</el-table-column>
<el-table-column width="200px" align="center" label="发生时间"><template slot-scope="scope">
  <span>
    {{getLocalTime(scope.row.occurTime)}}</span>
</template>
      </el-table-column>

<el-table-column width="200px" align="center" label="操作">
        <template slot-scope="scope">
            <el-button size="small" type="info"  @click="showResendUrl(scope.row)">重消费</el-button>
        </template>
    </el-table-column> 

         </el-table>
        <!-- <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div> -->

  <!-- 重发模态框 -->
  <el-dialog  title="重消费"  :visible.sync="dialogForReconsume">
    <el-form>
      <el-form-item label="请确认重发服务地址是否正确">
        <el-input v-model="reconsumeServiceUrl" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button  type="success"    @click="reconsume()">确认</el-button> 
      <el-button  type="success"    @click="dialogForReconsume = false">关闭</el-button> 
    </div>
  </el-dialog>

    </div>
</template>

<script>
import { getConsumedInfoList,resendMessageByserviceUrl } from "@/api/message/index";
export default {
  name: "messageDetail",
  props: {
    msgKey: {
      default: "1"
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      tableKey: 0,
      dialogForReconsume: false,
      reconsumeServiceUrl: undefined, 
      reconsumeMsgKey: undefined
    };
  },
  created() {
    this.getMessageDetail();
  },
  methods: {
    getMessageDetail() {
      this.listLoading = true;
      console.log("getMessageDetail msgkey:" + this.msgKey);
      getConsumedInfoList(this.msgKey).then(response => {
        this.list = response.data;
        this.listLoading = false;
      });
    },

    showResendUrl(row) {
      this.dialogForReconsume = true;
      this.reconsumeServiceUrl = row.serviceUrl;
      this.reconsumeMsgKey = row.msgKey;
    },

    reconsume() {
      resendMessageByserviceUrl(this.reconsumeMsgKey, "consumer", this.reconsumeServiceUrl).then(response => {
              console.log(response);
              if(response.success){
                this.$notify({
                  title: '成功',
                  message: '重发成功',
                  type: 'success',
                  duration: 2000
                });
              }else{
                this.$notify({
                  title: '失败',
                  message: '重发失败',
                  type: 'error',
                  duration: 2000
                });
              }
            });
      this.dialogForReconsume = false;
    },

    getLocalTime(ms) {
      if(ms==null) return null;
      return new Date(parseInt(ms)).toLocaleString('chinese',{hour12:false}).replace(/年|月/g, "-").replace(/日/g, " ");
    },
  }
};
</script>
