 <template>
    <div class="app-container calendar-list-container">
        <el-table :data="changeCodeData"  border style="width: 83%" height="600px">
            <el-table-column align="center" type="index"  label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="type" label="类别"  width="120"></el-table-column>
            <el-table-column align="center" prop="code" label="编码" width="120"></el-table-column>
            <el-table-column align="center" prop="name" label="业务名称" ></el-table-column>
            <el-table-column align="center" prop="content" label="业务内容" width="150">
                <template slot-scope="{row,$index}">
                    <div  @dblclick="{{chengenum($index)}}">
                        <span v-if="editable[$index]"><el-input v-model='row.content'></el-input></span>
                        <span v-else><font color="green">{{row.content}}</font></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作"  width="100px">
                <template slot-scope="{row,$index}">
                    <el-button @click="handleClick(row,$index)" type="text" size="small">保存</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="queryParam.page" :page-sizes="[10,20,30,50]" :page-size="queryParam.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request';
export default {
   data(){
       return{
           changeCodeData: [],
           total: 0,
           editable:[],
           queryParam: {
               limt: 10,
               page: 1
           }
       }
   },
   created() {
       this.getchangeCodeList();
   },
   methods: {
        handleSizeChange(val) {
            this.queryParam.limit = val;
            this.getchangeCodeList();
        },
        handleCurrentChange(val) {
            console.log(val);
            this.queryParam.page = val;
            this.getchangeCodeList();
        },
        getchangeCodeList(){
            request({
                url: '/community/changeCode/changeCodeList',
                method: 'get',
                params: this.queryParam
            }).then(response => {
                this.total = response.data.rows.length;
                this.changeCodeData = response.data.rows;
            });            
        },
        chengenum(row){
            this.editable[row] = true;
            this.$set(this.editable,row,true);
        },
        handleClick(row,index){
            // console.log(index);
            var reg = /^[1-9]\d*$/;
            if(!reg.test(row.content)) {
                this.$message({
                    message: '请输入数字值',
                    type: 'warning'
                });
                return false;
            }
            request({
                url: '/community/changeCode/updateChangeCode',
                method: 'post',
                data: {"id":row.id,"content":row.content}
            }).then(response => {
                if(response.success){
                    this.editable[index] = false;
                    this.$set(this.editable,row,false);
                    this.getchangeCodeList();
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }
            }); 
            
        }
   }
}
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
