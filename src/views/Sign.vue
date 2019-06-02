<template>
  <div class="sign">
    <div class="sign-top_img">
      <van-icon name="clear" class="close" @click="$router.go(-1)"/>
      <img src="http://wmall.wochu.cn/h5/img/vueLogin/loginTop.gif">
    </div>
    <van-tabs>
      <!-- 短信登录 -->
      <van-tab title="短信登录">
        <div class="sign-message">
          <input
            type="text"
            v-model="signInUser"
            maxlength="13"
            placeholder="输入手机号"
            @keydown="fillSpace($event)"
          >
          <van-icon
            name="clear"
            class="sign-message-clear"
            @click="signInUser = ''"
            v-if="signInUser.length"
          />
          <input type="text" v-model="signInCode" maxlength="6" placeholder="输入验证码">
          <p
            :class="signInUser.length == 13 ? 'sign-message-code enable' : 'sign-message-code disable'"
            @click="getInCode()"
          >获取验证码</p>
          <div
            :class="signInUser.length == 13 && signInCode.length == 6 ? 'sign-message-btn enable' : 'sign-message-btn disable'"
            @click="signInByCodeHandler"
          >登录</div>
          <p class="sign-message-tips">
            <span>查看</span>
            <a href="http://wmall.wochu.cn/h5/setUp/serviceProtocol.html">《我厨服务协议及隐私政策》</a>
          </p>
        </div>
      </van-tab>
      <!-- 密码登录 -->
      <van-tab title="密码登录">
        <div class="sign-message">
          <input
            type="text"
            v-model="signInUser"
            maxlength="13"
            placeholder="输入手机号"
            @keydown="fillSpace($event)"
          >
          <input
            :type="password_sign_in"
            v-model="signInPassword"
            maxlength="16"
            placeholder="输入密码"
          >
          <van-icon
            name="eye"
            :class="password_sign_in == 'password' ? 'sign-message-eye' : 'sign-message-eye show'"
            @click="password_sign_in = password_sign_in == 'password' ? 'text' : 'password'"
          />
          <div
            :class="signInUser.length == 13 && signInPassword.length >= 6 ? 'sign-message-btn enable' : 'sign-message-btn disable'"
            @click="signInByPasswordHandler"
          >登录</div>
          <p class="sign-message-tips">
            <span>查看</span>
            <a href="http://wmall.wochu.cn/h5/setUp/serviceProtocol.html">《我厨服务协议及隐私政策》</a>
            <span>忘记密码</span>
          </p>
        </div>
      </van-tab>
      <!-- 注册 -->
      <van-tab title="注册">
        <div class="sign-message">
          <input
            type="text"
            v-model="signInUser"
            maxlength="13"
            placeholder="输入手机号"
            @keydown="fillSpace($event)"
          >
          <input type="text" v-model="signUpCode" maxlength="6" placeholder="输入验证码">
          <input
            :type="password_sign_up"
            v-model="signUpPassword"
            maxlength="16"
            placeholder="输入 6 - 16 位的密码"
            @blur="checkLength"
          >
          <input
            type="password"
            v-model="signUpPasswordRepeat"
            maxlength="16"
            placeholder="重复输入的密码"
          >
          <p
            :class="signInUser.length == 13 ? 'sign-message-code enable' : 'sign-message-code disable'"
            @click="getUpCode"
          >获取验证码</p>
          <van-icon
            name="eye"
            :class="password_sign_up == 'password' ? 'sign-message-eye-up' : 'sign-message-eye-up show'"
            @click="password_sign_up = password_sign_up == 'password' ? 'text' : 'password'"
          />
          <div
            :class="canSignUp == true ? 'sign-message-btn enable' : 'sign-message-btn disable'"
            @click="signUpHandler"
          >注册</div>
          <p class="sign-message-tips">
            <van-checkbox
              v-model="agreed"
              checked-color="#428b0e"
              @click="agreed = agreed == true ? false : true"
            />
            <span>我已同意</span>
            <a href="http://wmall.wochu.cn/h5/setUp/serviceProtocol.html">《我厨服务协议及隐私政策》</a>
          </p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import url from "@/service.config.js";
