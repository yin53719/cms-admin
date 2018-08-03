<template>
  <div class="tab-container">
    <el-table :data="list" border  style="max-width:1200px;">
        
        <el-table-column prop="id" label="序号" type='index' align="center"  width="50"> </el-table-column>
        <el-table-column label="角色名称" prop="role_name" width="150" align="center"> 

        </el-table-column>
        <el-table-column align="center" prop="role_id" label="角色ID" width="80" >
     
        </el-table-column>
        <el-table-column prop="remark" label="描述" width="150" align="center"> </el-table-column>
        <el-table-column  label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="editUser(scope.row)" >授权</el-button>
                </template>
        </el-table-column>
    </el-table>
    <!-- 角色菜单授权 -->
    <el-dialog title="角色授权" :visible.sync="isShowedit" width="60%">

      <el-tree :data="treedata" ref="tree" node-key="id" :default-checked-keys="defaultChecked" :props="defaultProps" :getCurrentNode="getCurrentNode" @node-click="handleNodeClick" :show-checkbox="true"></el-tree>


      <span slot="footer" class="dialog-footer">
          <el-button @click="isShowedit=false">取 消</el-button>
          <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'users',
    data() {
      return {
        list:[],
        treedata:[],
        isShowedit:false,
        defaultChecked:[100710],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        role_id:''
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
      editUser(rows){
        let self =  this;
        this.role_id=rows.role_id;
        request({
           url:'/api/menus/roles/'+rows.role_id,
           method:'get'
        }).then((res)=>{
            self.treedata=res.data.list;
            let list=res.data.defaultChecked;
            let len=list.length;
            var defaultChecked=[];
            if(len>0){
              for(var i=0;i<len;i++){
                  defaultChecked.push(list[i].menu_id);
              }
            }
            self.defaultChecked=defaultChecked;
            self.isShowedit=true;
        })
        
        
      },
      getCheckedNodes() {
        var menus=this.$refs.tree.getCheckedNodes()
        var list=[];
        for(var i=0;i<menus.length;i++){
            var obj={
              menu_id:menus[i].id,
              role_id:menus[i].role_id,
              menu_name:menus[i].label,
            }
            list.push(obj);
        }
        request({
           url:'/api/menus/roles/'+this.role_id,
           method:'put',
           data:{
             menus:list,
           }
        }).then((res)=>{
            this.isShowedit=false;
        })

      },
      getCurrentNode(d){
        console.log(d);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      fetchData (){
        request({
           url:'/api/roles',
           method:'get'
        }).then((res)=>{
            this.list=res.data;
        })
      }
    }
  }
</script>
<style scoped>
  .tab-container{
    margin: 20px 10px;
  }
</style>