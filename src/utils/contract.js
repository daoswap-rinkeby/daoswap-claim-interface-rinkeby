import Web3 from "web3";
import contract from "@truffle/contract";
import {
  ERC20_CONTRACT,
  CLAIM_CONTRACT,
  ERC20ContractAddress,
  ClaimContractAddress
} from "../constants";

const CONTRACTS = {
  ERC20: {
    contractJson: ERC20_CONTRACT,
    address: ERC20ContractAddress
  },
  Claim: {
    contractJson: CLAIM_CONTRACT,
    address: ClaimContractAddress
  }
};

export const getContract = (name, web3) => {
  const contractObj = CONTRACTS[name];
  // 定义合约变量
  const readContract = contract(contractObj.contractJson);
  readContract.setProvider(web3.currentProvider);
  return readContract.at(contractObj.address);
};

/**
 * format amount
 * @param {(string|number)} amount
 * @param {number} decimals
 * @returns {number | null}
 */
export const formatAmount = (amount, decimals) => {
  const decimalsValue = decimals || 18;
  return Web3.utils.BN(amount).toString() / Math.pow(10, decimalsValue);
};
