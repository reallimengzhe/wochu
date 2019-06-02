<template>
  <div id="app">
    <router-view></router-view>
    <router-view name="footer-bar"></router-view>
  </div>
</template>

<script>
// import FooterBar from "@/components/Footerbar.vue";
export default {
  components: {
    // FooterBar
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
</style>
