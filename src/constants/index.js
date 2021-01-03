import ERC20_CONTRACT from "./contracts/ERC20FixedSupply.json";
import CLAIM_CONTRACT from "./contracts/Claim.json";

export { ERC20_CONTRACT, CLAIM_CONTRACT };

export const ERC20ContractAddress =
  "0x29Ac4ed3Ad8457B6Fb75B336D688C9094AD08B4b";

// export const ERC20ContractAddress =
//   "0xdb5D970F03bfD19c1E51D57BcEd114BC35A0808f";

// export const ClaimContractAddress =
//   "0xF142C0Ff42276CfE5bF0dd1A93846FC56d85dE00";

export const ClaimContractAddress =
  "0x1a2419E43B19D9e51a59a1F16CA9895b773aE388";

export const CHAIN_ID = process.env.VUE_APP_CHAIN_ID || 1;

export const NETWORK_ID = process.env.VUE_APP_NETWORK_ID || 1;