// import { mapActions } from "vuex";

export default {
  data() {
    return {
      // 登录
      signInUser: "", // 登录的账号 或 注册的账号
      signInCode: "", // 登录的验证码
      signInPassword: "", // 登录的密码
      password_sign_in: "password", //密码显示与加密
      // 注册
      signUpCode: "", // 注册的验证码
      signUpPassword: "", // 注册的密码
      signUpPasswordRepeat: "", // 重复注册的密码
      password_sign_up: "password", //密码显示与加密
      agreed: false, // 是否同意条款
      canSignUp: false, // 是否可以注册
      // 随机的验证码
      code: ""
    };
  },
  methods: {
    // ...mapActions(["loginAction"]),
    // 短信登录
    signInByCodeHandler() {
      if (this.signInCode == this.code) {
        this.$toast.success("登录成功");
        localStorage.token = this.signInUser;
        localStorage.token_id = "";

        // 返回登录前的页面
        this.$router.go(-1);
      } else {
        this.$toast.fail("验证码错误");
      }
    },
    // 密码登录
    signInByPasswordHandler() {
      axios({
        url: url.signIn,
        method: "post",
        data: {
          user: this.signInUser,
          password: this.signInPassword
        }
      })
        .then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            // eslint-disable-next-line
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 10);
            })
              .then(() => {
                this.$toast.success("登录成功");
                // 保存登录状态到 Vuex
                // this.loginAction(res.data.userInfo);
                // console.log(res.data.userInfo);
                // 保存登录状态到 localStorage
                this.$store.commit("signIn", res.data.userInfo);
                // 返回登录前的页面
                this.$router.go(-1);
              })
              .catch(err => {
                this.$toast.fail("登录失败");
                console.log(err);
              });
          } else if (res.data.code == 201) {
            this.$toast.fail("密码错误");
          } else {
            this.$toast.fail("用户不存在");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 注册
    signUpHandler() {
      // console.log("点击了注册按钮");
      if (this.canSignUp) {
        axios({
          url: url.signUp,
          method: "post",
          data: {
            user: this.signInUser,
            password: this.signUpPassword
          }
        })
          .then(res => {
            // console.log(res);
            if (res.data.code == 200) {
              this.$toast.success(res.data.message); // 注册成功
              this.signUpPassword = this.signUpPasswordRepeat = "";
              this.$router.go(0);
            } else {
              this.$toast(res.data.message); // 注册失败
            }
          })
          .catch(err => {
            this.$toast.fail("网络错误");
            console.log(err);
          });
      } else {
        if (this.signInUser.length != 13) {
          this.$toast("请输入正确的手机号");
        } else if (this.signUpCode.length != 6) {
          this.$toast("请输入正确的验证码");
        } else if (this.signUpPassword.length < 6) {
          this.$toast("密码不能少于 6 个字符");
        } else if (this.signUpPassword != this.signUpPasswordRepeat) {
          this.$toast("密码不匹配");
        } else if (!this.agreed) {
          this.$toast("请先同意《我厨服务协议及隐私政策》");
        }
      }
    },
    // 手机号补空格
    fillSpace(e) {
      // console.log(e.keyCode);
      let l = this.signInUser.length;
      if (e.keyCode != 8) {
        if (l === 3 || l === 8) {
          this.signInUser += " ";
        }
      }
    },
    // 密码可见
    showPassword() {
      this.password = this.password == "password" ? "text" : "password";
    },
    // 获取登录验证码
    getInCode() {
      if (this.signInUser.length >= 13) {
        this.$dialog
          .alert({
            message: "验证码已发送"
          })
          .then(() => {
            this.code = Math.random()
              .toString()
              .slice(-6);
            this.$notify({
              message: "您的验证码是" + this.code,
              duration: 5000,
              background: "#428b0e"
            });
            console.log(this.signUpCode);
            this.signInCode = this.code;
          });
      } else {
        this.$dialog.alert({
          message: "请输入正确的手机号"
        });
      }
    },
    // 获取注册验证码
    getUpCode() {
      if (this.signInUser.length >= 13) {
        this.$dialog
          .alert({
            message: "验证码已发送"
          })
          .then(() => {
            this.signUpCode = Math.random()
              .toString()
              .slice(-6);
            this.$notify({
              message: "您的验证码是" + this.signUpCode,
              duration: 5000,
              background: "#428b0e"
            });
            console.log(this.signUpCode);
          });
      } else {
        this.$dialog.alert({
          message: "请输入正确的手机号"
        });
      }
    },
    // 检查密码的长度
    checkLength() {
      if (this.signUpPassword.length < 6) {
        this.$notify({
          message: "密码不能少于 6 个字符"
        });
      }
    }
  },
  computed: {
    signUpAdress() {
      const {
        signInUser,
        signUpCode,
        signUpPassword,
        signUpPasswordRepeat,
        agreed
      } = this;
      return {
        signInUser,
        signUpCode,
        signUpPassword,
        signUpPasswordRepeat,
        agreed
      };
    }
  },
  watch: {
    signUpAdress: function(newData) {
      // console.log(newData);
      if (
        newData.signInUser.length == 13 && // 手机号
        newData.signUpCode.length == 6 && // 验证码
        newData.signUpPassword.length >= 6 && // 密码长度符合
        newData.signUpPassword == newData.signUpPasswordRepeat && // 密码匹配
        newData.agreed == true // 同意条款
      ) {
        // console.log(newData);
        this.canSignUp = true;
      } else {
        this.canSignUp = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/wochu.scss";
.sign {
  position: relative;
  width: 100%;
  font-size: 0.32rem;
  background: #fff;
  &-top_img {
    width: 100%;
    img {
      width: 100%;
    }
  }
  &-message {
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.54rem;
    position: relative;
    input[type="text"],
    input[type="password"],
    input[type="number"] {
      display: block;
      width: 100%;
      border: none;
      border-bottom: 1px #eee solid;
      border-radius: 0;
      padding: 0.32rem 0;
      height: 0.6rem;
      line-height: 0.6rem;
    }
    input:nth-last-of-type(1) {
      border: none;
    }
    &-clear {
      position: absolute;
      top: 0.32rem;
      right: 0.54rem;
      line-height: 0.6rem;
      font-size: 0.4rem;
      color: $opacity-btn;
    }
    &-code {
      position: absolute;
      top: 0.32 * 3 + 0.6rem;
      right: 0.54rem;
      width: 1.54rem;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      font-size: 0.24rem;
      border-radius: 0.12rem;
    }
    &-eye {
      position: absolute;
      top: 0.32 * 3 + 0.6rem;
      right: 0.54rem;
      line-height: 0.6rem;
      font-size: 0.32rem;
      color: #eee;
      &-up {
        position: absolute;
        top: 0.32 * 5 + 0.6 * 2rem;
        right: 0.54rem;
        line-height: 0.6rem;
        font-size: 0.32rem;
        color: #eee;
      }
    }
    &-btn {
      border-radius: 0.2rem;
      margin-top: 0.24rem;
      line-height: 1rem;
      text-align: center;
    }
    &-tips {
      text-align: center;
      // height: 0.32rem;
      line-height: 1rem;
      font-size: 0.32rem;
      padding: 0.24rem 0;
      a,
      b {
        color: $green;
      }
      .van-checkbox {
        display: inline;
        margin-right: 0.1rem;
        .van-checkbox__icon {
          vertical-align: text-bottom;
        }
      }
      .van-checkbox__icon .van-icon {
        font-size: 0.32rem;
        width: 0.4rem;
        height: 0.4rem;
      }
      .van-icon {
        font: 0.28rem/0.4rem "vant-icon" !important;
      }
      .van-checkbox__icon {
        height: unset;
      }
    }
  }
}
</style>
