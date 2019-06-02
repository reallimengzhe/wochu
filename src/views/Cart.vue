<template>
  <div class="cart">
    <!-- 选择地址 -->
    <div class="cart-title" v-if="cartProduct.length" @click="$router.push('/SelectAdress')">
      <span v-if="!address">请选择地址</span>
      <span>{{address}}</span>
      <van-icon name="arrow-down"/>
    </div>
    <!-- 购物车列表 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 购物车为空 -->
      <div v-if="!cartProduct.length" class="cart-empty">
        <div class="cart-empty-img"></div>
        <p>购物车还是空嘞，白迷了，赶紧去买点吧</p>
        <van-button type="primary" style="display: block; margin: 0 auto;" to="/">去买点儿</van-button>
      </div>
      <div class="cart-product" v-show="cartProduct.length">
        <!-- 商品 -->
        <van-checkbox-group v-model="cartProductChecked">
          <van-checkbox
            v-for="(item, index) in cartProduct"
            :key="index"
            :name="item"
            checked-color="#428b0e"
          >
            <van-swipe-cell :on-close="onClose(item.goodsGuid,index)" :right-width="65">
              <div class="cart-product-item" @click="goDetail(item.goodsGuid)">
                <img :src="item.picUrl" class="cart-product-item-img">
                <div class="cart-product-item-info">
                  <p class="cart-product-item-info-name">{{item.goodsName}}</p>
                  <p class="cart-product-item-info-price" @click.stop>
                    <b v-if="item.price">{{item.price | formatCurrency('￥')}}</b>
                    <s
                      :class="item.marketPrice == item.price ? 'hidden' : '' "
                    >{{item.marketPrice | formatCurrency('￥')}}</s>
                    <!-- 步进器 -->
                    <van-stepper
                      v-model="item.count"
                      :max="100"
                      async-change
                      @change="onChange(item.count,item.productId)"
                      class="cart-product-item-info-price-count"
                    />
                  </p>
                </div>
              </div>
              <span slot="right">删除</span>
            </van-swipe-cell>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <!-- 你可能喜欢 -->
      <div class="cart-recommend">
        <p class="cart-recommend-title">· 你可能喜欢 ·</p>
        <div
          v-for="(item,index) in recommend"
          :key="index"
          class="cart-recommend-item"
          @click="goDetail(item.goodsGuid)"
        >
          <img :src="item.picUrl">
          <p>{{item.goodsName}}</p>
          <s
            :class="item.marketPrice == item.price ? 'hidden' : '' "
          >{{item.marketPrice | formatCurrency('￥')}}</s>
          <b>{{item.price | formatCurrency('￥')}}</b>
          <van-icon name="add" class="add-to-cart" @click="addToCart(item)" @click.stop/>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 结算按钮 -->
    <van-submit-bar
      v-if="cartProduct.length"
      :price="totalPrice"
      :button-text="'结算(' + cartProductChecked.length + ')'"
      class="cart-submit"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" checked-color="#428b0e" @click="selectAll()">全选</van-checkbox>
    </van-submit-bar>
    <footerbar ref="footerbar"></footerbar>
  </div>
</template>

<script>
// @ is an alias to /src
import footerbar from "@/components/Footerbar.vue";
import { mapState } from "vuex";
import axios from "axios";
import url from "@/service.config.js";

