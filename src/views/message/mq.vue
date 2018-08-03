 <template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-row :gutter="20">
      <div>
      <el-col :span="6">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="msgKey" v-model="listQuery.msgKey"> </el-input>
      </el-col>
      </div>
      <el-col :span="6">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="交换机名称" v-model="listQuery.exchangeName"> </el-input>
      </el-col>
      <el-col :span="6">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="发送者应用" v-model="listQuery.sender"> </el-input>
      </el-col>
      <el-col :span="6">
          <el-date-picker
            v-model="listQuery.occurStartTime"
            type="datetime"
            placeholder="选择开始时间"
            align="right"
            :picker-options="pickerOptions1"
            @change="getOccurStartTimeStamp">
          </el-date-picker>   
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="发送者IP" v-model="listQuery.host"> </el-input>
      </el-col>
      <el-col :span="6">
          <el-select v-model="listQuery.consumeStatus" placeholder="消费状态" clearable>
            <el-option
              v-for="item in cOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-col>
      <el-col :span="6">
        <div>
          <el-select v-model="listQuery.produceStatus" placeholder="发送状态" clearable>
            <el-option
              v-for="item in pOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="6">
          <el-date-picker
            v-model="listQuery.occurEndTime"
            type="datetime"
            placeholder="选择结束时间"
            align="right"
            :picker-options="pickerOptions1"
            @change="getOccurEndTimeStamp">
          </el-date-picker>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="内容" v-model="listQuery.data"> </el-input>
      </el-col>
    
      <el-col :span="6">
          <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      </el-col>
    </el-row>
    <!-- <span class="demonstration">msgKey</span> -->
    <!-- <span class="demonstration">交换机名称</span> -->
    <!-- <span class="demonstration">发送者应用</span> -->

    <!-- <span class="demonstration">发送者IP</span> -->
    <!-- <span class="demonstration">发送开始时间</span> -->

    <!-- <span class="demonstration">发送结束时间</span> -->

    <!-- <span class="demonstration">内容</span> -->
  </div>
  
