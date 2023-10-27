import { Type } from '@sinclair/typebox';
import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { escrow as escrowSchema } from '../schemas/escrow';
import {
  ChainId,
  ESCROW_NETWORKS,
  IEscrowNetwork,
} from '../constants/networks';
// import {
//   createEscrowClient,
//   createStakingClientAndApproveStake,
//   createEscrowAddress,
//   setUpEscrow,
//   fundEscrowAddress,
// } from '../plugins/escrowSdk';
import { EscrowClient, StakingClient } from '@human-protocol/sdk';
import { ethers } from 'ethers';

const escrowPreValidations = function (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const escrowData = request.body as typeof escrowSchema.properties;
  const fiat = escrowData?.fiat
    ? JSON.parse(escrowData?.fiat?.toString())
    : false;
  const paymentId = escrowData?.paymentId?.toString();
  if (request.url === '/escrow' && fiat && !paymentId)
    done(new Error('Invalid Payment Id'));
  const chainId = Number(escrowData.chainId) as ChainId;
  if (!chainId) done(new Error('Invalid Chain Id'));
  const network = ESCROW_NETWORKS[chainId];
  if (!network) done(new Error('Chain Id not supported'));
  done(undefined);
};

const provider = new ethers.providers.JsonRpcProvider(
  'https://polygon-mumbai.gateway.tenderly.co/1y380tTjoK90DTfiunNJZT'
);

// const network: NetworkData = NETWORKS[cid.POLYGON_MUMBAI]!;
const privateKey = process.env.ETH_PRIVATE_KEY as string;

const signer = new ethers.Wallet(privateKey, provider);

export const createEscrow: FastifyPluginAsync = async (server) => {
  let escrowData: typeof escrowSchema.properties;

  server.post(
    '/check-escrow',
    {
      preValidation: [escrowPreValidations],
      schema: {
        body: escrowSchema,
        response: {
          200: Type.Boolean(),
        },
      },
    },
    async function (request, reply) {
      const { escrow } = server;

      escrowData = request.body as typeof escrowSchema.properties;
      const description = escrowData.description as unknown as string;
      const title = escrowData.title as unknown as string;
      if (escrow.checkCurseWords(description) || escrow.checkCurseWords(title))
        return reply
          .status(400)
          .send('Title or description contains curse words');

      return true;
    }
  );

  server.post(
    '/escrow',
    {
      preValidation: [escrowPreValidations],
      schema: {
        body: escrowSchema,
        response: {
          200: Type.Object({
            escrowAddress: Type.String(),
            exchangeUrl: Type.String(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { escrow, s3, web3, stripe, currency } = server;

      const escrowClient = await EscrowClient.build(signer);

      escrowData = request.body as typeof escrowSchema.properties;
      const chainId = Number(escrowData.chainId) as ChainId;
      const escrowNetwork = ESCROW_NETWORKS[chainId] as IEscrowNetwork;
      const fiat = escrowData?.fiat
        ? JSON.parse(escrowData?.fiat?.toString())
        : false;

      let funderAddress: string, fundAmount: any;
      const web3Client = web3.createWeb3(escrowNetwork);
      const jobRequester = escrowData.jobRequester as unknown as string;
      const token = escrowData.token as unknown as string;
      console.log(`fiat in /escrow endpoint: ${fiat}`);
      if (fiat) {
        funderAddress = web3Client.eth.defaultAccount as string;
        const payment = await stripe.getPayment(
          escrowData.paymentId.toString()
        );
        if (!payment || payment.status !== 'succeeded') {
          return reply
            .status(400)
            .send('Payment not found or has not yet been made correctly');
        }
        fundAmount = web3Client.utils.toWei(
          (
            await currency.getHMTPrice(payment.amount / 100, payment.currency)
          ).toString(),
          'ether'
        );

        if (
          !(await escrow.checkBalance(
            web3Client,
            token,
            funderAddress,
            fundAmount
          ))
        ) {
          return reply
            .status(400)
            .send(
              `Balance not enough for funding the escrow for payment ${payment.id}`
            );
        }
      } else {
        //originally jobRequester
        funderAddress = jobRequester;
        fundAmount = ethers.utils.parseUnits(
          Number(escrowData.fundAmount).toString(),
          'ether'
        );
        console.log(
          `fundAmount before checkApproved: ${fundAmount}, and escrowData.fundAmount: ${escrowData.fundAmount}`
        );
        const isApproved = await escrow.checkApproved(
          web3Client,
          token,
          funderAddress,
          fundAmount
        );
        if (!isApproved) {
          return reply
            .status(400)
            .send('Balance or allowance not enough for funding the escrow');
        }
      }
      const description = escrowData.description as unknown as string;
      const title = escrowData.title as unknown as string;
      if (escrow.checkCurseWords(description) || escrow.checkCurseWords(title))
        return reply
          .status(400)
          .send('Title or description contains curse words');

      // const escrowAddress = await escrow.createEscrow(
      //   web3Client,
      //   escrowNetwork.factoryAddress,
      //   token,
      //   jobRequester,
      //   Number(escrowData.groupId)
      // );
      const stakeAmount = ethers.utils.parseUnits('1', 'ether');
      const stakingClient = await StakingClient.build(signer);
      await stakingClient.approveStake(stakeAmount);
      await stakingClient.stake(stakeAmount);
      const escrowAddress = await escrowClient.createEscrow(
        token,
        [jobRequester],
        String(escrowData.groupId)
      );
      console.log(`escrowaddress: ${escrowAddress}`);
      // await escrow.fundEscrow(
      //   web3Client,
      //   token,
      //   funderAddress,
      //   escrowAddress,
      //   fundAmount
      // );
      await escrowClient.fund(escrowAddress, fundAmount);
      const data = escrow.addOraclesData(escrowData);
      const url = await s3.uploadManifest(data, escrowAddress);
      // await escrow.setupEscrow(web3Client, escrowAddress, url);
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
        manifestUrl: url,
        manifestHash: 'test',
      });
      return {
        escrowAddress,
        exchangeUrl: `${data.exchangeOracleUrl}?address=${escrowAddress}`,
      };
    }
  );
};
