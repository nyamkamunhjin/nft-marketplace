import '@nomiclabs/hardhat-waffle';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
// This adds support for typescript paths mappings

dotenv.config();

const privateKey = process.env.METAMASK_PRIVATE_KEY || '';
const projectId = process.env.PROJECT_ID || '';

export default {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbat: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey],
    },
  },
  solidity: '0.8.4',
} as HardhatUserConfig;