export default {
  components: {
    footerbar
  },
  data() {
    return {
      address: localStorage.address_detail,
      cartProduct: [],
      cartProductChecked: [],
      checked: true,
      isLoading: false, // 下拉刷新
      recommend: []
    };
  },
  watch: {
    cartProductChecked: function() {
      if (this.cartProductChecked.length == this.cartProduct.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    }
  },
  beforeCreate() {
    // 当前页面索引
    localStorage.active = 2;
  },
  created() {
    // 获取购物车商品
    this.getCartProduct();
    // 获取购物车推荐商品
    this.getRecommend();
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo"]),
    // 计算总价
    totalPrice() {
      let total = 0;
      for (let i = 0; i < this.cartProductChecked.length; i++) {
        if (this.cartProductChecked[i].price) {
          total +=
            this.cartProductChecked[i].price * this.cartProductChecked[i].count;
        } else {
          total +=
            this.cartProductChecked[i].marketPrice *
            this.cartProductChecked[i].count;
        }
      }
      return total * 100;
    }
  },
  methods: {
    selectAll() {
      if (this.cartProductChecked.length == this.cartProduct.length) {
        this.cartProductChecked = [];
      } else {
        this.cartProductChecked = this.cartProduct;
      }
    },
    // 获取购物车数据
    getCartProduct() {
      this.isLoading = true;
      axios({
        url: url.getCart,
        method: "get",
        params: {
          // userId: localStorage.token_id, // 查询当前 id 的购物车数据
          user: localStorage.token // 查询当前 id 的购物车数据
        }
      })
        .then(res => {
          this.cartProduct = res.data;
          // console.log(res);
          // console.log(this.cartProduct);
          this.isLoading = false;
          // 默认全选
          this.cartProductChecked = this.cartProduct;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取购物车推荐商品
    getRecommend() {
      axios({
        url: url.getCartRecommend
      })
        .then(res => {
          for (let item of res.data) {
            this.recommend.push(item);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 商品详情
    goDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.cartProduct = [];
        // 获取购物车数据
        this.getCartProduct();
      }, 500);
    },
    // 删除购物车商品
    onClose(id, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "left":
          case "cell":
          case "outside":
            instance.close();
            break;
          case "right":
            this.$dialog
              .confirm({
                message: "确定删除此商品吗？"
              })
              .then(() => {
                instance.close();
                // 从当前数组删除
                this.cartProduct.splice(index, 1);
                // 从数据库删除
                axios({
                  url: url.delCartItem,
                  method: "post",
                  data: {
                    user: localStorage.token, // 用户 ID
                    goodsGuid: id // 商品 ID
                  }
                })
                  .then(res => {
                    if (res.data.code == 200) {
                      this.$toast.success(res.data.message);
                      // 获取购物车数量
                      this.$refs.footerbar.getCartCount();
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    // 改变数量
    onChange(value, id) {
      // console.log(value);
      // console.log(id);
      // 向数据库发送改变请求
      axios({
        url: url.changeCount,
        method: "post",
        data: {
          productId: id,
          // userId: localStorage.token_id,
          user: localStorage.token,
          count: value
        }
      })
        .then(res => {
          console.log(res.data.message);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 添加至购物车
    addToCart(item) {
      // console.log(item);
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
              // 重新获取购物车数据
              this.getCartProduct();
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
    },
    onSubmit() {}
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";

.cart {
  position: relative;
  &-title {
    position: fixed;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 0.9rem;
    padding: 0 0.24rem;
    border-bottom: #eee solid 1px;
    line-height: 0.9rem;
    background: rgba(255, 255, 255, 0.9);
    z-index: 3;
    text-align: center;
    font-size: 0.3rem;
    span {
      margin-right: 0.1rem;
    }
  }
  &-empty {
    background: $background;
    &-img {
      margin: 0 auto;
      width: 100%;
      height: 37px;
      background: url(http://wmall.wochu.cn/h5/mall/css/images/ic_no_goods.png)
        no-repeat bottom/122px;
      padding-top: 2.7rem;
    }
    p {
      text-align: center;
      line-height: 1rem;
    }
  }
  &-product {
    margin-top: 1rem;
    &-item {
      box-sizing: border-box;
      width: 100%;
      height: 2rem;
      padding: 0.2rem;
      border-bottom: 1px $background solid;
      background: #fff;
      display: flex;
      .van-checkbox {
        line-height: 1.6rem;
      }
      &-img {
        width: 1.6rem;
        height: 1.6rem;
      }
      &-info {
        flex: 1;
        margin-left: 0.2rem;
        position: relative;
        overflow: hidden;
        &-name {
          width: 100%;
          font-size: 0.28rem;
          line-height: 0.3rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        &-price {
          width: 100%;
          line-height: 0.4rem;
          position: absolute;
          left: 0;
          bottom: 0;
          b {
            font-size: 0.3rem;
            color: $orange;
          }
          s {
            margin-left: 0.1rem;
          }
          &-count {
            float: right;
            input,
            button {
              box-sizing: border-box;
              width: 0.5rem;
              height: 0.4rem;
              line-height: 0.4rem;
            }
          }
        }
      }
    }
    .van-checkbox__icon {
      margin: 0.8rem 0 0 0.24rem;
    }
  }
  &-recommend {
    padding: 0.72rem 0.24rem 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: $background;
    &-title {
      width: 100%;
      text-align: center;
      line-height: 1rem;
      font-size: 0.3rem;
    }
    &-item {
      margin-top: 0.24rem;
      width: 29%;
      position: relative;
      border-radius: 0.1rem;
      background: #fff;
      padding: 0.1rem;
      overflow: hidden;
      img {
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
  &-submit {
    bottom: 51px;
    border-top: 1px solid rgb(229, 229, 229);
    .van-checkbox {
      margin-left: 0.2rem;
    }
  }
}
</style>
