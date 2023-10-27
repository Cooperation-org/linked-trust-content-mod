import {
  EscrowClient,
  StakingClient,
  NETWORKS,
  ChainId,
  NetworkData,
} from '@human-protocol/sdk';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://polygon-mumbai.gateway.tenderly.co/1y380tTjoK90DTfiunNJZT'
);

const network: NetworkData = NETWORKS[ChainId.POLYGON_MUMBAI]!;
const privateKey = process.env.ETH_PRIVATE_KEY as string;

const signer = new ethers.Wallet(privateKey, provider);

export const createEscrowClient = async () => {
  const escrowClient = new EscrowClient(signer, network);
  return escrowClient;
};

export const createStakingClientAndApproveStake = async (amount: string) => {
  const stakingClient = new StakingClient(signer, network);
  await stakingClient.approveStake(ethers.BigNumber.from(amount));
  await stakingClient.stake(ethers.BigNumber.from(amount));
};

export const createEscrowAddress = async (
  escrowClient: EscrowClient,
  token: string,
  trustedHandlers: string[],
  jobRequesterId: string
) => {
  const escrowAddress = await escrowClient.createEscrow(
    token,
    trustedHandlers,
    jobRequesterId
  );
  return escrowAddress;
};

export const fundEscrowAddress = async (
  escrowClient: EscrowClient,
  escrow: string,
  amount: string
) => {
  const fundAmount = ethers.utils.parseUnits(amount, 18);
  await escrowClient.fund(escrow, fundAmount);
};

export const setUpEscrow = async (
  escrowClient: EscrowClient,
  escrowAddress: string,
  manifestUrl: string
) => {
  const recOracleAddress = process.env.REC_ORACLE_ADDRESS as string;
  const repOracleAddress = process.env.REP_ORACLE_ADDRESS as string;
  const exOracleAddress = process.env.EX_ORACLE_ADDRESS as string;
  const recOracleFee = Number(process.env.REC_ORACLE_PERCENTAGE_FEE);
  const repOracleFee = Number(process.env.REP_ORACLE_PERCENTAGE_FEE);
  const exOracleFee = Number(process.env.EX_ORACLE_PERCENTAGE_FEE);
  await escrowClient.setup(escrowAddress, {
    recordingOracle: recOracleAddress,
    reputationOracle: repOracleAddress,
    exchangeOracle: exOracleAddress,
    recordingOracleFee: ethers.BigNumber.from(recOracleFee),
    reputationOracleFee: ethers.BigNumber.from(repOracleFee),
    exchangeOracleFee: ethers.BigNumber.from(exOracleFee),
    manifestUrl: manifestUrl,
    manifestHash: 'test',
  });
};
