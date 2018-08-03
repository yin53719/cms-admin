<template> 
  
<div>
   <el-row> 
       <sticky :className="'sub-navbar '" >  
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button type="warning"  @click="jumpList()">返回</el-button>
        </sticky> 
    </el-row>
     <el-form ref="form" :model="form">   
      <el-row class="row-bg"> 
      <el-col :span="1"><div class="csss">1</div></el-col>
      <el-col :span="2" style=" line-height: 40px;">创建规则组</el-col>
      <hr style="height:1px;border:none;border-top:1px dashed #0066CC;  top: 50%;" />   
    </el-row>
    <el-row>
    
      <el-col :span="24" style=" margin: 0px 120px;">
          <el-form  label-width="100px">
              <el-form-item label="规则组名称:">
                <el-input v-model="form.name" style="width: 30%;"></el-input>
              </el-form-item>
              <el-form-item label="规则描述:">
                <el-input type="textarea" v-model="form.descr"  style="width: 30%;" ></el-input>
              </el-form-item>
               
          </el-form>
      </el-col>
    </el-row>
    <el-row class="row-bg"> 
      <el-col :span="1"><div class="csss">2</div></el-col>
      <el-col :span="2" style=" line-height: 40px;">关联资源</el-col>
      <hr style="height:1px;border:none;border-top:1px dashed #0066CC;  top: 50%;" />   
    </el-row>
    <el-row>
      <el-col :span="24" style=" margin: 0px 120px;">
          <el-form  label-width="100px">
               
              <el-form-item label="资源范围:" style="width: 800px;"> 
                <el-select v-model="form.ipAppList"  multiple  filterable  allow-create  default-first-option placeholder="请选择服务名或填写ip" size="medium" style="width:360px">
                  <el-option v-for="item in serviceList"  :key="item.id" :label="item.appName"   :value="item.appName"></el-option>  
                </el-select>
              </el-form-item>
               
          </el-form>
      </el-col>
    </el-row>
     
    <el-row class="row-bg"> 
      <el-col :span="1"><div class="csss">3</div></el-col>
      <el-col :span="2" style=" line-height: 40px;">设置报警规则</el-col>
      <hr style="height:1px;border:none;border-top:1px dashed #0066CC;  top: 50%;" />   
    </el-row>

    <el-row>
      <el-col :span="24" style=" margin: 0px 120px;">
          <el-form  v-for="item in form.alarmRules" :key="item.id" label-width="100px"  class="demo-form-inline" >  
          <el-row id="item.name">
             <el-form-item label="规则名称:">
                <el-input v-model="item.ruleName" style="width: 30%;"></el-input> 
              </el-form-item> 
          <el-col :span="6"> 
            <el-form-item label="关键字"> 
              <el-input v-model="item.ruleKeyword" placeholder="关键字"></el-input> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="持续时间"> 
              <el-input v-model="item.ruleTime" placeholder="持续时间分钟"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="持续次数"> 
              <el-input v-model="item.ruleCount" placeholder="持续次数"></el-input>
            </el-form-item>
          </el-col>
          </el-row> 
             <hr style="height:1px;border:none;border-top:1px dashed #0066CC;  top: 50%;" />    
           
          </el-form> 
           <el-button size="small" type="success" icon="plus" @click="addProd">+添加规则</el-button>
      </el-col>
     
     </el-row>

  

<el-row class="row-bg"> 
    <el-col :span="1"><div class="csss">4</div></el-col>
    <el-col :span="2" style=" line-height: 40px;">通知方式</el-col>
    <hr style="height:1px;border:none;border-top:1px dashed #0066CC;  top: 50%;" />   
  </el-row>

  <el-row>
    <el-col :span="24" style=" margin: 0px 120px;">
         <el-form  label-width="100px">
            <el-form-item label="通知对象:">
                <el-tag type="danger" v-for="item in userGroupNames" :key="item" style="margin:10px">{{ item }}</el-tag> 
              <el-button type="primary"   @click="selectUserGroupShow()">选择用户组</el-button>
            </el-form-item>
            <el-form-item label="通知对象:" style="display: none">
                <el-input :v-model="form.userGroupIds=userGroupIds"></el-input>
            </el-form-item>
            <el-form-item label="警告方式:">  
                 <el-radio-group v-model="form.alarmType"  border=true size="medium">
                      <!-- <el-radio  label="phone" >手机+邮件</el-radio> -->
                      <el-radio  label="mail"  >邮件</el-radio>
                  </el-radio-group>
            </el-form-item>
            <el-form-item label="邮件主题：">
              <el-input v-model="form.mailTitle" style="width: 30%;"></el-input>
            </el-form-item> 
            <el-form-item label="邮件备注：">
              <el-input type="textarea"  :autosize="{ minRows: 5, maxRows: 8}" v-model="form.mailContent" style="width: 30%;"></el-input>
            </el-form-item> 
         </el-form>
    </el-col>
  </el-row>
   </el-form>
  <el-row>
    <el-col :span="24" style=" margin: 0px 120px;">
     <el-button type="primary" @click="submitForm()">立即创建</el-button>
     <el-button @click="resetForm()">重置</el-button>
    </el-col>
  </el-row>



      <!-- 模态框 -->
  <el-dialog  title="报警用户组选择"   :visible.sync="dialogFormVisible">
    <!-- <el-checkbox>是否包括子菜单用户</el-checkbox> -->
       <el-tree class="filter-tree" check-strictly :node-key="getTreeNodeKey" :data="treeData" show-checkbox node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all>
      </el-tree> 
      
    <div slot="footer" class="dialog-footer">
      <el-button  type="primary" @click="dialogFormVisible = false">取消</el-button>
      <el-button  type="primary" @click="chooseUserGroup()">确 定</el-button>
    </div>
  </el-dialog>

