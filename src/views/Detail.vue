<template>
  <div class="detail">
    <!-- 返回 -->
    <van-icon name="arrow-left" class="detail-back" @click="$router.go(-1)"/>
    <!-- 主图 -->
    <van-swipe :autoplay="3000" class="detail-swipe" @change="onChange">
      <van-swipe-item v-for="(image, index) in detail.imgLoop" :key="index">
        <img v-lazy="image">
      </van-swipe-item>
      <div
        class="custom-indicator"
        slot="indicator"
        v-if="detail.imgLoop"
      >{{ current + 1 }}/{{detail.imgLoop.length}}</div>
    </van-swipe>
    <!-- 商品信息 -->
    <div class="detail-info">
      <img v-if="detail.goodsLabel" class="detail-info-tag" :src="detail.goodsLabel.labelUrl">
      <p class="detail-info-name">{{detail.goodsName}}</p>
      <p class="detail-info-desc">{{detail.description}}</p>
      <p class="detail-info-price">
        <b>{{detail.price | formatCurrency()}}</b>
        <s>{{detail.marketPrice | formatCurrency()}}</s>
      </p>
    </div>
    <img
      style="width:100%; margin:0.32rem 0;"
      src="http://wmall.wochu.cn/h5/mall/img/vueimg/navigation.png"
    >
    <!-- 参数 -->
    <table class="detail-param">
      <tr>
        <td>产地：</td>
        <td>{{detail.origin1}}</td>
        <td>保质期：</td>
        <td>{{detail.shelfLife}}</td>
      </tr>
      <tr>
        <td>规格：</td>
        <td>{{detail.specification}}</td>
        <td>储存条件：</td>
        <td>{{detail.storageCondition}}</td>
      </tr>
    </table>
    <!-- 介绍 -->
    <div class="detail-intro">
      <img v-for="(item,index) in detail.descriptionDetail" :key="index" v-lazy="item">
      <img src="https://img.wochu.cn/upload/ec815862-7215-4dc8-9b87-e9c9157a58b6.jpg">
    </div>
    <!-- 加入购物车 -->
    <van-goods-action style="z-index: 4">
      <van-goods-action-mini-btn :info="cartCount" icon="cart-o" to="/cart" @click="changeActive"/>
      <van-goods-action-big-btn class="add-to-cart-btn" text="加入购物车" @click="showBase = true"/>
    </van-goods-action>
    <div v-if="showBase" class="detail-cart" @touchmove.prevent @mousewheel.prevent>
      <div class="detail-cart-blank" @click="showBase = false"></div>
      <div class="detail-cart-product">
        <van-icon name="clear" class="close" @click="showBase = false"/>
        <img class="detail-cart-product-img" :src="detail.picUrl">
        <div class="detail-cart-product-price">
          <p>商品售价</p>
          <b>{{detail.price | formatCurrency()}}</b>
          <s>{{detail.marketPrice | formatCurrency()}}</s>
          <van-stepper v-model="count"/>
        </div>
      </div>
      <van-button size="large" class="add-to-cart-btn" @click="addToCart">加入购物车</van-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "@/service.config.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      detail: [], // 商品详情
      current: 0, // 当前轮播图索引
      showBase: false,
      count: 1,
      cartCount: 0
    };
  },
  created() {
    // 获取商品详情
    axios({
      url: url.getDetail,
      method: "get",
      params: {
        id: this.$route.params.id
      }
    })
      .then(res => {
        if (res.data) {
          this.detail = res.data;
          console.log(this.detail);
        } else {
          this.$dialog
            .alert({
              title: "测试项目",
              message: "数据库暂未导入此商品，请尝试其他商品。"
            })
            .then(() => {
              this.$router.go(-1);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
    // 获取购物车数量
    this.getCartCount();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    // 获取购物车数量
    getCartCount() {
      axios({
        url: url.getCart,
        method: "get",
        params: {
          // 通过用户id查找购物车数据
          user: localStorage.token
        }
      })
        .then(res => {
          // console.log(res.data);
          this.cartCount = res.data.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 轮播图索引
    onChange(index) {
      this.current = index;
    },
    // 导航索引
    changeActive() {
      localStorage.active = "2";
    },
    // 加入购物车
    addToCart() {
      // 检查用户是否登录 koa-session
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
            user: localStorage.token, // 用户 ID
            productId: this.detail._id, // 商品 _ID
            goodsGuid: this.detail.goodsGuid, // 商品自带 ID
            picUrl: this.detail.picUrl, // 缩略图
            goodsName: this.detail.goodsName, // 商品名称
            price: this.detail.price, // 商品现价
            marketPrice: this.detail.marketPrice, // 商品原价
            count: this.count // 商品数量
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$toast.success("加入成功");
            } else if (res.data.code == 201) {
              this.$toast.success(res.data.message);
            }
            this.getCartCount(); // 重新获取购物车数量
            this.showBase = false; // 关闭弹出框
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
.detail {
  position: relative;
  &-back {
    position: fixed;
    top: 0.24rem;
    left: 0.24rem;
    width: 0.6rem;
    height: 0.6rem;
    background: $opacity-btn;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 0.6rem;
    z-index: 3;
  }
  &-swipe {
    width: 100%;
    position: relative;
    img {
      width: 100%;
    }
    .custom-indicator {
      position: absolute;
      bottom: 0.8rem;
      right: 0.24rem;
      width: 0.6rem;
      height: 0.6rem;
      background: $opacity-btn;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      line-height: 0.6rem;
    }
  }
  &-info {
    margin: -0.5rem auto 0;
    box-sizing: border-box;
    width: 7rem;
    background: #fff;
    box-shadow: $box-shadow;
    border-radius: 0.2rem;
    padding: 0.24rem;
    position: relative;
    z-index: 2;
    &-tag {
      position: absolute;
      top: -0.3rem;
      width: 0.6rem;
    }
    &-name {
      font-size: 0.36rem;
      color: $black;
      line-height: 1rem;
    }
    &-desc {
      font-size: 0.28rem;
    }
    &-price {
      margin-top: 0.24rem;
      b {
        font-size: 0.36rem;
        color: $orange;
      }
      s {
        margin-left: 0.24rem;
        color: $gray;
      }
    }
  }
  &-param {
    box-sizing: border-box;
    width: 100%;
    background: #fff;
    padding: 0.24rem;
    td {
      width: 25%;
      font-size: 0.28rem;
      line-height: 0.6rem;
      &:nth-child(odd) {
        color: $gray;
      }
      &:nth-child(even) {
        color: $black;
      }
    }
  }
  &-intro {
    width: 100%;
    img {
      width: 100%;
    }
  }
  &-cart {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 4;
    display: flex;
    flex-direction: column;
    &-blank {
      flex: 1;
      background: rgba(34, 34, 34, 0.5);
    }
    &-product {
      margin-bottom: 50px;
      background: #fff;
      padding: 0.76rem 0.24rem;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      position: relative;
      &-img {
        width: 2.2rem;
        height: 2.2rem;
        border: 1px solid $gray;
        border-radius: 0.2rem;
      }
      &-price {
        flex: 1;
        margin-left: 0.24rem;
        position: relative;
        p {
          font-size: 0.28rem;
          font-weight: lighter;
        }
        b {
          font-size: 0.36rem;
          color: $orange;
          line-height: 0.72rem;
        }
        s {
          margin-left: 0.24rem;
        }
        .van-stepper {
          position: absolute;
          bottom: 0;
        }
      }
    }
    .add-to-cart-btn {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
