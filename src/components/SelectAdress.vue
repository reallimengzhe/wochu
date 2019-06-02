<template>
  <div class="address">
    <!-- 导航栏 -->
    <van-nav-bar
      title="选择地址"
      left-text="返回"
      right-text="新增地址"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="newAddess=true"
    />
    <!-- 搜索栏 -->
    <van-search placeholder="搜索支持的小区或写字楼" v-model="searchValue" label="上海市" shape="round"/>
    <!-- 定位 -->
    <p class="address-formattedAddress">
      <span
        v-if="address.formattedAddress"
        @click="selectAddress(address.formattedAddress.slice(6), 0)"
      >{{address.formattedAddress.slice(6)}}</span>
      <span v-if="!address.formattedAddress">正在获取</span>
      <span>当前定位</span>
    </p>
    <!-- 地图 -->
    <div class="address-map" id="map"></div>
    <!-- 没有地址 -->
    <div class="address-no" v-if="!addressList.length">
      <img src="http://wmall.wochu.cn/h5/address/css/images/k-shouhuodizhi@3x.png">
      <p>亲，您还没有收货地址~</p>
      <van-button type="primary" @click="newAddess=true">添加收货地址</van-button>
    </div>
    <!-- 地址列表 -->
    <div v-if="addressList.length" class="address-list">
      <div
        v-for="(item,index) in addressList"
        :key="index"
        class="address-list-item"
        @click="selectAddress(item.addressDetail,item.id)"
      >
        <p>
          <van-icon name="manager"/>
          <span>{{item.name}}</span>
          <span>{{item.tel | fillSpace()}}</span>
          <van-icon name="checked" v-if="selected == item.id"/>
        </p>
        <p>
          <van-icon name="location"/>
          <span>{{item.address}}</span>
        </p>
      </div>
      <!-- 提示 -->
      <p class="address-list-tips">因各地区商品和配送服务不同，请您选择准确收货地址</p>
    </div>
    <!-- 新建地址 - 弹出层 -->
    <van-popup v-model="newAddess" position="right" class="address-new">
      <van-nav-bar title="新建收货地址" left-text="返回" left-arrow @click-left="newAddess=false"/>
      <van-address-edit
        v-if="address.addressComponent"
        :area-list="areaList"
        show-set-default
        @save="onSave"
      />
    </van-popup>
  </div>
</template>
<script>
/* eslint-disable */
import load from "@/assets/js/load.js"; // 加载 Js
import areaList from "@/assets/js/areaList.js"; // 省市区数据
import axios from "axios";
import url from "@/service.config.js";
export default {
  data() {
    return {
      // 搜索的关键字
      searchValue: "",
      // 高德地图 key
      amapKey: "a8e3f1d526511281bac2edf977a6ca03",
      // 当前定位
      address: {},
      // 新建地址
      newAddess: false,
      areaList: areaList,
      // 获取地址列表
      addressList: [],
      selected: localStorage.address_id
    };
  },
  async created() {
    await load("http://webapi.amap.com/maps?v=1.4.3&key=" + this.amapKey);
    setTimeout(() => {
      this.createMap();
    }, 500);
  },
  mounted() {
    // 获取用户地址列表
    this.getAddressList();
  },
  methods: {
    // 创建地图
    createMap() {
      const map = new AMap.Map("map");
      map.plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        // 定位按钮
        map.addControl(geolocation);
        // 获取当前位置
        geolocation.getCurrentPosition();
        // 返回定位信息
        AMap.event.addListener(geolocation, "complete", address => {
          this.address = address;
          console.log(this.address);
        });
        // 返回定位出错信息
        AMap.event.addListener(geolocation, "error", err => {
          console.log(err);
        });
      });
    },
    // 获取用户地址列表
    getAddressList() {
      axios({
        url: url.getAddress,
        method: "get",
        params: {
          user: localStorage.token // 根据当前 id 的查询地址数据
        }
      })
        .then(res => {
          let i = 0;
          for (let item of res.data) {
            i++;
            item.id += i;
            this.addressList.push(item);
          }
          // console.log(res);
          console.log(this.addressList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择地址
    selectAddress(addressDetail, id) {
      localStorage.address_detail = addressDetail;
      localStorage.address_id = id;
      this.selected = id;
      this.$toast("已选择 " + addressDetail);
      setTimeout(() => {
        this.$router.push("/");
      }, 500);
    },
    // 保存地址
    onSave(data) {
      // 向服务器发送请求
      console.log(data);
      axios({
        url: url.newAddress,
        method: "post",
        data: {
          user: localStorage.token, // 用户ID
          addressDetail: data.addressDetail, // 小区或写字楼
          areaCode: data.areaCode, // 区域码
          city: data.city, // 市
          county: data.county, // 区
          isDefault: data.isDefault, // 是否默认
          name: data.name, // 收件人
          province: data.province, // 省/直辖市
          tel: data.tel, // 电话
          address: data.city + data.county + data.addressDetail,
          id: 0
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.$toast.success(res.data.message); // 添加成功
            // this.getAddressList(); // 刷新地址列表
            setTimeout(() => {
              // this.newAddess = false;
              this.$router.go(0);
            }, 500);
          } else {
            this.$toast(res.data.message); // 添加失败
          }
        })
        .catch(err => {
          this.$toast.fail("网络错误");
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.address {
  &-formattedAddress {
    margin-top: 0.24rem;
    box-sizing: border-box;
    padding: 0.24rem;
    text-align: center;
    line-height: 0.48rem;
    background: #fff;
    span:nth-child(1) {
      color: $black;
    }
    span:nth-child(2) {
      color: $gray;
      margin-left: 0.1rem;
    }
  }
  &-map {
    width: 0;
  }
  &-no {
    margin-top: 0.24rem;
    width: 100%;
    text-align: center;
    background: #fff;
    padding: 1rem 0;
    img {
      width: 3.4rem;
      display: inline-block;
    }
    p {
      line-height: 1.5rem;
    }
  }
  &-list {
    overflow: hidden;
    padding-bottom: 1rem;
    &-item {
      margin: 0.24rem auto 0;
      box-sizing: border-box;
      width: 94%;
      background: #fff;
      box-shadow: $box-shadow;
      border-radius: 0.2rem;
      padding: 0 0.24rem;
      p {
        padding: 0.24rem 0;
        overflow: hidden;
        i:nth-child(1) {
          color: $opacity-btn;
          font-size: 0.4rem;
          float: left;
          margin-top: 0.04rem;
        }
        span {
          float: left;
          max-width: 80%;
          margin-left: 0.24rem;
          line-height: 0.48rem;
        }
        span:nth-last-child(2) {
          color: $black;
        }
        i:nth-last-child(1) {
          color: $green;
          font-size: 0.4rem;
          float: right;
          margin-top: 0.04rem;
        }
      }
      p:nth-child(1) {
        border-bottom: 1px solid #e5e5e5;
      }
    }
    &-tips {
      text-align: center;
      line-height: 1rem;
    }
  }
  &-new {
    width: 100%;
    height: 100%;
    background: $background;
    .van-address-edit {
      margin-top: 0.24rem;
    }
    // '保存'按钮的颜色
    .van-button--danger {
      background-color: $green;
      border: 1px solid $green;
    }
  }
}
</style>
