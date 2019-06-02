<template>
  <div class="home-promotion">
    <h4 class="home-promotion-title">限时促销</h4>
    <!-- 主打产品 -->
    <div class="home-promotion-item" @click="goDetail(promotion.source)">
      <div class="home-promotion-item-imgwrap">
        <img class="home-promotion-item-imgwrap-img" :src="promotion.imgUrl">
        <img class="home-promotion-item-imgwrap-tag" :src="promotion.labels[0].labelUrl">
      </div>
      <div class="home-promotion-item-wordwrap">
        <p class="home-promotion-item-wordwrap-name">{{promotion.goodsName}}</p>
        <p class="home-promotion-item-wordwrap-desc">{{promotion.description}}</p>
        <p class="home-promotion-item-wordwrap-price" @click.stop>
          <b v-html="largeSize(formatCurrency(promotion.price))"></b>
          <s>{{promotion.marketPrice | formatCurrency('￥')}}</s>
          <van-icon name="add" class="add-to-cart" @click="addToCart(promotion)"/>
        </p>
      </div>
    </div>
    <!-- 剩余产品 -->
    <swiper :options="swiperOption" class="home-promotion-swiper">
      <swiperSlide
        v-for="(item, index) in promotionChild"
        :key="index"
        @click.native="goDetail(item.source)"
        style="padding-right:0.12rem; box-sizing:border-box;"
      >
        <Cell :product="item"></Cell>
      </swiperSlide>
    </swiper>
  </div>
</template>
<script>
import Cell from "@/components/Cell.vue";
import axios from "axios";
import url from "@/service.config.js";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    Cell,
    swiper,
    swiperSlide
  },
  data() {
    return {
      promotion: { labels: [{ labelUrl: "" }] }, // 限时促销
      promotionChild: [{ labels: [{ labelUrl: "" }] }], // 限时促销
      swiperOption: {
        slidesPerView: 3.2
      }
    };
  },
  beforeCreate() {
    // 获取限时促销
    axios.get(url.getPromotion).then(res => {
      this.promotion = res.data[0].items[0];
      // console.log(this.promotion);
    });
    axios.get(url.getPromotionChild).then(res => {
      this.promotionChild = res.data[0].items;
      // console.log(this.promotionChild);
    });
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
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.home-promotion {
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
</style>
