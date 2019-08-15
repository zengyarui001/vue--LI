<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 代理游戏管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-select v-model="select_cate" placeholder="请筛选游戏状态" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in availableData" :key="index" :label="item.name" :value="item.available"></el-option>
                </el-select>
               
                <el-input v-model="select_word" style="width:200px;margin-right:5px" placeholder="请输入游戏中文名查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search"  @click="search">搜索</el-button>

            </div>   
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                :data="tableData" 
                border 
                class="table" 
                ref="multipleTable"  
                >
                <!-- <el-table-column type="" width="55" align="center"></el-table-column> -->
                <!-- <el-table-column align="center" prop="id" label="id" sortable width="150">
                </el-table-column> -->
                 <el-table-column align="center" type="index" label="序号" sortable width="150">
                </el-table-column> 
                <el-table-column align="center" prop="game_name" label="英文名称" width="120">
                </el-table-column>
                <el-table-column align="center" prop="game_cnname" label="中文名称" width="120">
                </el-table-column>
                <el-table-column align="center" prop="cate_name" label="游戏类型" width="120">
                </el-table-column>
                <el-table-column align="center"  label="状态" width="120">
                      <template scope="scope">
                         <span v-if="scope.row.available =='可用'" style="color: green">{{scope.row.available}}</span>
                         <span v-else-if="scope.row.available == '不可用'" style="color: red">{{scope.row.available}}</span>
                      </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                      
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background 
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[20,50,100,200]" 
                    layout="sizes,prev, pager, next"  
                    :page-count="this.total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="游戏名称:">
                    <el-input style="width:215px;" :disabled="true"  v-model="form.game_name"></el-input>
                </el-form-item>
                    <el-form-item label="是否可用:">
                     <el-select v-model="select" placeholder="可用">
                        <el-option label="可用" value=true></el-option>
                        <el-option label="不可用" value=false></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'AuGame',
        data() {
            return {
                tableData: [],
                cur_page:1,     //当前页码
                PageSize:20,
                loading:true,
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: true,
                availableData:[
                    {name:'全部',available:''},
                    {name:'可用',available:true},
                    {name:'不可用',available:false}
                ],
                editVisible: false,
                delVisible: false,
                addVisible:false,
                select:'',
                total:0,
                form: {
                 
                },
                idx: -1,

            }
        },
        created() {
            this.getData();
        },
        computed: {
           
        },
        methods: {
            change() {
                let data = {
                    Available:this.select_cate
                }
                this.getData(data);
            },
            // 分页导航
            handleCurrentChange(val) {
                let self = this;
                this.cur_page = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
               if(this.select_cate) {
                   data.available = this.select_cate;
               }
               if(this.select_word) {
                  data.GameCName = this.select_word;
               }
                this.getData(data)
                this.$message.success(`第${val}页`);

            },
            handleSizeChange(val){
                this.PageSize = val;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
               if(this.select_cate) {
                   data.available = this.select_cate;
               }
               if(this.select_word) {
                  data.GameCName = this.select_word;
               }
                this.getData(data)
            },
           handleEdit (index,row) {
                this.form = {
                    game_name: row.game_cnname,
                    id: row.id
                }
               this.editVisible = true;
           },
            getData(data) {
                let self = this;       
                this.$get(this.baseURL + this.site.GetAgentGames,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         self.$message.success('加载成功');
                         setTimeout(() => {
                             this.loading = false;
                         }, 1000);
                         this.tableData = res.data.data.data;
                        this.total = res.data.data.totalPages;
                        this.tableData.map((val,index)=>{
                         if(val.available) {
                             val.available = '可用'
                         }else {
                             val.available = '不可用'
                         }
                     })
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }
                     
                })
               
            },
            addGame(){
                this.addVisible = true;
            },
            search() {
                let data = {
                    GameCName:this.select_word
                }
                 if(this.select_word == '') {
                    
                    setTimeout(() => {
                         this.getData();
                    }, 2000);    
                    return
                 }
               this.getData(data);
            },
           
            // 保存编辑
            saveEdit() {
                let self = this;
                
                this.editVisible = false;
                if(this.select == '') {
                    this.select = true;
                }
                let data = {
                    id:this.form.id,
                    available:this.select
                }
               
                this.$axios.put(this.baseURL + this.site.UpdateAgentGame,data).then(res=>{
                   
                     if(res.data.code == self.S_CODE){
                         this.getData();
                         this.$message.success(`修改成功`);
                     }else {
                        this.$message.error(res.data.failedMsg);  
                    }
                })
                
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
