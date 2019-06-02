<template>
  <div class="setting">
    <van-nav-bar title="设置" left-text="返回" left-arrow @click-left="$router.go(-1)"/>
    <van-cell title="个人资料" is-link style="margin-top:10px"/>
    <van-cell title="账户安全" is-link/>
    <van-cell title="设置支付密码" is-link/>
    <p class="setting-signout" @click="signout">退出账号</p>
  </div>
</template>

<script>
export default {
  methods: {
    signout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("token_id");
      this.$router.go(-1);
      this.$toast.success("退出成功");
    }
  }
};
</script>

<style lang="scss">
.setting {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  &-signout {
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 1rem;
    background: #fff;
    text-align: center;
    color: #fe731b;
  }
}
</style>