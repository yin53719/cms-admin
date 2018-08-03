<template>
  <el-tabs v-model="activeName2" type="card" >
    <el-tab-pane label="论坛管理" name="first">
       <forumfile> </forumfile>
    </el-tab-pane>
    <el-tab-pane label="用户管理" name="second">
        <usermanager> </usermanager>
    </el-tab-pane>
     <!-- <el-tab-pane label="审核管理" name="third">
        <audit-content> </audit-content>
    </el-tab-pane> -->
  </el-tabs>
</template>
<script>
import forumfile from './forum_file'
import usermanager from './userManager'
import auditContent from './auditContent'
import waitAudit from './components/waitAudit'


  export default {
    data() {
      return {
        activeName2: 'first'
      };
    },
    components:{
      forumfile,
      usermanager,
      auditContent,
      waitAudit
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>