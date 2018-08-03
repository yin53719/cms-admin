 <template>
<div class="app-container calendar-list-container">
   <audit-content v-if="show=='auditContent'"> </audit-content>
  <wait-audit v-if="show=='waitAudit'"> </wait-audit>
  <audit-news v-if="show=='auditNews'"> </audit-news>
</div>
</template>

<script>
import auditContent from './auditContent'
import waitAudit from './components/waitAudit'
import auditNews from './auditNews'
import newsDetail from './components/news_detail'

export default {
  name: "user",
  components:{
    auditContent,
    waitAudit,
    auditNews,
    newsDetail
  },
  data() {
    return {
      show:'auditContent',
      businessType:'',
      level:'',
      tieziId:'',
      blockId:''
    };
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
