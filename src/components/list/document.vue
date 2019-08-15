<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 运营管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column align="center" type="index" label="序号" sortable width="150">
                </el-table-column>
                <el-table-column align="center" prop="key" label="文件名" width="250" >
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  @click="downLoadFile(scope.$index, scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
           
        </div>

     
    </div>
</template>

<script>
    export default {
        name: 'document',
        data() {
            return {
             
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
        
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            downLoadFile(v,i) {
                window.location = 'http://192.168.87.135:8080' + i.value;   
            },
        
            getData() {
                let self = this;
                self.$get(self.baseURL+this.site.Document).then(res=>{
                     
                     if(res.data.code == self.S_CODE) {    
                         console.log(res.data)  
                          self.tableData = res.data.data;
                     }
            
                })
            },
      
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
