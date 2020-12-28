<template>
  <el-container class="container">
    <!--头部-->
    <el-header>
      <div>仓库基本信息管理系统</div>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <!--侧边栏菜单-->
        <el-menu router :default-active="path">
          <el-menu-item index="/customer" @click="NavState('/customer')">
            <i class="el-icon-s-custom"></i>
            <span>客户基本信息管理</span>
          </el-menu-item>
          <el-menu-item index="/warehouse" @click="NavState('/warehouse')">
            <i class="el-icon-house"></i>
            <span slot="title">仓库基本信息管理</span>
          </el-menu-item>
          <el-menu-item index="/product" @click="NavState('/product')">
            <i class="el-icon-document"></i>
            <span slot="title">产品基本信息管理</span>
          </el-menu-item>
          <el-menu-item index="/user" @click="NavState('/user')">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/store" @click="NavState('/store')">
            <i class="el-icon-user"></i>
            <span slot="title">查看产品存储信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--右侧内容-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
  import axios from 'axios'
  export default {
    name: "Index",
    data(){
      return {
        info:{},
        path: '/customer'
      }
    },
    methods: {
      NavState(path){
        // window.sessionStorage.setItem('path',path)
        this.path = path
      }
    }
    // mounted () {
    //   axios
    //     .get(this.HOST+'/index')
    //     .then(res => (this.info = res.data))
    // }
  };
</script>

<style>
  .container {
    height: 100vh;
  }
  .el-header {
    background-color: #000000;
    display: flex;
    color: #ffffff;
    font-size: 20px;
    align-items: center;
  }

  .el-aside {
    background-color: #000000;
  }
  .el-menu-item {
    height: 40px;
    font-size: 13px;
    align-items: center;
    display: flex;
    color: #dddddd;
    background-color: black;
  }
  .el-menu-item.is-active {
    color: #dddddd !important;
    background-color: #0aaa7f !important;
  }
  .el-menu-item:hover{
    color: #ffffff;
    background-color: #000000;
  }

  .el-main {
    background-color: #eaedf1;
  }
  body {
    margin: 0;
  }

</style>
