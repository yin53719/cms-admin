 <template>
  <div >
      <el-row>
          <el-col :span="20"><h2>帖子详情</h2></el-col>
          <el-col :span="4" style="text-align:right;"><el-button @click="$parent.show='auditContent'">返回</el-button></el-col>
      </el-row>
       <el-pagination v-if="$parent.level ==1" @size-change="handleSizeChange"  background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10,20,30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        <div style="position:relative;float:left; width:100%" v-if="$parent.level !=2">
          <div style="width:200px;height:100%;background:#f1f1f1; position:absolute; top:0; left:0; text-align:center;">
            <ul>
              <li>
                <p style="padding-top:20px">{{ formFieldValues.name }}</p>
              </li>
              <li>
                <p style="padding:20px"><img :src='formFieldValues.photo' style="width:100px;height:100px"  /></p>
              </li>
              <li>发帖数：{{ formFieldValues.articleNumber }}</li>
              <li>回帖数：{{ formFieldValues.commentNumber }}</li>
              <!-- <li>车型：RX5</li> -->
            </ul>

          </div>
          <div style="width:100%; min-height:300px;padding-left:210px ">
            <el-row style="padding:10px 0;border-bottom:solid 1px #ccc;margin-bottom:10px;">
              <el-col :span="10">发布于: {{ formFieldValues.createDate }}</el-col>
              <el-col :span="14" v-if="formFieldValues.checkStatus !=0 ">
                      <span style="color:red" v-show="$parent.level!=1">
                            <span v-if="formFieldValues.checkStatus==1">优质内容</span>
                            <span v-if="formFieldValues.checkStatus==2">一般内容</span>
                            <span v-if="formFieldValues.checkStatus==3">劣质内容</span>
                            <span>审核时间：{{ formFieldValues.auditTime }}</span>  
                            <el-button  size="small"  @click="openupdatahandleForce(formFieldValues)" type="success">修改</el-button>
                        </span>
                       
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><h2 style="margin:0;">{{ formFieldValues.title }}</h2>  </el-col>
            </el-row>
            <el-row style="padding-bottom:20px ">
              <el-col :span="24">
                <div v-html="formFieldValues.Newcontent" class="contentTiezi"></div>
              </el-col>
            </el-row>

          </div>
          <el-row style="width:100%; padding:10px; padding-left:210px; " v-if="$parent.level ==1">
            <el-col :span="20"> 浏览：{{ formFieldValues.browseNumber }}  
                <span style="width:0;height20px;border:solid 1px #f5f5f5;height:20px;"></span> 回复：{{ total }} 
            </el-col>
          </el-row>
        </div>
        <div style="margin:0;border:solid 1px #f5f5f5;float:left;width:100%;"></div>
        
        <div :key="n" v-for="(i,n) in list " style="float:left;width:100%;" v-if="$parent.level !=0" :style="{background:i.commentId==$parent.tieziId?'#ccc':''}">
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
                <el-row style="padding:10px 0;border-bottom:solid 1px #ccc;margin-bottom:10px;">
                    <el-col :span="12">发布于 {{ i.commentTime }} </el-col>
                    <el-col :span="12" v-if="i.status==0"> 
                        <el-button size="small"  @click="handleForcePing(i,3)" type="primary">劣质内容</el-button>
                        <el-button   size="small"  @click="handleForcePing(i,2)" type="danger">一般内容</el-button>
                        <el-button  size="small"  @click="handleForcePing(i,1)" type="danger">优质内容</el-button>
                   </el-col>
                   <el-col :span="12" v-if="i.status !=0 && $parent.level==1">
                        <span style="color:red">
                            <span v-if="i.status==1">优质内容</span>
                            <span v-if="i.status==2">一般内容</span>
                            <span v-if="i.status==3">劣质内容</span>
                            <span>审核时间：{{ i.auditTime }}</span>  
                        </span>
                        
                        <el-button  size="small"  @click="updatahandleForce(i)" type="success">修改</el-button>
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
                        <el-col :span="12" v-if="i.commenterToName"><a style="color:#409eff">{{ i.commenterToName }} </a>回复 <a style="color:#409eff">{{i.commenterName }} </a>：{{i.commentContent }}</el-col>
                        <el-col :span="12" v-else> <a style="color:#409eff">{{ i.commenterName }} </a>：{{i.commentContent }}</el-col>
                        <el-col :span="12" v-if="i.status ==0" >
                            <el-button size="small"  @click="handleForcePing(i,3)" type="primary">劣质内容</el-button>
                            <el-button size="small" @click="handleForcePing(i,2)" type="danger">一般内容</el-button>
                            <el-button size="small" @click="handleForcePing(i,1)" type="success">优质内容</el-button>
                        </el-col>
                        <el-col :span="12" v-else style="color:red">
                            <span v-if="i.status==1">优质内容</span>
                            <span v-if="i.status==2">一般内容</span>
                            <span v-if="i.status==3">劣质内容</span>
                            <span>审核时间：{{ i.auditTime }}</span>  
                            <el-button size="small"  @click="updatahandleForce(i)" type="success">修改</el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </div>
            <div style="margin:0;border:solid 1px #f5f5f5;float:left;width:100%;"></div>

            </div>
            <div style="float:left;width:100%;">
               <el-row v-if="formFieldValues.checkStatus == 0 && $parent.level ==0">
                    <el-col :span="24" style="text-align:center; padding-top: 15px; "  v-show="$parent.level!=1">
                        <el-button  @click="handleForce(formFieldValues,3)" type="primary">劣质内容</el-button>
                        <el-button  @click="handleForce(formFieldValues,2)" type="danger">一般内容</el-button>
                        <el-button  @click="handleForce(formFieldValues,1)" type="danger">优质内容</el-button>
                    </el-col>
                </el-row> 
            </div> 
        <el-dialog title="修改" :visible.sync="dialogFormVisible11">
               <el-radio v-model="radio" :label="1">优质内容</el-radio>
               <el-radio v-model="radio" :label="2">一般内容</el-radio>
               <el-radio v-model="radio" :label="3">劣质内容</el-radio>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible11 = false">取 消</el-button>
            <el-button type="primary" @click="saveUser">保 存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改" :visible.sync="dialogFormVisiblezhu">
               <el-radio v-model="radio" :label="1">优质内容</el-radio>
               <el-radio v-model="radio" :label="2">一般内容</el-radio>
               <el-radio v-model="radio" :label="3">劣质内容</el-radio>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblezhu = false">取 消</el-button>
            <el-button type="primary" @click="saveUserzhu">保 存</el-button>
          </div>
        </el-dialog>

        
  </div>
