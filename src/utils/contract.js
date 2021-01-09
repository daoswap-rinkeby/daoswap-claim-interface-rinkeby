import Web3 from "web3";
import { CLAIM_CONTRACT, ClaimContractAddress } from "../constants";

const CONTRACTS = {
  Claim: {
    contractJson: CLAIM_CONTRACT,
    address: ClaimContractAddress
  }
};

export const getContract = (name, web3) => {
  const contractObj = CONTRACTS[name];
  // 定义合约变量
  const readContract = new web3.eth.Contract(
    contractObj.contractJson.abi,
    contractObj.address
  );
  return readContract;
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

/**
 * format amount for string
 * @param {(string|number)} amount
 * @param {number} decimals
 * @returns {number | null}
 */
export const formatAmountForString = (amount, decimals) => {
  const decimalsValue = decimals || 18;
  return amount / Math.pow(10, decimalsValue);
};
