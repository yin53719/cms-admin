 <template>
<div class="app-container calendar-list-container">
   <forum v-if="show=='forum'"> </forum>
  <article-add v-if="show=='articleadd'"> </article-add>
  <tiezi-info  v-if="show=='tieziInfo'"></tiezi-info>
  <news-detail v-if="show=='newsdetail'"> </news-detail>
</div>
</template>

<script>

import forum from './components/forum'
import articleAdd from './components/article_add'
import tieziInfo from './components/tieziInfo'
import newsEdit from './components/news_edit'
import newsDetail from './components/news_detail'

export default {
  name: "user",
  components:{
    forum,
    articleAdd,
    tieziInfo,
    newsDetail
  },
  data() {
    return {
      show:'forum',
      tieziId:'',
      blockId:'',
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
