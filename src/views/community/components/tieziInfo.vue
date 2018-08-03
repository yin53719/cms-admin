 <template>
<div class="app-container calendar-list-container">
    <tiezi-info  v-if="show=='tieziInfo'"></tiezi-info>
    <huifu  v-if="show=='huifu'"></huifu>
</div>
</template>

<script>
import huifu from './huifu'
import tieziInfo from './tieziInfoin'

export default {
  name: "user",
  components:{
    huifu,
    tieziInfo
  },
  data() {
    return {
      show:'tieziInfo',
      tieziId:this.$parent.tieziId,
      blockId:this.$parent.blockId,
      userId:''
    };
  },
  created() {
    
  },

  mounted(){
    // var ue = window.UE.getEditor('editor');
  },
  methods: {

  }
};
</script>
<style>
.newsInfo{
  height: 20px;
}
 .newsInfo img{
   width: 18px;
   display: inline-block;
   vertical-align: middle;
 }

 
</style>
