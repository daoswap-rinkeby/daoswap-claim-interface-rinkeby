import supportedChains from "./chain";

export function getChainData(chainId) {
  const chainData = supportedChains.filter(
    chain => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.VUE_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl
    };
  }

  return chainData;
}

export function ellipseAddress(address, width = 10) {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}
