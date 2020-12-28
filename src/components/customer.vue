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
            <el-button type="primary" @click="getCustomer">搜索</el-button>
            <el-button type="primary" @click="back">返回</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--客户列表-->
    <template>
      <el-table ref="multipleTable" :data="customerlist.slice((pagenum-1)*pagesize,pagenum*pagesize)" border tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="custom_id" label="客户编号" width="100"></el-table-column>
        <el-table-column prop="custom_name" label="客户姓名" width="120"></el-table-column>
        <el-table-column prop="custom_type" label="客户类型" width="140"></el-table-column>
        <el-table-column prop="contacts" label="联系人" width="120"></el-table-column>
        <el-table-column prop="contact_number" label="联系电话" width="140"></el-table-column>
        <el-table-column prop="address" label="通信地址" width="200"></el-table-column>
        <el-table-column prop="remarks" label="备注" width="200"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" >
              <el-button type="primary" class="el-icon-edit" size="mini" @click="showEditDialog(scope.row.custom_id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" class="el-icon-delete" size="mini" @click="remove(scope.row.custom_id)"></el-button>
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
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
          <el-form-item label="客户编号">
            <el-input v-model="editForm.custom_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="客户姓名" prop="custom_name">
            <el-input v-model="editForm.custom_name"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="custom_type">
            <el-input v-model="editForm.custom_type"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="editForm.contacts"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contact_number">
            <el-input v-model="editForm.contact_number"></el-input>
          </el-form-item>
          <el-form-item label="通信地址" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editInfo('editFormRef')">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" :before-close="closeAddDialog">
        <el-form :model="addForm" :rules="rules" ref="editFormRef" label-width="100px">
          <el-form-item label="客户编号">
            <el-input v-model="addForm.custom_id"></el-input>
          </el-form-item>
          <el-form-item label="客户姓名" prop="custom_name">
            <el-input v-model="addForm.custom_name"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="custom_type">
            <el-input v-model="addForm.custom_type"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="addForm.contacts"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contact_number">
            <el-input v-model="addForm.contact_number"></el-input>
          </el-form-item>
          <el-form-item label="通信地址" prop="address">
            <el-input v-model="addForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="addInfo('editFormRef')">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </el-card>
</template>

<script>
  export default {
      name: "customer",
    data() {
        return {
          //搜索框内容
          input: '',
          //所有客户信息列表
          customerlist: [],
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
            contact_number: [
              { required: true, message: '请输入联系方式', trigger: 'blur' },
              // { validator: checkMobile, trigger: 'blur'}
            ]
          },
          editFormRef: {
            contact_number: ''
          }
        }
    },
    created() {
        this.getCustomer();
    },
    methods: {
      getCustomer(){
        this.total = 0;
        this.customerlist = [];
        this.$http.get(this.HOST+'/customer', {params:{search: this.input}}).then(res=>{
          // console.log(res)
          if (res.status!=200 || res.data.code==1){
            this.$message.error('获取数据失败') //弹出失败提示
          }
          else{
            this.total = res.data.length;
            this.customerlist = res.data;
            // console.log(this.total)
          }
        })
        // console.log(this.total)
      },
      //搜索框返回显示全部数据
      back(){
        this.input = ""
        this.getCustomer()
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
        this.$http.get(this.HOST+'/getcustomer', {params:{id: id}}).then(res=>{
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
      editInfo(editFormRef){
        this.$refs[editFormRef].validate(valid =>{
          if(!valid) return
          //发起请求
          if(!this.editForm.remarks)
            this.editForm.remarks = ""
          this.$http.get(this.HOST+'/setcustomer', {params:{
              custom_id: this.editForm.custom_id,
              custom_name: this.editForm.custom_name,
              custom_type: this.editForm.custom_type,
              contacts: this.editForm.contacts,
              contact_number: this.editForm.contact_number,
              address: this.editForm.address,
              remarks: this.editForm.remarks
            }}).then(res=>{
            // console.log(res)
            if (res.status!=200 || res.data.code!=0){
              this.$message.error('修改数据失败') //弹出失败提示
            }
            else{
              //关闭对话框
              this.editDialogVisible = false
              //刷新数据列表
              this.getCustomer()
              //提示成功
              this.$message.success('修改数据成功')
            }
          })
        })
      },
      //删除信息
      remove(id){
        //弹框询问用户是否确定删除
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.$http.get(this.HOST+'/deletecustomer', {params:{
            custom_id: id
          }}).then(res=>{
            if (res.status!=200 || res.data.code==1){
              this.$message.error('修改数据失败') //弹出失败提示
            }
            else{
              this.$message({type: 'success', message: '删除成功!'})
              this.getCustomer()
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
      addInfo(editFormRef){
        this.$refs[editFormRef].validate(valid =>{
          if(!valid) return
          //发起请求
          this.$http.get(this.HOST+'/addcustomer', {params:{
              custom_id: this.addForm.custom_id,
              custom_name: this.addForm.custom_name,
              custom_type: this.addForm.custom_type,
              contacts: this.addForm.contacts,
              contact_number: this.addForm.contact_number,
              address: this.addForm.address,
              remarks: this.addForm.remarks
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
              this.getCustomer()
              //提示成功
              this.$message.success('添加数据成功')
            }
          })
        })
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
