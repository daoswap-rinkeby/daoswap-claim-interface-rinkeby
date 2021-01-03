<template>
  <v-footer dark padless>
    <v-card
      flat
      tile
      width="100%"
      class="indigo lighten-1 white--text text-center"
    >
      <v-card-text>
        <v-btn
          v-for="item in iconList"
          :key="item.index"
          class="mx-4 white--text"
          :href="item.url"
          target="_blank"
          icon
          :title="item.title"
        >
          <v-icon size="24px">
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        {{ $t("The page of claim") }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} - <strong>Daoswap</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data: () => ({
    iconList: [
      {
        title: "Daoswap",
        icon: "mdi-home",
        url: "https://app.daoswap.global"
      },
      {
        title: "Twitter",
        icon: "mdi-twitter",
        url: "https://twitter.com/SwapDao"
      }
    ]
  })
};
</script>
