 <template>
  <div >
      <el-row>
          <el-col :span="20"><h2>帖子详情</h2></el-col>
          <el-col :span="4" style="text-align:right;"><el-button @click="$parent.$parent.show='forum'">返回</el-button></el-col>
           
      </el-row>
         <el-pagination @size-change="handleSizeChange"  background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        <div style="position:relative;float:left; width:100%">
          <div style="width:200px;height:100%;background:#f1f1f1; position:absolute; top:0; left:0; text-align:center;">
            <ul>
              <li>
                <p style="padding-top:20px">{{ formFieldValues.Newname }}</p>
              </li>
              <li>
                <p style="padding:20px"><img :src='formFieldValues.photoUrl' style="width:100px;height:100px"  /></p>
              </li>
              <li>发帖数：{{ formFieldValues.articleNumber }}</li>
              <li>回帖数：{{ formFieldValues.commentNumber }}</li>
              <!-- <li>车型：RX5</li> -->
            </ul>

          </div>
          <div style="width:100%; min-height:300px;padding-left:210px ">
            <el-row style="padding:10px 0;">
              <el-col :span="20">发布于: {{ formFieldValues.createDate }}</el-col>
              <el-col :span="4"> <span style="float:right">楼主</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">{{ formFieldValues.title }} </el-col>
                <el-col :span="12" style="text-align:right; padding-top:5px" v-if="formFieldValues.publishStatus!=2">
                    <el-button style="margin:0 8px" @click="removetiezi()" >删除帖子</el-button>
                    <el-button v-if="!formFieldValues.superStatus" style="margin:0 8px" @click="toEssenceArticle()">取消加精</el-button>
                    <el-button v-if="formFieldValues.superStatus" style="margin:0 8px" @click="toEssenceArticle()">加精华</el-button>
                    <!-- <el-button style="margin:0 8px" @click="toTop()" >置顶</el-button> -->
                    <el-button v-if="!formFieldValues.topStatus" style="margin:0 8px" @click="toTop()">取消置顶
                    </el-button>
                    <el-button v-if="formFieldValues.topStatus" style="margin:0 8px" @click="toTop()">置顶
                    </el-button>
                </el-col> 
            </el-row>
            <el-row style="padding-bottom:20px ">
              <el-col :span="24">
                <div v-html="formFieldValues.Newcontent" class="contentTiezi"></div>
              </el-col>
            </el-row>

          </div>
          <el-row style="width:100%; padding:10px; padding-left:210px; ">
            <el-col :span="20"> 浏览：{{ formFieldValues.browseNumber }}  
                <span style="width:0;height20px;border:solid 1px #f5f5f5;height:20px;"></span> 回复：{{ formFieldValues.newCommentNumber }} 
            </el-col>
          </el-row>
        </div>
        <div style="margin:0;border:solid 1px #f5f5f5;float:left;width:100%;"></div>
        
            <div :key="n" v-for="(i,n) in list " style="float:left;width:100%;">
            <div style="position:relative; float:left;width:100%">
                <div style="width:200px;height:100%; background:#f1f1f1;position:absolute;top:0;left:0;text-align:center;">
                <ul>
                    <li>
                    <p style="padding-top: 20px ">{{ i.commenterName }}</p>
                    </li>
                    <li>
                    <p style="padding:20px;"><img :src="i.commenterPhoto" style="width:100px;height:100px" /></p>
                    </li>
                    <li>发帖数：{{ i.articleNumber }}</li>
                    <li>回帖数：{{ i.commentNumber }}</li>
                    <!-- <li>车型：RX5</li> -->
                </ul>

                </div>
                <div style="width:100%; min-height: 300px; padding-left:210px ">
                <el-row style="padding:10px 0;">
                    <el-col :span="20">发布于 {{ i.commentTime }} </el-col>
                    <el-col :span="4"> <span style="float: 'right' ">{{ n + 1 }}楼</span></el-col>
                </el-row>
                <el-row>

                    <el-col :span="24" style="text-align:right; padding-top:5px" v-if="i.status!=4">
                    <el-button style="margin:0 8px" @click="commentAtice(i.commentId)">删除评论</el-button >
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div v-html="i.commentContent" class="contentTiezi">
                        </div>
                        <div class="imgsDto">
                            <img :src="x.photoUrl" alt="" v-for="(x,n) in i.imgsDto" :key="n" >
                        </div>
                    </el-col>
                </el-row>


                </div>
                <el-row style="width100%;padding:10px;padding-left:210px;">
    
                <el-row v-for="(i,n) in i.level2List" :key="n" style="padding:3px 0;">
                    <el-col :span="20" v-if="i.commenterToName"><a style="color:#409eff">{{ i.commenterToName }} </a>回复 <a style="color:#409eff">{{i.commenterName }} </a>：{{i.commentContent }}</el-col>
                    <el-col :span="20" v-else> <a style="color:#409eff">{{ i.commenterName }} </a>：{{i.commentContent }}</el-col>
                    <el-col :span="4" v-if="i.status !=4"> <a   @click="deleteHuifu(i.commentId)">删除</a></el-col>
                </el-row>

            
    
                </el-row>
            </div>
            <div style="margin:0;border:solid 1px #f5f5f5;float:left;width:100%;"></div>

            </div>
            <div style="float:left;width:100%;">
               <el-row v-if="formFieldValues.publishStatus != 2">
              <el-col :span="24" style="text-align:center; padding-top: 15px; ">
                  <el-button style="margin:0 8px" 
                            v-clipboard:copy="messageUrl"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                            >复制链接</el-button>
                  <el-button style="margin:0 8px" @click="onAction" >回复帖子</el-button>
              </el-col>
            </el-row> 
            <el-row v-else >
              <div style="text-align:center;margin-top:15px;">
                  <span style="margin:4px 8px">删除时间：{{ formFieldValues.deletebyTime}}</span>
                  <span style="margin:4px 8px">删除人：{{ formFieldValues.deletebyName }}</span>
              </div>

            </el-row>
            </div> 
            
  </div>
