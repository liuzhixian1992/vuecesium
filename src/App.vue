<template>
  <div id="app">
    <!-- <h2>我是APP组件</h2>
    直接使用   -->
    <!-- <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link> -->
    <!--通过函数跳转-->
    <!-- <button @click="homeClick">首页</button>
    <button @click="aboutClick">关于</button> -->
    <router-view></router-view>
  </div>
</template>
 
<script>
export default {
  name: 'App',
  methods: {
    homeClick() {
      // 通过代码的方式修改路由 vue-router
      // push => pushState
      // this.$router.push('/home')
      this.$router.replace('/home')
      console.log('homeClick');
    },
    aboutClick() {
      // this.$router.push('/about')
      this.$router.replace('/about')
      console.log('aboutClick');
    }
  }
}
</script>
 
<style>
  /*.router-link-active {*/
    /*color: #f00;*/
  /*}*/
 #app{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
 }
  </style>