</template>

 
<script>
import request from '@/utils/request';
import { postData,formatdate } from '@/utils';
  export default {
    name:"iframeiframe",
    data () {
      return {
        formFieldValues:{},
        list:[],
        tieziId:this.$parent.tieziId,
        limit:10,
        page:1,
        blockId:this.$parent.blockId,
        userId:'',
        dialogFormVisible:false,
        radio:1,
        dialogFormVisible11:false,
        dialogFormVisiblezhu:false,
        autdingDataList:{},
        form:{
            page:1,
            limit:10
        },
        total:0,
        userList:[]
      }
    }, 
    mounted () {
        this.getDataZhu()
    },
    methods: {
        getDataZhu(){
            request({
                url:'/community/audit/queryAuditingDetailList',
                method:'get',
                params:{id:this.$parent.tieziId,businessType:this.$parent.businessType,level:this.$parent.level,limit:this.form.limit}
            }).then((res)=>{
                if(this.$parent.level !=2){
                    this.formFieldValues=res.data.articleDto;
                    this.formFieldValues.commentNumber=res.data.articleDto.blockRole.commentNumber;
                    this.formFieldValues.articleNumber=res.data.articleDto.blockRole.articleNumber;
                    this.formFieldValues.name=res.data.articleDto.name;
                     res.data.Newcontent='';
                     for (let i = 0; i < res.data.articleDto.communityContentQuerydto.length; i++) {
                        if (res.data.articleDto.communityContentQuerydto[i].type == 1 || res.data.articleDto.communityContentQuerydto[i].type == 4) {
                            res.data.Newcontent += '<p>'+ res.data.articleDto.communityContentQuerydto[i].content + '</p>';
                        } else if (res.data.articleDto.communityContentQuerydto[i].type == 2) {
                            res.data.Newcontent += "<img width='25%' src=" + res.data.articleDto.communityContentQuerydto[i].content + " />";
                        }
                    }
                    this.formFieldValues.Newcontent=res.data.Newcontent
                }
               
                if(this.$parent.level !=0){
                    if(this.$parent.level==1){
                        this.list =res.data.commentList.rows;
                        this.total =res.data.commentList.total
                        this.form.page=this.list[0].page
                    }else if(this.$parent.level==2){
                         this.list=[res.data.commentDto]
                    }
                    
                }
                
            
            })
        },
        getData(){
            request({
                url:'/community/audit/queryAuditingCommentList',
                method:'get',
                params:{businessId:this.formFieldValues.id,businessType:this.$parent.businessType,limit:this.form.limit,page:this.form.page}
            }).then((res)=>{
                this.list =res.data.rows;
            })
        },
        openupdatahandleForce(){
            this.dialogFormVisiblezhu=true;
            this.radio=this.formFieldValues.checkStatus;
        },
    
        updatahandleForce(row){
          this.autdingDataList=row;
          this.radio=row.status;
          this.dialogFormVisible11=true;
        },
        saveUser(){
         this.handleForcePing(this.autdingDataList,this.radio)
        },
        saveUserzhu(){
         this.handleForce(this.formFieldValues,this.radio)
        },
        handleForcePing(row,t) {
           let text = '';
           var data=Object.assign({},row);

           data.status=t;
           data.id=row.commentId;
           data.businessType=this.$parent.businessType;
           if(t==3){
              text='劣质'
           }else if(t==2){
              text='一般'
           }else if(t==1){
              text='优质'
           }
            this.$confirm(`确认为${text}内容?`, "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                request({
                    url:'/community/audit/updateAuditStatus',
                    method:'post',
                    data:data
                }).then(() => {
                    this.$message({
                        message:'审核成功',
                        type: 'success'
                    });
                    this.dialogFormVisible11=false;
                    this.getDataZhu()
                });
            });
        },
        handleForce(row,t) {
           let text = '';
           row.status=t;
           row.businessType=this.$parent.businessType;
           row.level=this.$parent.level;
           if(t==3){
              text='劣质'
           }else if(t==2){
              text='一般'
           }else if(t==1){
              text='优质'
           }
            this.$confirm(`确认为${text}内容?`, "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                request({
                    url:'/community/audit/updateAuditStatus',
                    method:'post',
                    data:row
                }).then(() => {
                    this.$message({
                    message:'审核成功',
                    type: 'success'
                    });
                    this.dialogFormVisiblezhu=false;
                    this.getDataZhu()
                });
            });
        },
        handleSizeChange(val) {
            this.form.limit = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.getData();
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
   max-width: 25%;
}
</style>