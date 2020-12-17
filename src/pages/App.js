import React, { Component } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getChainData, getContract, formatBalance } from '../utils/utilities'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../components/Header';
import { ERC20ContractAddress } from '../constants'

// const ClaimContractAddress = '0xF0528626a42565CDF6a9C9Eb3d0415c1370Bdb81';
const ClaimContractAddress = '0xe55DA0cB45367fdfB658f4C26e96C21677BB3C10';

const initStats = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initStats
    };
    
    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  // 监听钱包事件
  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });
  };

  // 获取网络配置
  getNetwork = () => getChainData(this.state.chainId).network;

  // 获取Provider配置
  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  // 获取账号信息
  getAccountAssets = async () => {
    const { web3, address } = this.state;
    this.setState({ fetching: true });
    try {
      const ERC20Contract = getContract("ERC20", ERC20ContractAddress, web3);
      const ERC20Balance = await ERC20Contract.balanceOf(address);
      const ClaimContract = getContract("Claim", ClaimContractAddress, web3);
      const ClaimData = await ClaimContract.claimInfoByToken(address);

      const assets = {
        ERC20Balance: formatBalance(ERC20Balance),
        ClaimBalance: formatBalance(ClaimData.claimAmount),
        ClaimStatus: ClaimData.isClaim,
      };
      console.info(assets);

      this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error);
      this.setState({ fetching: false });
    }
  };

  // 初始化web3
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
  }

  // 连接钱包
  onConnect = async () => {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);
    const web3 = this.initWeb3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.chainId();

    this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
    await this.getAccountAssets();
  };

  // 重置钱包连接
  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    this.web3Modal.clearCachedProvider();
    this.setState({ ...initStats });
  };

  // 提币
  handleClaim = () => {
    const { web3, address } = this.state;
    this.setState({ fetching: true });
    const ClaimContract = getContract("Claim", ClaimContractAddress, web3);
    ClaimContract.claim(address).then(r => {
      console.info(r);
      this.getAccountAssets();
    }).catch((e) => {
      console.info(e);
    }).finally(() => {
      this.setState({ fetching: false });
    });
  }

  render() {
    const { connected, address, chainId, assets, fetching } = this.state;
    return (
      <>
        <Header
          connected={connected}
          address={address}
          chainId={chainId}
          killSession={this.resetApp}
        />
        {connected && chainId ? (
          fetching ? (
            <Box m={5}>
              <Box display="flex" justifyContent="center" color="#3f51b5" m={1} p={1}>
                <CircularProgress />
              </Box>
            </Box>
          ) : (
            <Box m={5}>
              <Box display="flex" justifyContent="center" color="#3f51b5" m={1} p={1}>
                <h1>Extractable DOI</h1>
              </Box>
              <Box display="flex" justifyContent="center" color="#3f51b5" m={1} p={1}>
                <h1 style={{ fontSize: '4em' }}>{assets.ClaimBalance}</h1>
              </Box>
              {assets.ClaimBalance > 0 && !assets.ClaimStatus ? (
                <Box display="flex" justifyContent="center" m={1} p={1}>
                  <Button variant="contained" color="secondary" size="large" onClick={this.handleClaim}>
                    Claim
                  </Button>
                </Box>
                ) : null
              }
            </Box>
          )
        ) : (
          <Box m={5}>
            <Box display="flex" justifyContent="center" m={1} p={1}>
              <Button variant="contained" color="secondary" size="large" onClick={this.onConnect}>
                Connect Wallet
              </Button>
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default App;