<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" height="460">

    <el-table-column fixed width="350px" align="center" label="msgKey">
        <template slot-scope="scope">
            <span> {{scope.row.msgKey}}</span>
        </template>
    </el-table-column>

    <el-table-column width="150px" align="center" label="发送状态">
        <template slot-scope="scope">
            <span>{{scope.row.produceStatus}}</span>
        </template>
    </el-table-column> 

    <el-table-column width="150px" align="center" label="消费状态">
        <template slot-scope="scope">
            <span>{{scope.row.consumeStatus}}</span>
        </template>
    </el-table-column> 
    
    <el-table-column width="180px" align="center" label="生成时间">
      <template slot-scope="scope">
          <span>{{getLocalTime(scope.row.occurTime)}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" align="center" label="exchange名称">
      <template slot-scope="scope">
          <span>{{scope.row.exchangeName}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" align="center" label="路由key">
      <template slot-scope="scope">
          <span>{{scope.row.routingKey}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" align="center" label="发送者">
      <template slot-scope="scope">
          <span>{{scope.row.sender}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" align="center" label="生产失败次数">
      <template slot-scope="scope">
          <span>{{scope.row.produceFailTimes}}</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" align="center" label="消费失败次数">
      <template slot-scope="scope">
          <span>{{scope.row.consumeFailTimes}}</span>
      </template>
    </el-table-column>
    <el-table-column width="180px" align="center" label="生产成功时间">
      <template slot-scope="scope">
          <span>{{getLocalTime(scope.row.produceSuccessTime)}}</span>
      </template>
    </el-table-column>
    <el-table-column width="180px" align="center" label="消费成功时间">
      <template slot-scope="scope">
          <span>{{getLocalTime(scope.row.consumeSuccessTime)}}</span>
      </template>
    </el-table-column>
    
    <el-table-column width="150px" align="center" label="IP">
        <template slot-scope="scope">
            <span>{{scope.row.host}}</span>
        </template>
    </el-table-column>

    <el-table-column width="100px" align="center" label="消息体">
        <template slot-scope="scope">
            <el-button size="small" type="info"  @click="showScript(scope.row.data)">查看</el-button>
        </template>
    </el-table-column> 

    <el-table-column width="200px" align="center" label="操作">
        <template slot-scope="scope">
            <el-button size="small" type="info"  @click="showDetail(scope.row)">消费详情</el-button>
            <el-button size="small" type="info"  @click="showResendUrl(scope.row)">重发</el-button>
        </template>
    </el-table-column> 
</el-table>

  <!-- 分页 -->
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[5, 10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>

    <!-- 详情模态框 -->
  <el-dialog  title="消息体"  :visible.sync="dialogForScript">
    <el-form>
      <el-form-item > 
        <el-input type="textarea" v-model="showScriptdata" placeholder="message"  :autosize="{ minRows: 5}"></el-input>
      </el-form-item> 
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button  type="success"    @click="formatScript()">格式化</el-button> 
      <el-button  type="success"    @click="dialogForScript = false">关闭</el-button> 
    </div>
  </el-dialog>

  <!-- 重发模态框 -->
  <el-dialog  title="重发"  :visible.sync="dialogForResend">
    <el-form>
      <el-form-item label="请确认重发服务地址是否正确">
        <el-input v-model="resendServiceUrl" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button  type="success"    @click="resendMsg()">确认</el-button> 
      <el-button  type="success"    @click="dialogForResend = false">关闭</el-button> 
    </div>
  </el-dialog>

  <el-dialog :title="dialogDetailName" size="large" :visible.sync="dialogDetailVisible">
      <message-detail :msgKey="msgKey"  @closeMessageDetailDialog="closeMessageDetailDialog" ref="messageDetail"></message-detail>
  </el-dialog>
</div>
</template>

 <script>
import {
  getMessageList,
  getMessage,
  resendMessageByserviceUrl
} from "@/api/message/index";
import { mapGetters } from "vuex";
export default {
  name: "messages",
  components:{
    'message-detail': () => import('./components/messageDetail')
  },
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
      pOptions: [{
        value: 'PRODUCED',
        label: '已发送'
      }, {
        value: 'PRODUCE_FAIL',
        label: '发送失败'
      }],
      cOptions: [{
        value: 'CONSUMED',
        label: '已消费'
      }, {
        value: 'CONSUME_FAIL',
        label: '消费失败'
      }],
      list: null,
      total: null,
      listLoading: true,
      dialogDetailVisible: false,
      dialogDetailName: '消费详情',
      msgKey:'',
      listQuery: {
        page: 1,
        limit: 10,
        msgKey:'',
        exchangeName:'',
        sender:'',
        host:'',
        occurStartTime: new Date() - 24 * 60 * 60 * 1000,
        occurEndTime: new Date().getTime(),
        produceStatus:'',
        consumeStatus:'',
        data:'',
        orderBy:'occurTime',
        orderType:'desc',
      },
      dialogForScript: false,
      showScriptdata: undefined,
      dialogForResend: false,
      resendServiceUrl: undefined, 
      resendMsgKey: undefined,
      tableKey: 1,
      pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    showScript(message) {
      this.dialogForScript = true;
      this.showScriptdata = message;
    },

    showResendUrl(row) {
      this.dialogForResend = true;
      this.resendServiceUrl = row.serviceUrl;
      this.resendMsgKey = row.msgKey;
    },

    resendMsg() {
      resendMessageByserviceUrl(this.resendMsgKey, "producer", this.resendServiceUrl).then(response => {
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
      this.dialogForResend = false;
    },

    formatScript() {
      this.showScriptdata = this.formatJson(this.showScriptdata);
    },

    indexMethod(index) {
      return index * 2;
    },
    //获取列表
    getList() {
      this.listLoading = true;
      getMessageList(this.listQuery).then(response => {
        console.log("走这里了吗");
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
 
    formatJson(json, options) {
      var reg = null,
          formatted = '',
          pad = 0,
          PADDING = '    '; 
      options = options || {};
      options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
      options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
      if (typeof json !== 'string') {
          json = JSON.stringify(json);
      } else {
          json = JSON.parse(json);
          json = JSON.stringify(json);
      }
      reg = /([\{\}])/g;
      json = json.replace(reg, '\r\n$1\r\n');
    
      reg = /([\[\]])/g;
      json = json.replace(reg, '\r\n$1\r\n');
    
      reg = /(\,)/g;
      json = json.replace(reg, '$1\r\n');
    
      reg = /(\r\n\r\n)/g;
      json = json.replace(reg, '\r\n');
    
      reg = /\r\n\,/g;
      json = json.replace(reg, ',');
    
      if (!options.newlineAfterColonIfBeforeBraceOrBracket) {        
          reg = /\:\r\n\{/g;
          json = json.replace(reg, ':{');
          reg = /\:\r\n\[/g;
          json = json.replace(reg, ':[');
      }
      if (options.spaceAfterColon) {         
          reg = /\:/g;
          json = json.replace(reg, ': ');
      }
    
      $.each(json.split('\r\n'), function(index, node) {
          var i = 0,
              indent = 0,
              padding = '';
    
          if (node.match(/\{$/) || node.match(/\[$/)) {
              indent = 1;
          } else if (node.match(/\}/) || node.match(/\]/)) {
              if (pad !== 0) {
                  pad -= 1;
              }
          } else {
              indent = 0;
          }
    
          for (i = 0; i < pad; i++) {
              padding += PADDING;
          }
    
          formatted += padding + node + '\r\n';
          pad += indent;
      });
    
      return formatted;
    },
    getLocalTime(ms) {
      if(ms==null) return null;
      return new Date(parseInt(ms)).toLocaleString('chinese',{hour12:false}).replace(/年|月/g, "-").replace(/日/g, " ");
    },
    showDetail(row) {
      this.dialogDetailVisible = true;
      this.msgKey = row.msgKey;
      if (this.$refs.messageDetail !== undefined) {
        console.log(row.msgKey);
        this.$refs.messageDetail.msgKey = this.msgKey;
        this.$refs.messageDetail.getMessageDetail();
      }
    },    
    closeMessageDetailDialog() {
      this.dialogDetailVisible = false;
    },
    getOccurStartTimeStamp(date){
      this.listQuery.occurStartTime = Date.parse(date);
    },
    getOccurEndTimeStamp(date){
      this.listQuery.occurEndTime = Date.parse(date);
    }
  }
};
</script>
