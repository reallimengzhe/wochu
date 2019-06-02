<template>
  <div class="cell">
    <img v-if="product.labels[0]" :src="product.labels[0].labelUrl" class="cell-tag">
    <img :src="product.imgUrl" class="cell-img">
    <p class="cell-name">{{product.goodsName}}</p>
    <s>{{product.marketPrice | formatCurrency('￥')}}</s>
    <b>{{product.price | formatCurrency('￥')}}</b>
    <van-icon name="add" class="add-to-cart" @click="addToCart(product)" @click.stop/>
  </div>
</template>
<script>
import axios from "axios";
import url from "@/service.config.js";
import bus from "@/assets/js/bus.js";
export default {
  // 父组件通过props属性传递进来的数据
  props: {
    product: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
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
              // 向 FooterBar 组件发送请求，重新获取购物车数量
              this.getCartCount();
            } else if (res.data.code == 201) {
              this.$toast.success(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 重新获取购物车数量
    getCartCount() {
      bus.$emit("getCartCount");
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.cell {
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
</style>
