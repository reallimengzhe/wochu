<template>
  <div class="home">
    <!-- 标题栏 -->
    <HomeHeader></HomeHeader>
    <!-- 轮播图 -->
    <HomeCarousel></HomeCarousel>
    <!-- 活动入口 -->
    <HomeActivity></HomeActivity>
    <!-- 我厨快报 -->
    <HomeNews></HomeNews>
    <!-- 广告 -->
    <HomeAd></HomeAd>
    <!-- 限时促销 -->
    <HomePromotion></HomePromotion>
    <!-- 秒变大厨 -->
    <HomeCook></HomeCook>
    <!-- 商品列表 -->
    <div class="home-product" v-for="(item, index) in productList" :key="index">
      <div v-if="item.template_type == '4'" class="home-product-item">
        <img :src="item.items[0].imgUrl">
      </div>
      <div v-if="item.template_type == '7'" class="home-product-child-wrap">
        <div
          v-for="(item, index) in item.items"
          :key="index"
          class="home-product-child"
          @click="goDetail(item.goodsGuid)"
        >
          <img v-if="item.labels[0]" :src="item.labels[0].labelUrl" class="home-product-child-tag">
          <img :src="item.imgUrl" class="home-product-child-img">
          <p>{{item.goodsName}}</p>
          <s
            :class="item.marketPrice == item.price ? 'hidden' : '' "
          >{{item.marketPrice | formatCurrency('￥')}}</s>
          <b>{{item.price | formatCurrency('￥')}}</b>
          <van-icon name="add" class="add-to-cart" @click="addToCart(item)" @click.stop/>
        </div>
      </div>
    </div>
    <footerbar ref="footerbar"></footerbar>
  </div>
</template>
<script>
// @ is an alias to /src
import HomeHeader from "@/components/HomeHeader.vue";
import HomeCarousel from "@/components/HomeSwiper.vue";
import HomeActivity from "@/components/HomeActivity.vue";
import HomeNews from "@/components/HomeNews.vue";
import HomeAd from "@/components/HomeAd.vue";
import HomePromotion from "@/components/HomePromotion.vue";
import HomeCook from "@/components/HomeCook.vue";
import footerbar from "@/components/Footerbar.vue";
import axios from "axios";
import url from "@/service.config.js";
import { mapState } from "vuex";

