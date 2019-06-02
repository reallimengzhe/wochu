<template>
  <div class="subcategory">
    <van-nav-bar :title="title" left-text="返回" left-arrow @click-left="$router.go(-1)">
      <van-icon name="search" slot="right"/>
      <van-icon name="cart" slot="right"/>
    </van-nav-bar>
    <van-tabs v-model="active">
      <van-tab v-for="(item,index) in product" :key="index" :title="item.name">
        <div
          class="subcategory-product"
          v-for="(item,index) in item.goods"
          :key="index"
          @click="goDetail(item.goodsGuid)"
        >
          <img :src="item.picUrl">
          <div class="subcategory-product-info">
            <p class="subcategory-product-info-name">{{item.goodsName}}</p>
            <p class="subcategory-product-info-desc">{{item.description}}</p>
            <p class="subcategory-product-info-price">
              <b>{{item.price | formatCurrency('￥')}}</b>
              <s
                :class="item.marketPrice == item.price ? 'hidden' : '' "
              >{{item.marketPrice | formatCurrency('￥')}}</s>
              <van-icon name="add" class="add-to-cart" @click="addToCart(item)"/>
            </p>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
import url from "@/service.config.js";

export default {
  data() {
    return {
      title: this.$route.params.name,
      active: localStorage.tabs_index,
      product: []
    };
  },
  created() {
    // 获取子分类商品
    axios({
      url: url.getSubCategoriesProducts,
      method: "get",
      params: {
        parent_id: this.$route.params.parent_id,
        id: this.$route.params.id
      }
    })
      .then(res => {
        this.product = res.data;
        // console.log(this.product);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
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
            goodsGuid: item.goodsGuid, // 商品自带 ID
            picUrl: item.picUrl, // 缩略图
            goodsName: item.goodsName, // 商品名称
            price: item.price, // 商品现价
            marketPrice: item.marketPrice, // 商品原价
            count: 1 // 默认加一
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$toast.success(res.data.message);
            } else if (res.data.code == 201) {
              this.$toast.success(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
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
.subcategory {
  position: relative;
  &-product {
    width: 100%;
    height: 0.24 * 2+2.2rem;
    box-sizing: border-box;
    padding: 0.24rem;
    display: flex;
    background: #fff;
    margin-bottom: 1px;
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    &-info {
      flex: 1;
      margin-left: 0.24rem;
      position: relative;
      &-name {
        font-size: 0.3rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      &-desc {
        line-height: 0.32rem;
        margin-top: 0.1rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      &-price {
        position: absolute;
        bottom: 0;
        line-height: 0.52rem;
        width: 100%;
        b {
          font-size: 0.32rem;
          color: $orange;
        }
        s {
          margin-left: 0.1rem;
        }
        i {
          float: right;
        }
      }
    }
  }
}
</style>
