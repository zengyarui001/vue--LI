<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 游戏管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                 <el-select v-model="select_cate" placeholder="请筛选游戏状态" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in availableData" :key="index" :label="item.name" :value="item.available"></el-option>
                </el-select>
                <el-input placeholder="请输入游戏中文名查询" style="width:200px;margin-right:5px" v-model="searchGameName"></el-input>
                <el-button style="margin-right:20px" type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addGame">添加游戏</el-button>
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
                <el-table-column align="center" label="状态" width="120">
                        <template scope="scope">
                         <span v-if="scope.row.available =='可用'" style="color: green">{{scope.row.available}}</span>
                         <span v-else-if="scope.row.available == '不可用'" style="color: red">{{scope.row.available}}</span>
                        </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination 
                    background
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange" 
                    layout="sizes,prev, pager, next" 
                    :page-count="this.total"
                    :page-sizes="[20,50,100,200]"
                    >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="compile" label-width="100px">
                <el-form-item label="中文名称:">
                    <el-input style="width:215px;" v-model="compileCNname"></el-input>
                </el-form-item>
                <el-form-item label="游戏类型:">
                    <el-select  v-model="rgpGame" placeholder="请选择游戏类型" >
                        <el-option v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
                </el-form-item>
                 <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="isrgpGame" placeholder="可用">
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

          <!-- 添加弹出框 -->
        <el-dialog title="添加游戏" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addGames" label-width="100px">
                
                <el-form-item label="英文名称:">
                    <el-input style="width:215px;" v-model="addGameName"></el-input>
                </el-form-item>
                 <el-form-item label="中文名称:">
                    <el-input style="width:215px;" v-model="addGameCName"></el-input>
                </el-form-item>
                <el-form-item label="游戏类型:">
                    <el-select  v-model="select" placeholder="请选择类型" >
                         <el-option v-for="(item,index) in classifyList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可用:">
                    <!-- <el-input v-model="form.available"></el-input> -->
                     <el-select v-model="selectUse" placeholder="可用">
                        <el-option label="可用" value=true></el-option>
                        <el-option label="不可用" value=false></el-option>
                    </el-select>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'gameTable',
        data() {
            return {
                tableData: [],    
                cur_page:1,     //当前页码
                PageSize:20,
                loading:true,
                classifyList:[],
                gameListData:[], 
                select_cate: '',
                select_word: '',
                del_list: [],
                searchGameName:'',
                addGameName:'',
                addGameCName:'',
                availableData:[
                    {name:'全部',available:''},
                    {name:'可用',available:true},
                    {name:'不可用',available:false}
                ],
                compileCNname:'',
                is_search: true,
                editVisible: false,
                delVisible: false,
                addVisible:false,
                select:'',
                selectUse:'',
                isrgpGame:'',
                total:0,
                rgpGame:'',
                form: {
            
                },
                compile:{

                },
                addGames:{
                    
                },
                idx: -1,

            }
        },
        created() {
            this.getData();
            this.classify();
            this.gameList();
        },
        watch:{
            addGameName(){
                this.addGameName = this.addGameName.replace(/[^\a-\z\A-\Z]/g,'');
            },
            addGameCName() {
                this.addGameCName = this.addGameCName.replace(/[^\u4E00-\u9FA5]/g,'');
            },
            compileCNname() {
                this.compileCNname = this.compileCNname.replace(/[^\u4E00-\u9FA5]/g,'');
            }
        },
        computed: {
           
        },
        methods: {
            change() {
                console.log(this.select_cate);
                let data = {
                    available:this.select_cate
                }
                this.getData(data);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                let self = this;
                let data = {
                    PageIndex:this.cur_page-1,
                    PageSize:this.PageSize
                }
                if(this.select_cate) {
                   data.available = this.select_cate;
               }
               if(this.searchGameName) {
                  data.GameCName = this.searchGameName;
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
               if(this.searchGameName) {
                  data.GameCName = this.searchGameName;
               }
                this.getData(data)

            },
          
            getData(data) {
                let self = this;
                this.$get(this.baseURL + this.site.GetGames,data).then(res=>{
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
            gameList(){
                let self = this;
                self.$get(this.baseURL+this.site.GameCates).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.gameListData = res.data.data;
                     }else {
                        this.$message.error(res.data.failedMsg);
                     }
                })
            },
            addGame(){
                this.addGame = {};
                this.addVisible = true;
            },
            classify(){
                let self = this;
                self.$get(this.baseURL+this.site.GameCates).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        console.log(res.data.data)
                         this.classifyList = res.data.data;
                    }
                })

            },
            search() {
              
                let data = {
                    GameCName:this.searchGameName
                }
                if(this.searchGameName == '') {
                  
                    setTimeout(() => {
                         this.getData();
                    }, 2000);
                    return
                }
                this.getData(data);
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.compile = {
                    game_name: item.game_name,
                    id: item.id,
                    cate_name:item.cate_name,
                    available:item.available
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.form = row;
            },

         
            // 新增
            addEdit(){
                let self = this;
                this.addVisible = false;
                if(!this.select) {
                    this.select = 1;
                }
                if(this.selectUse == '') {
                    this.selectUse = true;
                }
                let data = {
                    gameName:this.addGameName,
                    cateId : this.select,
                    gameCName:this.addGameCName,
                    available:this.selectUse
                }
                
                self.$post(this.baseURL + this.site.AddGame,data).then((res)=>{
                     if(res.data.code == self.S_CODE) {
                         this.getData();
                         this.$message.success(`添加成功`);   
                         this.addGames = {};   
                         this.selectUse = "";               
                     }else {
                      this.$message.error(res.data.failedMsg);
                  }
                })
            },
            // 保存编辑
            saveEdit() {
                let self = this;     
                this.editVisible = false;
                if(!this.rgpGame) {
                    this.rgpGame = 1;
                }
                 if(this.isrgpGame == '') {
                    this.isrgpGame = true;
                }
                let data = {
                    id:this.compile.id,
                    gameCName:this.compileCNname,
                    cateId:this.rgpGame,
                    available:this.isrgpGame
                }
                this.$axios.put(this.baseURL + this.site.UpdateGame,data).then(res=>{
                     if(res.data.code == self.S_CODE){
                          this.getData();
                         this.$message.success(`修改成功`);
                         this.isrgpGame == '';
                         this.compile = {};
                     }else {
                      this.$message.error(res.data.failedMsg);
                   }
                })
                
            },
            // 确定删除
            deleteRow(){
                let self = this;
                let data = {
                    id:this.form.id
                }
                self.$axios.delete(this.baseURL + this.site.DeleteGame +'?id='+this.form.id,).then(res=>{
                    if(res.data.code == this.S_CODE) {
                         this.getData();
                        this.$message.success('删除成功');
                        this.delVisible = false;          
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
