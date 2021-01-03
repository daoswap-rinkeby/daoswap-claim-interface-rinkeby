<template>
  <div class="fill-height">
    <v-container v-if="state.connected" class="fill-height">
      <v-row justify="center">
        <v-col md="6">
          <v-card class="fill-width">
            <v-card outlined>
              <v-card-title>
                <v-avatar size="24" class="mr-2">
                  <img :src="require('@/assets/logo.png')" alt="DOI" />
                </v-avatar>
                <span class="title font-weight-light">
                  DOI {{ $t("Available Amount") }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-row align="center">
                  <v-col class="display-3" cols="12">
                    {{ state.assets.claimBalance }}
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="justify-center">
                <v-btn
                  large
                  color="primary"
                  dark
                  width="80%"
                  @click="claim"
                  :disabled="
                    state.assets.claimBalance <= 0 && !state.assets.isClaim
                  "
                >
                  {{ $t("Claim") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
          <v-card justify="center" class="fill-width mt-10">
            <v-card-title>
              <span class="title font-weight-light">
                {{ $t("Current Token Address") }}
              </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col
                  class="body-1"
                  cols="12"
                  @click="handleCopy(state.address, $event)"
                >
                  <p>
                    {{ state.address }}
                    <v-icon>mdi-content-copy</v-icon>
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn @click="resetApp">
                {{ $t("Disconnect Wallet") }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-overlay z-index="9999" opacity="0.7" :value="state.fetching">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="!state.connected" class="fill-height">
      <v-row justify="center">
        <v-col md="6" align="center">
          <v-btn
            v-if="!state.connected"
            x-large
            color="deep-orange darken-4 white--text"
            @click="onConnect"
          >
            {{ $t("Connect Wallet") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import clip from "@/utils/clipboard";
import Web3 from "web3";
import Web3Modal from "web3modal";
import contract from "truffle-contract";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getChainData, getContract, formatBalance } from "@/utils/utilities";
import {
  ERC20ContractAddress,
  ClaimContractAddress,
  CHAIN_ID,
  NETWORK_ID
} from "@/constants";

// 引入合约 ABI 文件
import Claim from "@/constants/contracts/Claim.json";
// 定义合约变量
const ClaimContract = contract(Claim);

const initStats = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: Number(CHAIN_ID),
  networkId: Number(NETWORK_ID),
  assets: []
};

export default {
  name: "Claim",
  data: () => ({
    // 奖励参数
    state: initStats,
    web3Modal: undefined
  }),
  methods: {
    // 复制地址
    handleCopy(text, event) {
      clip(text, event);
    },
    // 监听钱包事件 OK
    async subscribeProvider(provider) {
      if (!provider.on) {
        return;
      }
      provider.on("close", () => this.resetApp());
      provider.on("accountsChanged", async accounts => {
        const addressState = {
          address: Web3.utils.toChecksumAddress(accounts[0])
        };
        this.state = Object.assign(this.state, addressState);
        await this.getAccountAssets();
      });
      provider.on("chainChanged", async chainId => {
        const { web3 } = this.state;
        const networkId = await web3.eth.net.getId();
        const chainState = { chainId: chainId, networkId: networkId };
        this.state = Object.assign(this.state, chainState);
        await this.getAccountAssets();
      });

      provider.on("networkChanged", async networkId => {
        const { web3 } = this.state;
        const chainId = await web3.eth.chainId();
        const networkState = { chainId: chainId, networkId: networkId };
        this.state = Object.assign(this.state, networkState);
        await this.getAccountAssets();
      });
    },
    // 获取网络配置 OK
    getNetwork() {
      getChainData(this.state.chainId).network;
    },
    // 获取Provider配置 OK
    getProviderOptions() {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.VUE_APP_INFURA_ID
          }
        }
      };
      return providerOptions;
    },
    // 获取账号信息
    async getAccountAssets() {
      const { web3, address } = this.state;
      this.state.fetching = true;
      try {
        const ERC20Contract = getContract("ERC20", ERC20ContractAddress, web3);
        const ERC20Balance = await ERC20Contract.balanceOf(address);
        const ClaimContract = getContract("Claim", ClaimContractAddress, web3);
        const claimData = await ClaimContract.claimInfoByToken(address);

        const assets = {
          ERC20Balance: formatBalance(ERC20Balance),
          claimBalance: formatBalance(claimData.claimAmount),
          claimStatus: claimData.isClaim
        };

        const assetsState = {
          fetching: false,
          assets: assets
        };
        this.state = Object.assign(this.state, assetsState);
      } catch (error) {
        const errorState = {
          fetching: false,
          connected: false
        };
        this.state = Object.assign(this.state, errorState);
      }
    },
    // 初始化web3 OK
    initWeb3(provider) {
      const web3 = new Web3(provider);

      web3.eth.extend({
        methods: [
          {
            name: "chainId",
            call: "eth_chainId",
            outputFormatter: web3.utils.hexToNumber
          }
        ]
      });

      return web3;
    },
    // 连接钱包 OK
    async onConnect() {
      const provider = await this.web3Modal.connect();
      await this.subscribeProvider(provider);
      const web3 = this.initWeb3(provider);
      const accounts = await web3.eth.getAccounts();
      const address = Web3.utils.toChecksumAddress(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const chainId = await web3.eth.chainId();

      const connectedState = {
        web3,
        provider,
        connected: true,
        address,
        chainId,
        networkId
      };
      this.state = Object.assign(this.state, connectedState);
      await this.getAccountAssets();
    },
    // 重置钱包连接 OK
    async resetApp() {
      const { web3 } = this.state;
      if (web3 && web3.currentProvider && web3.currentProvider.close) {
        await web3.currentProvider.close();
      }
      this.web3Modal.clearCachedProvider();
      const nullStats = {
        fetching: false,
        address: "",
        web3: null,
        provider: null,
        connected: false,
        chainId: 1,
        networkId: 1,
        assets: []
      };
      this.state = nullStats;
    },
    // 提币 TODO OK
    claim() {
      // do your submit logic here
      const { web3, address } = this.state;
      this.state.fetching = true;
      this.dialog = false;
      // 执行合约
      ClaimContract.setProvider(web3.currentProvider);
      ClaimContract.at(Web3.utils.toChecksumAddress(ClaimContractAddress))
        .then(instance => {
          instance
            .claim({ from: address })
            .then(() => {
              this.getAccountAssets();
            })
            .catch(e => {
              console.info(e);
            })
            .then(() => {
              this.state.fetching = false;
            });
        })
        .catch(e => {
          console.info(e);
          this.state.fetching = false;
        });
    }
  },
  mounted() {
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
    if (!this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  },
  watch: {
    web3Modal: function(web3) {
      if (web3 && web3.currentProvider && web3.currentProvider.close) {
        this.state.connected = false;
      } else {
        this.onConnect();
      }
    }
  }
};
</script>
