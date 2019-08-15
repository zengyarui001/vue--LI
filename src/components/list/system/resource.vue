<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->

            </div>
            
            <el-form ref="form" :model="potence" label-width="100px">
                <el-form-item label="菜单资源 :">
                        <el-tree
                            :data="alloList"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false"
                            @check = "treeData"
                            :props="defaultProps">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                            <el-button
                                style="margin-left:20px" 
                                type="text"
                                size="mini"
                                @click="() => append(data)">
                                添加资源
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => remove(node, data)">
                                删除资源
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => modification(node, data)">
                                修改资源
                            </el-button>
                            </span>
                        </span>
                        </el-tree>      
               </el-form-item>      
            </el-form>

         <!-- 添加弹出框 -->
        <el-dialog title="添加资源" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px"> 
                <el-form-item label="资源名称:" style="width:310px">
                    <el-input v-model="form.resourceName" ></el-input>
                </el-form-item>
                <el-form-item label="资源URL:" style="width:310px">
                    <el-input v-model="form.resourceUrl"></el-input>
                </el-form-item>
                 <el-form-item label="资源类型 :">
                    <el-select  v-model="form.resourceType" placeholder="请选择资源类型" >
                        <el-option v-for="(item,index) in resType" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
               </el-form-item>
               <el-form-item label="请求方式 :">
                    <el-select  v-model="form.requestMethod" placeholder="请选择资源类型" >
                        <el-option v-for="(item,index) in requestType" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
               </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改资源" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="amend" label-width="100px">
                 <el-form-item label="资源名称:" style="width:310px">
                    <el-input v-model="amend.resourceName" ></el-input>
                </el-form-item>
                <el-form-item label="资源URL:" style="width:310px">
                    <el-input v-model="amend.resourceUrl"></el-input>
                </el-form-item>
                 <el-form-item label="资源类型 :">
                    <el-select  v-model="amend.resourceType" placeholder="请选择资源类型" >
                        <el-option v-for="(item,index) in resType" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
               </el-form-item>
               <el-form-item label="请求方式 :">
                    <el-select  v-model="amend.requestMethod" placeholder="请选择资源类型" >
                        <el-option v-for="(item,index) in requestType" :key="index" :label="item.name" :value="item.id"></el-option>
                   </el-select>
               </el-form-item>
                <el-form-item label="是否可用:">
                     <el-select v-model="isResour" placeholder="可用">
                        <el-option label="可用" :value=true></el-option>
                        <el-option label="不可用" :value=false></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
    </div>
</template>

<script>
import { setTimeout } from 'timers';
    export default {
        name: 'resource',
        data() {
            return {
                tableData: [],
                alloList:[],
                checkedKeys:[],
                addVisible:false,
                delVisible:false,
                editVisible:false,
                isResour:'',
                resType:[],
                requestType:[],
                addParentId:'',
                removeId:'',
                form:{

                },
                editData:{},
                amend:{
            
                },
                potence:{
                    type: [],
                    already:[]
                },
                  defaultProps: {
                    children: 'children',
                    label: 'resourcename'
                }
            }
        },
        created() {
            this.GetResources();
            this.resouType();
           
        },
        computed: {
           
        },
        methods: {
            resouType(){
                let self = this;
                self.$get(self.baseURL+this.site.Resource).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.resType = res.data.data;
                     }
                })
                self.$get(self.baseURL+this.site.RequestMethods).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.requestType = res.data.data;
                     }
                })
            },
           GetResources(data){
                this.$get(this.baseURL+this.site.GetResources,data).then(res=>{
                    if(res.data.code == this.S_CODE) {  
                       this.alloList = res.data.data;
                    }
                })
            },
            treeData(l,t){
                this.checkedKeys = t.checkedKeys;
            },
            append(data) {
                this.addParentId = data.id;
                this.addVisible = true;
               
            },
            addEdit(){
                let self = this;
                let data = {
                    parentId:this.addParentId
                }
                Object.assign(data,this.form);
                self.$post(self.baseURL+self.site.AddResource,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.addVisible = false;
                         this.$message.success('添加成功');
                         setTimeout(()=>{
                             this.GetResources();
                         },1500)
                         this.form = {};
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }
                })
            },

            remove(node, data) {
                this.delVisible = true;
                this.removeId = data.id;
             },
             deleteRow(){
                 let self = this;
                 self.$axios.delete(self.baseURL + self.site.DeleteResource + '?id=' + this.removeId).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.delVisible = false;
                         this.$message.success('添加成功');
                         setTimeout(()=>{
                             this.GetResources();
                         },1500)
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }
                 })
             },
             modification(node, data){
                 this.editData = data;
                 this.amend = {
                    id:this.editData.id,
                    resourceName:this.editData.resourcename,
                    resourceUrl:this.editData.resourceurl,
                 }
                
                 this.editVisible = true;
             },
             saveEdit(){
                if(this.isResour == '') {
                    this.isResour = true;
                }
                let self = this;
                let data = {
                    available : this.isResour
                }
              
                if(!this.amend.resourceType) {
                    this.amend.resourceType = this.editData.resourcetype
                }
                if(!this.amend.requestmethod) {
                    this.amend.requestmethod = this.editData.requestmethod
                }
                Object.assign(data,this.amend);
                self.$axios.put(self.baseURL+self.site.UpdateResource,data).then(res=>{
                     if(res.data.code == self.S_CODE) {
                         this.editVisible = false;
                         this.$message.success('修改成功');
                         setTimeout(()=>{
                             this.GetResources();
                         },1500)
                         this.form = {};
                     }else {
                         this.$message.error(res.data.failedMsg);
                     }
                })
                
             }
            },
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
    .alreaButton {
        width: 50px;
        margin-top: 5px
    }
    .mr10{
        margin-right: 10px;
    }
    .ml10 {
        margin-left: 10px;
    }
    .el-tree {
        color: #f08047;
       
    }
</style>
