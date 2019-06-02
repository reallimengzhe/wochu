<template>
  <div class="category">
    <!-- 标题栏 -->
    <form action="/">
      <van-search placeholder="请输入搜索关键词" v-model="search"/>
    </form>
    <!-- 分类 -->
    <van-row>
      <!-- 父分类 -->
      <van-col span="6" class="category-main">
        <div
          v-for="(item,index) in category_list"
          :key="index"
          :class="{active:active==index}"
          @click="selectCategory(item.category_id,index,item.name)"
        >
          <p ref="xxx">{{item.name}}</p>
        </div>
      </van-col>
      <!-- 子分类 -->
      <van-col span="18">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="category-subcategory">
            <div
              v-for="(item,index) in subcategory_list"
              :key="index"
              class="category-subcategory-item"
              @click="goSubcategory(item.category_id,item.parent_id),saveIndex(index)"
            >
              <img :src="item.checkicon">
              <p>{{item.name}}</p>
            </div>
          </div>
        </van-pull-refresh>
      </van-col>
    </van-row>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import url from "@/service.config.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      search: "",
      category_list: [],
      active: 0,
      subcategory_list: [],
      category_id: 1,
      category_name: "我厨优选",
      start: 0,
      limit: 18,
      isLoading: false // 下拉刷新
    };
  },
  // 请求父分类
  created() {
    localStorage.active = 1;
    axios({
      url: url.getCategories
    })
      .then(res => {
        this.category_list = res.data;
        this.selectCategory(this.category_id, this.active);
        this.category_name = res.data[0].name;
        // console.log(this.category_name);
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    const ch = document.documentElement.clientHeight;
    const cm = document.querySelector(".category-main");
    const cs = document.querySelector(".category-subcategory");
    cm.style.height = cs.style.height = ch - 54 - 51 + "px";
    cm.style.overflow = "auto";
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    onSearch() {
      console.log("搜点啥");
    },
    onCancel() {
      console.log("取消了");
    },
    // 选择分类
    selectCategory(category_id, index, name) {
      this.category_id = category_id;
      this.category_name = name;
      this.active = index;
      this.subcategory_list = [];
      // console.log(this.category_name)
      // 请求子分类
      this.getSubCategories();
    },
    // 请求子分类
    getSubCategories() {
      this.isLoading = true;
      axios({
        url: url.getSubCategories,
        method: "get",
        params: {
          parent_id: this.category_id,
          start: this.subcategory_list.length,
          limit: this.limit
        }
      })
        .then(res => {
          if (res.data.length == 0) {
            // console.log(res.data.length)
            this.finished = true;
          } else {
            this.subcategory_list = this.subcategory_list.concat(res.data);
            // console.log(res);
          }
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onRefresh() {
      setTimeout(() => {
        this.subcategory_list = [];
        this.getSubCategories();
      }, 1000);
    },
    goSubcategory(id, parent_id) {
      // console.log(id);
      this.$router.push({
        name: "subcategory",
        params: {
          id: id,
          parent_id: parent_id,
          name: this.category_name
        }
      });
      // this.$router.push(`/subcategory/${id}`);
    },
    saveIndex(index) {
      // console.log(index);
      localStorage.tabs_index = index;
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.category {
  position: relative;
  &-main {
    overflow-y: auto;
    div {
      text-align: center;
      padding: 0.3rem 0;
      font-size: 0.28rem;
      p {
        box-sizing: border-box;
        line-height: 0.4rem;
        border-left: $background solid 0.06rem;
        border-right: $background solid 0.06rem;
      }
    }
    .active {
      background: #fff;
      color: $green;
      p {
        border-left: $green solid 0.06rem;
        border-right: #fff solid 0.06rem;
      }
    }
  }
  &-subcategory {
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.48rem 1rem;
    justify-content: space-between;
    align-content: flex-start;
    &-item {
      width: 1rem;
      text-align: center;
      padding: 0.2rem;
      img {
        width: 1rem;
        height: 1rem;
      }
      p {
        line-height: 0.32rem;
        margin-top: 0.24rem;
      }
    }
  }
}
</style>