export default {
  components: {
    HomeHeader,
    HomeCarousel,
    HomeActivity,
    HomeNews,
    HomeAd,
    HomePromotion,
    HomeCook,
    footerbar
  },
  data() {
    return {
      promotion: { labels: [{ labelUrl: "" }] }, // 限时促销
      promotionChild: [{ labels: [{ labelUrl: "" }] }], // 限时促销
      cook: { labels: [{ labelUrl: "" }] }, // 秒变大厨
      cookChild: [{ labels: [{ labelUrl: "" }] }], // 秒变大厨
      productList: [{ labels: [{ labelUrl: "" }] }] // 商品列表
    };
  },
  beforeCreate() {
    localStorage.active = 0;
    // 获取商品列表
    axios.get(url.getProductList).then(res => {
      this.productList = res.data;
      // console.log(this.productList);
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    // 货币格式化
    formatCurrency(value, currency, decimals) {
      value = parseFloat(value);
      if (!isFinite(value) || (!value && value !== 0)) return "";
      currency = currency != null ? currency : "￥";
      decimals = decimals != null ? decimals : 2;
      var stringified = Math.abs(value).toFixed(decimals);
      var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
      var i = _int.length % 3;
      var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? "," : "") : "";
      var _float = decimals ? stringified.slice(-1 - decimals) : "";
      var sign = value < 0 ? "-" : "";
      return (
        sign +
        currency +
        head +
        _int.slice(i).replace(/(\d{3})(?=\d)/g, "￥1,") +
        _float
      );
    },
    // 突出价格
    largeSize(value) {
      if (value) {
        let zhengshu = value.split("￥")[1].split(".")[0];
        let xiaoshu = value.split("￥")[1].split(".")[1];
        return `
            <i>￥</i>
            <b>${zhengshu}</b>
            <span>.${xiaoshu}</span>
        `;
      }
    },
    // 跳转到商品详情
    goDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
    // 添加至购物车
    addToCart(item) {
      console.log(item);
      if (!localStorage.token) {
        this.$toast.fail("请先登录");
        setTimeout(() => {
          this.$router.push("/sign");
        }, 500);
      } else {
        axios({
          url: url.addToCart,
          method: "post",
          data: {
            // 添加至购物车的商品数据
            user: localStorage.token, // 用户 ID
            goodsGuid: item.source, // 商品自带 ID
            picUrl: item.imgUrl, // 缩略图
            goodsName: item.goodsName, // 商品名称
            price: item.price, // 商品现价
            marketPrice: item.marketPrice, // 商品原价
            count: 1 // 默认加一
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$toast.success(res.data.message);
              // 重新获取购物车数量
              this.$refs.footerbar.getCartCount();
            } else if (res.data.code == 201) {
              this.$toast.success(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.home {
  position: relative;
  padding-bottom: 50px;
  &-promotion {
    margin-top: 0.24rem;
    background: #fff;
    overflow: hidden;
    &-title {
      border-left: 0.1rem $green solid;
      margin: 0.24rem;
      font-size: 0.32rem;
      padding-left: 0.24rem;
    }
    &-item {
      display: flex;
      padding: 0.24rem;
      &-imgwrap {
        width: 2.6rem;
        height: 2.6rem;
        position: relative;
        &-img {
          width: 100%;
          height: 100%;
        }
        &-tag {
          position: absolute;
          top: 0;
          width: 0.66rem;
        }
      }
      &-wordwrap {
        flex: 1;
        margin-left: 0.24rem;
        position: relative;
        &-name {
          font-size: 0.32rem;
          line-height: 0.5rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        &-desc {
          font-size: 0.26rem;
          line-height: 0.5rem;
          margin-top: 0.1rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-weight: lighter;
        }
        &-price {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0.52rem;
          b {
            color: $orange;
            i {
              font-style: normal;
            }
            b {
              font-size: 0.4rem;
              margin-left: -0.05rem;
            }
            span {
              margin-left: -0.05rem;
            }
          }
        }
      }
    }
    &-swiper {
      padding: 0.24rem;
    }
    &-child {
      box-sizing: border-box;
      padding-right: 0.24rem;
      border-radius: 0.1rem;
      background: #fff;
      box-shadow: $box-shadow;
      padding: 0.1rem;
      overflow: hidden;
      position: relative;
      &-tag {
        width: 0.6rem;
        position: absolute;
        top: 0;
        left: 0;
      }
      &-img {
        width: 100%;
      }
      &-name {
        margin-top: 0.24rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      s {
        display: block;
        color: #bababa;
      }
      b {
        color: $orange;
      }
      i {
        position: absolute;
        bottom: 0.12rem;
        right: 0.12rem;
      }
    }
  }
  &-product {
    padding-top: 0.24rem;
    background: #fff;
    &-item {
      width: 100%;
      img {
        width: 100%;
      }
    }
    &-child-wrap {
      padding: 0 0.24rem 0.24rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &-child {
      margin-top: 0.24rem;
      width: 29%;
      border-radius: 0.1rem;
      background: #fff;
      padding: 0.1rem;
      box-shadow: $box-shadow;
      overflow: hidden;
      position: relative;
      &-tag {
        width: 0.6rem;
        position: absolute;
        top: 0;
        left: 0;
      }
      &-img {
        width: 100%;
      }
      p {
        margin-top: 0.24rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      s {
        display: block;
        color: #bababa;
      }
      b {
        color: $orange;
      }
      i {
        position: absolute;
        bottom: 0.1rem;
        right: 0.1rem;
      }
    }
  }
}
</style>
