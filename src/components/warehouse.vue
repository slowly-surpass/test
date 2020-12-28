<template>
  <!--卡片视图-->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!--搜索框-->
      <div style="margin-top: 15px;">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="input" class="input-with-select"></el-input>
          </el-col>
          <el-col :span="16">
            <el-button type="primary" @click="getHouse">搜索</el-button>
            <el-button type="primary" @click="back">返回</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--仓库列表-->
    <template>
      <el-table ref="multipleTable" :data="warehouselist.slice((pagenum-1)*pagesize,pagenum*pagesize)" border tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="house_id" label="仓库编号" width="160"></el-table-column>
        <el-table-column prop="house_name" label="仓库名称" width="240"></el-table-column>
        <el-table-column prop="house_location" label="仓库地址" width="280"></el-table-column>
        <el-table-column prop="house_info" label="仓库说明" width="300"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" >
              <el-button type="primary" class="el-icon-edit" size="mini" @click="showEditDialog(scope.row.house_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" class="el-icon-delete" size="mini" @click="remove(scope.row.house_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--修改用户对话框-->
      <el-dialog title="修改" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
          <el-form-item label="仓库编号">
            <el-input v-model="editForm.house_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="editForm.house_name"></el-input>
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="editForm.house_location"></el-input>
          </el-form-item>
          <el-form-item label="仓库说明">
            <el-input v-model="editForm.house_info"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加用户对话框-->
      <el-dialog title="添加仓库" :visible.sync="addDialogVisible" width="30%" :before-close="closeAddDialog">
        <el-form :model="addForm" :rules="rules" ref="editFormRef" label-width="100px">
          <el-form-item label="仓库编号">
            <el-input v-model="addForm.house_id"></el-input>
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="addForm.house_name"></el-input>
          </el-form-item>
          <el-form-item label="仓库地址">
            <el-input v-model="addForm.house_location"></el-input>
          </el-form-item>
          <el-form-item label="仓库说明">
            <el-input v-model="addForm.house_info"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="addInfo">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </el-card>
</template>

<script>
  export default {
    name: "warehouse",
    data() {
      return {
        //搜索框内容
        input: '',
        //所有客户信息列表
        warehouselist: [],
        //当前页
        pagenum: 1,
        //当前页面尺寸
        pagesize: 5,
        //总页数
        total: 0,
        //多选
        multipleSelection: [],
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的客户信息
        editForm: [],
        //控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        //添加信息
        addForm: [],
        //表单验证规则
        rules: {
          // contact_number: [
          //   { required: true, message: '请输入联系方式', trigger: 'blur' }
          // ]
        },
        editFormRef: {
          // contact_number: ''
        }
      }
    },
    created() {
      this.getHouse();
    },
    methods: {
      getHouse(){
        this.total = 0;
        this.warehouselist = [];
        this.$http.get(this.HOST+'/house', {params:{search: this.input}}).then(res=>{
          // console.log(res)
          if (res.status!=200 || res.data.code==1){
            this.$message.error('获取数据失败') //弹出失败提示
          }
          else{
            this.total = res.data.length;
            this.warehouselist = res.data;
            // console.log(this.total)
          }
        })
        // console.log(this.total)
      },
      //搜索框返回显示全部数据
      back(){
        this.input = ""
        this.getHouse()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(newsize){
        this.pagesize = newsize
        // console.log(this.pagesize)
        // this.getCustomer()
      },
      handleCurrentChange(newpage){
        this.pagenum = newpage
        // console.log(this.pagenum)
      },
      //请求选中记录的信息
      showEditDialog(id){
        this.$http.get(this.HOST+'/gethouse', {params:{id: id}}).then(res=>{
          // console.log(res)
          if (res.status!=200){
            this.$message.error('获取数据失败') //弹出失败提示
          }
          else{
            this.editForm = res.data[0];
            // console.log(this.editForm)
            this.editDialogVisible= true
          }
        })
      },
      //修改信息并提交
      editInfo(){
        // this.$refs[editFormRef].validate(valid =>{
        //   if(!valid) return
          //发起请求
          if(!this.editForm.house_info)
            this.editForm.house_info = ""
          this.$http.get(this.HOST+'/sethouse', {params:{
              house_id: this.editForm.house_id,
              house_name: this.editForm.house_name,
              house_location: this.editForm.house_location,
              house_info: this.editForm.house_info,
            }}).then(res=>{
            // console.log(res)
            if (res.status!=200 || res.data.code!=0){
              this.$message.error('修改数据失败') //弹出失败提示
            }
            else{
              //关闭对话框
              this.editDialogVisible = false
              //刷新数据列表
              this.getHouse()
              //提示成功
              this.$message.success('修改数据成功')
            }
          })
        // })
      },
      //删除信息
      remove(id){
        //弹框询问用户是否确定删除
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.get(this.HOST+'/deletehouse', {params:{
              house_id: id
            }}).then(res=>{
            if (res.status!=200 || res.data.code==1){
              this.$message.error('修改数据失败') //弹出失败提示
            }
            else{
              this.$message({type: 'success', message: '删除成功!'})
              this.getHouse()
            }
          })
        }).catch(() => {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加窗口
      showAddDialog(){
        this.addDialogVisible = true
      },
      closeAddDialog(){
        this.addDialogVisible = false
        this.addForm = []
      },
      //添加接口
      addInfo(){
        // this.$refs[editFormRef].validate(valid =>{
        //   if(!valid) return
          //发起请求
          this.$http.get(this.HOST+'/addhouse', {params:{
              house_id: this.addForm.house_id,
              house_name: this.addForm.house_name,
              house_location: this.addForm.house_location,
              house_info: this.addForm.house_info,
            }}).then(res=>{
            // console.log(res)
            if (res.status!=200 || res.data.code!=0){
              this.$message.error('添加数据失败') //弹出失败提示
            }
            else{
              //关闭对话框
              this.addDialogVisible = false
              //清空添加信息
              this.addForm = []
              //刷新数据列表
              this.getHouse()
              //提示成功
              this.$message.success('添加数据成功')
            }
          })
        // })
      }
    }
  }
</script>

<style lang="less" scoped>
  /*.el-input {*/
  /*  width: 500px;*/
  /*}*/
  .el-select {
    width: 100px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  /*.box-card {*/
  /*  width: 480px;*/
  /*}*/

</style>
