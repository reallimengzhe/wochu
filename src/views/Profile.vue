<template>
  <div class="profile">
    <!-- 用户 -->
    <div class="profile-user" @click="user">
      <div class="profile-user-photo"></div>
      <p class="profile-user-name">{{loginUser}}</p>
      <div class="profile-user-balance">
        <div class="profile-user-balance-cash">
          <h4>0</h4>
          <p>账户余额</p>
        </div>
        <div class="profile-user-balance-coupon">
          <h4>0</h4>
          <p>优惠券</p>
        </div>
        <van-cell value="马上充值" icon="shop-o" is-link class="profile-user-balance-recharge">
          <template slot="title">
            <span class="custom-text">充值立送充值券哦~</span>
          </template>
        </van-cell>
      </div>
    </div>
    <!-- 订单 -->
    <div class="profile-order">
      <div class="profile-order-item" v-for="(item,index) in order" :key="index">
        <img :src="item.img">
        <p>{{item.name}}</p>
      </div>
    </div>
    <!-- 其他链接 -->
    <div class="profile-links">
      <div
        class="profile-links-item"
        v-for="(item,index) in links"
        :key="index"
        @click="$router.push(item.to)"
      >
        <img :src="item.img">
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      loginUser: "登录",

      order: [
        {
          name: "待付款",
          img: "http://wmall.wochu.cn/h5/personal/img/needtopay@3x.png"
        },
        {
          name: "待收货",
          img: "http://wmall.wochu.cn/h5/personal/img/no-receive@3x.png"
        },
        {
          name: "待评价",
          img: "http://wmall.wochu.cn/h5/personal/img/no-comment@3x.png"
        },
        {
          name: "退款/售后",
          img: "http://wmall.wochu.cn/h5/personal/img/historyget@3x.png"
        },
        {
          name: "我的订单",
          img: "http://wmall.wochu.cn/h5/personal/img/myorders@3x.png"
        }
      ],
      links: [
        {
          name: "我的团购",
          img: "http://wmall.wochu.cn/h5/personal/img/mytg@3x.png",
          to: "/cart"
        },
        {
          name: "收货地址",
          img: "http://wmall.wochu.cn/h5/personal/img/location@3x.png"
        },
        {
          name: "我的收藏",
          img: "http://wmall.wochu.cn/h5/personal/img/favorite@3x.png"
        },
        {
          name: "关于我厨",
          img: "http://wmall.wochu.cn/h5/personal/img/aboutus@3x.png"
        },
        {
          name: "帮助中心",
          img: "http://wmall.wochu.cn/h5/personal/img/help@3x.png"
        },
        {
          name: "意见反馈",
          img: "http://wmall.wochu.cn/h5/personal/img/yjfk@3x.png"
        },
        {
          name: "设置中心",
          img: "http://wmall.wochu.cn/h5/personal/img/setup@3x.png",
          to: "/setting"
        },
        {
          name: "客服电话",
          img: "http://wmall.wochu.cn/h5/personal/img/kefu@3x.png"
        }
      ]
    };
  },
  created() {
    localStorage.active = 3;
    if (localStorage.token) {
      this.loginUser =
        localStorage.token.substr(0, 3) +
        "****" +
        localStorage.token.substr(9, 13);
    }
  },
  mounted() {},
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    user() {
      if (localStorage.token) {
        // this.$router.push("/sign");
        // console.log(localStorage.token);
      } else {
        // 跳转到个人信息
        this.$router.push("/sign");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/wochu.scss";
.profile {
  position: relative;
  padding-bottom: 2rem;
  &-user {
    width: 100%;
    height: 5.78rem;
    background: no-repeat top/100%
      url("http://wmall.wochu.cn/h5/personal/img/header_bg@3x.png");
    overflow: hidden;
    &-photo {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      margin: 0.78rem auto 0;
      background: no-repeat center/98%
        url("http://wmall.wochu.cn/h5/personal/img/cust-icon-nologin.png");
    }
    &-name {
      text-align: center;
      color: #fff;
      font-size: 0.24rem;
      line-height: 0.95rem;
    }
    &-balance {
      margin: 0 auto;
      width: 7.02rem;
      // height: 2rem;
      border-radius: 0.24rem;
      background: #fff;
      box-shadow: $box-shadow;
      overflow: hidden;
      padding-top: 0.4rem;
      text-align: center;
      &-cash {
        box-sizing: border-box;
        float: left;
        width: 50%;
        border-right: 1px solid #e5e5e5;
      }
      &-coupon {
        float: left;
        width: 50%;
      }
      h4 {
        font-size: 0.4rem;
        line-height: 0.6rem;
      }
      p {
        font-size: 0.28rem;
        line-height: 0.28rem;
        color: #999;
      }
      &-recharge {
        float: left;
        width: 100%;
        height: 0.86rem;
        margin-top: 0.4rem;
        background: #428b0e;
        color: #fff;
        text-align: left;
        span {
          color: #fff;
        }
        i {
          color: #fff;
        }
      }
    }
  }
  &-order {
    display: flex;
    flex-wrap: nowrap;
    // justify-content: space-around;
    background: #fff;
    padding: 0.4rem 0;
    &-item {
      text-align: center;
      flex: 1;
      &:last-child {
        border-left: 1px #ccc solid;
      }
      img {
        height: 0.56rem;
        display: inline-block;
      }
      p {
        font-size: 0.24rem;
        line-height: 0.24rem;
        margin-top: 0.18rem;
      }
    }
  }
  &-links {
    margin-top: 0.2rem;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    &-item {
      width: 25%;
      padding: 0.3rem 0;
      font-size: 0.24rem;
      text-align: center;
      border-bottom: 1px #f4f4f4 solid;
      img {
        display: inline-block;
        width: 0.56rem;
      }
      p {
        color: #999;
        margin-top: 0.2rem;
      }
    }
  }
}
</style>