</template>

 
<script>
import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
  export default {
    name:"iframeiframe",
    data () {
      return {
        formFieldValues:'',
        list:[],
        tieziId:this.$parent.tieziId,
        limit:10,
        page:1,
        blockId:this.$parent.blockId,
        userId:'',
        messageUrl:location.origin + '/saicui/forumTemp?id='+this.$parent.tieziId,
        dialogFormVisible:false,
        ue:null,
        topStatus:'',
        superStatus:'',
        form:{
            page:1,
            limit:10
        },
        total:0,
        userList:[]
      }
    }, 
    components:{
      
    },
    mounted () {
      this.getData();
      
    },
    methods: {
        getData(){
            request({
                    url:'community/article/queryDetailArticleApp',
                    method:'get',
                    params:{id:this.tieziId}
                }).then((res)=>{
                    this.formFieldValues=res.data;
                    this.formFieldValues.newCommentNumber=res.data.commentNumber;
                    this.formFieldValues.Newname=res.data.name;
                    this.$parent.userId=res.data.userId;
                    this.userId=res.data.userId;
                    res.data.Newcontent=''
                    for (let i = 0; i < res.data.communityContentQuerydto.length; i++) {
                        if (res.data.communityContentQuerydto[i].type == 1 || res.data.communityContentQuerydto[i].type == 4) {
                            res.data.Newcontent +='<p>'+ res.data.communityContentQuerydto[i].content + '</p>';
                        } else if (res.data.communityContentQuerydto[i].type == 2) {
                            res.data.Newcontent += "<img width='25%' src=" + res.data.communityContentQuerydto[i].content + " />";
                        }
                    }
                     this.formFieldValues.Newcontent=res.data.Newcontent
                    request({
                        url:'community/article/queryMessage',
                        method:'post',
                        data:{ blockId: this.blockId, userId: res.data.userId }
                    }).then((res)=>{
                        var data={...this.formFieldValues,...res.data}
                        this.formFieldValues=data;
                    })
                })
                
                request({
                    url:'community/comment/web/queryCommentList',
                    method:'get',
                    params:{ businessId: this.tieziId, businessType: 1007, limit: this.form.limit, page: this.form.page }
                }).then((res)=>{
                    var list=[];
                    if(res.data && res.data.length>0){
                        this.total=res.data[0].total;
                        for(var i=0;i<res.data.length;i++){
                            var obj=res.data[i];
                            try {
                                obj['articleNumber']=obj.blockRole['articleNumber'];
                                obj['commentNumber']=obj.blockRole['commentNumber'];
                            } catch (error) {
                                console.log(error)
                            }
                            
                        list.push(obj);
                        }
                        this.list=list;
                    }
                })
        },
        onCopy: function (e) {
            this.$message({
                message: '复制成功,地址：'+e.text,
                type: 'succcess'
            });
        },
        onError: function (e) {
            this.$message({
                message: '复制失败',
                type: 'error'
            });
        },
       commentAtice(id){
           var data={
                userId:this.userId,
                blockId:this.blockId,
                // tieziId:this.tieziId,
                id:id
            };
           request({
               url:'community/article/deleteCommentBackstage',
               method:'post',
               data:data
           }).then(res=>{
                this.$message({
                    message: "删除评论成功",
                    type: "success",
                    duration: 2000
                });
                this.getData();
           })

       },
       handleSizeChange(val) {
            this.form.limit = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getData();
        },
       deleteHuifu(id){
           var data={
                userId:this.userId,
                blockId:this.blockId,
                // tieziId:this.tieziId,
                id:id
            };
           request({
               url:'community/article/deleteCommentBackstage',
               method:'post',
               data:data
           }).then(res=>{
                this.$message({
                    message: "删除评论成功",
                    type: "success",
                    duration: 2000
                });
                this.getData();
           })

       },
       onAction(){
         this.$parent.show='huifu';
       },
       removetiezi(){
            var data={
                userId:this.userId,
                blockId:this.blockId,
                id:this.tieziId 
            };

           request({
               url:'community/article/updatePublishStatus',
               method:'post',
               data:data
           }).then(res=>{
                this.$message({
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                });
                this.getData();
           })
       },
       toTop(){
           var data={
                userId:this.userId,
                blockId:this.blockId,
                id:this.tieziId,
                topStatus:this.formFieldValues.topStatus 
            };
           request({
               url:'community/article/updateTopStatus',
               method:'post',
               data:data
           }).then(res=>{
               if (this.formFieldValues.topStatus==1) {
                   this.$message({
                    message: "置顶成功",
                    type: "success",
                    duration: 2000
                });
               }
               if (this.formFieldValues.topStatus==0) {
                   this.$message({
                    message: "取消置顶成功",
                    type: "success",
                    duration: 2000
                });
               }
               this.getData();
           })
       },
       toEssenceArticle(){
           var data={
                id:this.tieziId,
                blockId: this.blockId,
                userId:this.id,
                superStatus:this.formFieldValues.superStatus
            };
           request({
               url:'community/article/toEssenceArticle',
               method:'post',
               data:data
           }).then(res=>{
               if (this.formFieldValues.superStatus==0) {
                   this.$message({
                    message: "取消加精成功",
                    type: "success",
                    duration: 2000
                });
               }
                if (this.formFieldValues.superStatus==1) {
                   this.$message({
                    message: "加精成功",
                    type: "success",
                    duration: 2000
                });
               }
                this.getData();
           })
       }
    }
  }
</script>
 
<style>
body{margin:0; padding:0;}
ul,li{
    list-style: none;
}
.contentTiezi{
    padding-left: 10px;
    padding-top:10px;
}
.contentTiezi img {
  max-width:100%;
}
.imgsDto img{
   max-width: 50%;
}

</style>