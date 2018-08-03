<template>
    <div class="app-container calendar-list-container">
      <el-row style="text-align:right;">
        <el-button  type="primary" v-waves icon="search" @click="handleBack">返回</el-button>
      </el-row>
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="活动信息" name="first">
              <activitydetail></activitydetail>
          </el-tab-pane>
          <el-tab-pane label="报名情况" name="second">
            <activitySign></activitySign>
          </el-tab-pane>
          <el-tab-pane label="体验笔记" name="third">体验笔记</el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import activitydetail from './activitydetail'
import activitySign from './activitySign'
export default {
  components:{
    activitydetail,
    activitySign
  },
  data() {
    return {
      activeName2: 'first',
      activityIdForDetail:'',
    };
  },
  created() {
      this.activeName2 = this.$parent.activeName2;
      this.activityIdForDetail = this.$parent.activityIdForDetail;//把数据从父组件获取，传给当前组件，供当前组件的子组件使用
     
  },
  methods: {
    handleBack(){
        this.$parent.show = 'activity';
    },
    handleClick(tab, event) {
      // console.log(this.activityIdForDetail)
      console.log(tab, event);
    }
  }
};
</script>