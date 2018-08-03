 <template>
<div class="app-container calendar-list-container">
   <news v-if="show=='news'"> </news>
  <news-add v-if="show=='newsadd'"> </news-add>
  <news-edit v-if="show=='newsedit'"> </news-edit>
  <news-detail v-if="show=='newsdetail'"> </news-detail>
</div>
</template>

<script>
import news from './components/news'
import newsAdd from './components/news_add'
import newsEdit from './components/news_edit'
import newsDetail from './components/news_detail'

export default {
  name: "user",
  components:{
    news,
    newsAdd,
    newsEdit,
    newsDetail
  },
  data() {
    return {
      show:'news',
      newsid:''
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
