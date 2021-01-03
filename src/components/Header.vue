<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Daoswap"
        class="shrink mr-2"
        contain
        :src="require('@/assets/logo.png')"
        transition="scale-transition"
        width="40"
      />
      <span class="text-md-h5 text-sm-body-2">Daoswap</span>
    </div>
    <v-spacer></v-spacer>
    <v-btn
      color="pink accent-3"
      href="https://app.daoswap.global"
      target="_blank"
      >Daoswap APP</v-btn
    >
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="item in localeList" :key="item.locale" link>
          <v-list-item-title
            v-text="item.title"
            @click="changeLang(item.locale)"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    // 当前包含语言
    localeList: [
      {
        locale: "zh",
        title: "中文"
      },
      {
        locale: "en",
        title: "English"
      }
    ]
  }),
  methods: {
    changeLang(locale) {
      this.$i18n.locale = locale;
    }
  }
};
</script>
