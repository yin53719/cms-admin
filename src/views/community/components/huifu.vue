 <template>
    <div>
        <el-form ref="form" :model="form"  label-width="100px"  style="width:600px;">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="发布号">
                        <el-select v-model="form.uid" filterable placeholder="请选择">
                        <el-option
                            v-for="item in userList"
                            :key="item.saicUserId"
                            :label="item.nickName"
                            :value="item.saicUserId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                     <el-form-item label="回复内容">
                        <div :id="editor" type="text/plain" style="line-height:20px"></div>
                     </el-form-item>
                </el-col>
            </el-row>
           <el-row>
                <el-col :span="24">
                    <el-form-item label="图片列表">
                     <el-upload
                        action="/api/cmyManage/sys/uploadFile"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :file-list="imgs"
                        :on-success="handleAvatarSuccess">
                    <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="24" style="text-align:center; padding-top: 5px; ">
                <el-button style="margin:0 8px" @click="$parent.show='tieziInfo'" >取消</el-button>
                <el-button style="margin:0 8px" @click="onAction" >确定</el-button>
            </el-col>
        </el-row> 
    </div>
</template>

<script>

import request from '@/utils/request';
import { postData,formatdate } from '@/utils';

export default {
  name: "user",
  data() {
    return {
      show:'tieziInfo',
      tieziId:'',
      blockId:'',
      userList:[],
      editor:new Date().getTime().toString(),
      form:{
          uid:''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      imgs:[]
    };
  },
  created() {
    
  },

  mounted(){
        request({
            url:'/community/user/saicUser/findOfficialUser',
            method:'get',
            params:{'userPublishType':2}
        }).then((res)=>{
            this.userList=res.data;
        })
      this.ue = window.UE.getEditor(this.editor,{
      toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
             'emotion', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', '|',
             'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
        ]]
    });
  },
  methods: {
      handleAvatarSuccess(file, fileList) {
        this.imgs.push({
            url:file.data
        });
    
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
     onAction(){
        var commentContent=this.ue.getContent()
        var imgs=[];
        if(this.imgs.length>0){
         for(var i=0;i<this.imgs.length;i++){
            imgs.push(this.imgs[i].url);
         }
        }
        if(this.imgs.length==0 && commentContent==''){
            this.$message({
                message: '文字和图片列表至少填写一样',
                type: 'error'
            });
           return false;
        }
       if(this.form.uid==''){
            this.$message({
                message: '发布号必选',
                type: 'error'
            });
           return false;
        }
        
        var data={
            commentContent: commentContent,
            businessId: this.$parent.tieziId,
            businessType: '1007',
            blockId: this.$parent.blockId,
            level: 1,
            uid:this.form.uid,
            userType:2,
            imgs:imgs.length>0?imgs.join(','):''
        }
        request({
            url:'/community/comment/app/insertComment',
            method:'post',
            data:data
        }).then((res)=>{
           this.$message({
                message: '回复成功',
                type: 'success'
            });
            this.$parent.show='tieziInfo';
        })
     }
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




