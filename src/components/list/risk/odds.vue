<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 房间赔率设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_cate" placeholder="请选择游戏" class="handle-select mr10" @change="change">
                    <el-option v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                  
                </el-select>
                <!-- <el-input v-model="select_word" placeholder="请输入ID进行查询" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
                <el-button class="addRoom" v-if="tableData != ''" type="primary" icon="search" @click="addRoom">添加房间赔率设置</el-button>
            </div>
            <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" 
                :data="tableData" 
                border 
                class="table" 
                ref="multipleTable" >
              
                <el-table-column align="center" type="index" label="序号" sortable width="120">
                </el-table-column>
                <el-table-column align="center" prop="game_id" label="游戏ID" width="100">     
                </el-table-column>
                <el-table-column align="center"  prop="game_cnname" label="游戏名称" width="100">     
                </el-table-column>
                <el-table-column align="center" prop="room_name" label="房间级别" width="100" >
                </el-table-column>
                <el-table-column align="center" prop="room_id" label="房间ID" width="100" >
                </el-table-column>
                <el-table-column align="center" prop="bet_min_limit" label="总投注最小值" width="150" >
                </el-table-column>
                <el-table-column align="center" prop="bet_max_limit" label="总投注最大值" width="150" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count="total">
                </el-pagination>
            </div>
        </div>
         
           

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px">
               
                <el-form-item label="总投注最小值 :">
                    <el-input type="number" v-model="form.betMinLimit" placeholder="请输入总投注最小值"></el-input>
                </el-form-item>
                <el-form-item label="总投注最大值 :">
                    <el-input type="number"  v-model="form.betMaxLimit" placeholder="请输入总投注最大值"></el-input>
                </el-form-item>
                <el-form-item label="房间杀率 :">
                    <el-input type="number" v-model="form.killPercent" placeholder="当前房间杀率 如 13.25"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

           <!-- 添加弹出框 -->
        <el-dialog title="添加房间赔率设置" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add" label-width="120px">
                 <el-form-item label="游戏ID :">
                     <el-select  v-model="gameID" placeholder="请选择游戏" @change="addApart">
                         <el-option v-for="(item,index) in gameListData" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item v-if="addListData.length" label="游戏房间ID :">
                     <el-select v-model="apartID" placeholder="请选择游戏房间">
                         <el-option v-for="(item,index) in addListData" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总投注最小值 :">
                    <el-input type="number" v-model="add.betMinLimit" placeholder="请输入总投注最小值"></el-input>
                </el-form-item>
                <el-form-item label="总投注最大值 :">
                    <el-input type="number" v-model="add.betMaxLimit" placeholder="请输入总投注最大值"></el-input>
                </el-form-item>
                <el-form-item label="房间杀率 :">
                    <el-input type="number" v-model="add.killPercent" placeholder="当前房间杀率 如 13.25"></el-input>
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
import { close } from 'fs';
import { setTimeout } from 'timers';
    export default {
        name: 'odds',
        data() {
            return {
                tableData: [],
                gameListData:[],
                addListData:[],
                loading:true,
                cur_page: 1,
                select_cate: '',
                select_word: '',
                total:0,
                editVisible: false,
                delVisible: false,
                addVisible:false,
                gameID:'',
                apartID:'',
                deleteId:'',
                form: {
                  
                },
                add:{

                },
                idx: -1
            }
        },
        created() {
           
            this.gameList();
            this.change();
        },
        mounted(){
            console.log('mounted');
        },
        computed: {
            
        },
        methods: {
            addApart(){
                this.apartID = '';
                let self = this;
                let data = {
                    gameId: this.gameID
                }
                
                this.$get(this.baseURL+this.site.RoomCodes,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('加载成功')
                         this.addListData = res.data.data;
                     }else {
                        this.$message.error(res.data.failedMsg);   
                     }
                })
            },
            handleCurrentChange(val){
                let self = this;
                let data = {
                    pageIndex:val-1
                }
                if(this.GameId) {
                    data.GameId = this.GameId
                }
                this.change(data);
                this.$message.success(`第${val}页`);
            },
            gameList(){
                let self = this;
                self.$get(this.baseURL+this.site.Games).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('加载成功');
                         setTimeout(() => {
                             this.loading = false;
                         }, 1000);
                         this.gameListData = res.data.data;
                          let length = this.gameListData.length;
                         let key;
                         for (var i = 0; i < length; i++) {
                                if (this.gameListData[i].id == null) {    
                                    key = this.gameListData[i];
                                    this.gameListData.splice(i, 1);
                                    break;
                                }       
                            }    
                            this.gameListData.unshift(key);
                     }else {
                        this.$message.error(res.data.failedMsg);
                     }
                })
            },
            change(pageIndex){
               let self = this;
               this.loading = true;
               if(!this.select_cate) {
                   this.select_cate = 1
               }
              
               let data = {
                   GameId: this.select_cate
               }
                
               Object.assign(data,pageIndex);
              self.$get(this.baseURL+this.site.GetPoolRanges,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.$message.success('加载成功');
                         setTimeout(() => {
                             this.loading = false;
                         }, 1000);
                         this.tableData = res.data.data.data;
                         this.total = res.data.data.totalPages;
                     }else {
                        this.$message.error(res.data.failedMsg);
                     }
                })

            },
            getData() {
               
            },
            search() {
                let self = this;
                let data = {
                    id:self.select_word
                }
                if(self.select_word == '') {
                    this.$message.error(`请输入ID进行搜索`);
                    setTimeout(() => {
                         this.change();
                    }, 2000);
                    return
                }
                self.$get(this.baseURL+this.site.GetPoolRange,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                         let arr = [];
                        arr.push(res.data.data);
                        this.tableData = arr;
                        this.$message.success(`查询成功`);
                    }else {
                        this.$message.error(res.data.failedMsg);
                    }
                })

            },
            addRoom(){
                this.form = {};
                this.addVisible = true;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    betMinLimit: item.bet_min_limit,
                    betMaxLimit: item.bet_max_limit
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.deleteId = row.id;
                this.delVisible = true;
            },
         
            // 保存编辑
            saveEdit() {
                let self = this;
                self.$axios.put(this.baseURL+this.site.UpdatePool,this.form).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.editVisible = false;
                        this.$message.success('修改成功');
                         setTimeout(()=>{
                            this.change();
                        },1500)
                    }else {
                        this.$message.error(res.data.failedMsg);
                    }
                })
            },
            addEdit(){
                let self = this;
                let data = {
                    gameId : this.gameID,
                    roomID:  this.apartID,
                    betMinLimit: this.add.betMinLimit,
                    betMaxLimit:this.add.betMaxLimit,
                    killPercent:this.add.killPercent
                }
                self.$post(this.baseURL+this.site.AddPool,data).then(res=>{
                    if(res.data.code == self.S_CODE) {
                        this.addVisible = false;
                        this.$message.success('添加成功');
                        setTimeout(()=>{
                            this.change();
                        },1500)
                    }else {
                        this.$message.error(res.data.failedMsg)
                    }
                })
            },
            // 确定删除
            deleteRow(){
                let self = this;
                self.$axios.delete(this.baseURL + self.site.DeletePool +'?id='+self.deleteId,).then(res=>{
                if(res.data.code == self.S_CODE) {
                    this.delVisible = false; 
                    this.$message.success('删除成功'); 
                    setTimeout(()=>{
                        this.change();
                    },1500)      
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
    .addRoom {
        margin-left: 80px
    }
</style>