</div>
  
</template>

<script>
import { fetchTree } from "@/api/admin/group/index";
import { getService, delInstance } from "@/api/service/index";
import { addAll, detail } from "@/api/alarm/alarmGroup";

import { pagelist, putObj } from "@/api/alarm/rule_group_list";
import { groupUserlist } from "@/api/alarm/alarmUserGroup";

export default {
  name: "add",
  data() {
    return {
      form: {
        id: undefined,
        name: undefined,
        descr: undefined,
        ipAppList: [],
        userGroupIds: undefined,
        alarmType: "mail",
        mailTitle: undefined,
        mailContent: undefined,
        alarmRules: []
      },

      ruleForm: {
        name: "",
        keyword: "",
        time: "",
        count: ""
      },

      treeData: [],
      rules: {},
      textMap: {
        update: "编辑",
        create: "创建"
      },
      listQuery: {
        groupType: 3
      },
      loading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      tableHeight: 0,
      list: null,
      total: null,
      listLoading: false,
      manufacturerList: null,
      equipmentList: null,
      equipment_type: null,
      defaultProps: {
        children: "children",
        label: "label"
      },
      userGroupNames: [],
      userGroupIds: [],

      serviceList: null
    };
  },
  created() {
    this.getServiceInfo();
    this.alarmDetail();
  },

  filters: {},
  methods: {
    alarmDetail() {
      this.form.id = this.$route.query.id;
      if (this.form.id != null) {
        detail(this.form.id).then(response => {
          this.list = response;
          this.form.name = response.ruleGroupName;
          this.form.descr = response.descr;
          this.form.alarmType = response.alarmType;
          this.form.mailTitle = response.mailTitle;
          this.form.mailContent = response.mailContent;
         
         var APPlist= response.ruleScopes;
          
          var x;
          for (x in APPlist) {
            this.form.ipAppList.push(APPlist[x].ipApp); 
          }
         
           
          var x;
          for (x in response.ugalist) {
            this.userGroupNames.push(response.ugalist[x].name);
            this.userGroupIds.push(response.ugalist[x].id);
          }

          
          var x;
          for (x in response.rules) {
            this.form.alarmRules.push({
              ruleName: response.rules[x].name,
              ruleKeyword: response.rules[x].keyword,
              ruleTime: response.rules[x].time,
              ruleCount: response.rules[x].count
            });
          }
          this.form.alarmType = response.alarmType;
          this.form.mailTitle = response.mailTitle;
          this.form.mailContent = response.mailContent;

          this.listLoading = false;
        });
      }
    },

    //提交表单
    submitForm() {
      console.log(this.form);
      addAll(this.form).then(data => {
        console.log(data);
        this.jumpList();
      });
    },

    //获取服务列表
    getServiceInfo() {
      this.listLoading = true;
      getService().then(response => {
        this.serviceList = response.data;
        this.listLoading = false;
      });
    },

    //过去报警组列表
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
      });
    },
    selectUserGroupShow() {
      this.dialogFormVisible = true;
      this.getList();
    },
    getNodeData(data) {},
    getTreeNodeKey(node) {
      return node.id;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    chooseUserGroup() {
      const nodes = this.$refs.menuTree.getCheckedNodes();
      const ids = [];
      const names = [];
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
        names.push(nodes[i].name);
      }
      this.userGroupNames = names;
      this.userGroupIds = ids;
      this.dialogFormVisible = false;
    },
    addProd() {
      this.form.alarmRules.push({
        ruleName: undefined,
        ruleKeyword: undefined,
        ruleTime: undefined,
        ruleCount: undefined
      });
    },
    deleteProd: function(prod) {
      const index = this.form.alarmRules.indexOf(prod);
      this.alarmRules.splice(index, 1);
    },
    indexMethod(index) {
      return index * 2;
    },
    jumpList() {
      this.jump({ path: "/alarm/rulelist" });
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
    }
  }
};
</script>

 

           
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  margin: 0px 60px;
  background-color: #f9fafc;
}

.csss {
  background: #0099cc;
  /* position: absolute; */
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  color: #fff;
  border-radius: 20px;
  text-align: center;
  line-height: 40px;
}
</style>

