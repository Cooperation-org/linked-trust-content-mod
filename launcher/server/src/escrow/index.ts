import { escrow as escrowSchema } from '../schemas/escrow';
import { getS3 } from '../plugins/s3';
import { getEscrow } from '../plugins/escrow';
import { getWeb3Client } from '../plugins/web3';
import { getStripeClient } from '../plugins/stripe';
import { getCurrency } from '../plugins/currency';
import {
  ChainId,
  ESCROW_NETWORKS,
  IEscrowNetwork,
} from '../constants/networks';

export const createEscrow = async (
  escrowData: typeof escrowSchema.properties
) => {
  const escrow = getEscrow();
  const s3 = getS3();
  const web3 = getWeb3Client();
  const stripe = getStripeClient();
  const currency = getCurrency();

  const chainId = Number(escrowData.chainId) as ChainId;
  const escrowNetwork = ESCROW_NETWORKS[chainId] as IEscrowNetwork;
  const fiat = escrowData?.fiat
    ? JSON.parse(escrowData?.fiat?.toString())
    : false;

  let funderAddress: string, fundAmount: string;
  const web3Client = web3.createWeb3(escrowNetwork);
  const jobRequester = escrowData.jobRequester as unknown as string;
  const token = escrowData.token as unknown as string;

  if (fiat) {
    funderAddress = web3Client.eth.defaultAccount as string;
    const payment = await stripe.getPayment(escrowData.paymentId.toString());
    if (!payment || payment.status !== 'succeeded') {
      console.log('Payment not found or has not yet been made correctly');
    }
    fundAmount = web3Client.utils.toWei(
      (
        await currency.getHMTPrice(payment.amount / 100, payment.currency)
      ).toString(),
      'ether'
    );

    if (
      !(await escrow.checkBalance(web3Client, token, funderAddress, fundAmount))
    ) {
      console.log(
        `Balance not enough for funding the escrow for payment ${payment.id}`
      );
    }
  } else {
    funderAddress = jobRequester;
    fundAmount = web3Client.utils.toWei(
      Number(escrowData.fundAmount).toString(),
      'ether'
    );
    if (
      !(await escrow.checkApproved(
        web3Client,
        token,
        funderAddress,
        fundAmount
      ))
    ) {
      console.log('Balance or allowance not enough for funding the escrow');
    }
  }

  const description = escrowData.description as unknown as string;
  const title = escrowData.title as unknown as string;
  if (escrow.checkCurseWords(description) || escrow.checkCurseWords(title))
    console.log('Balance or allowance not enough for funding the escrow');

  const escrowAddress = await escrow.createEscrow(
    web3Client,
    escrowNetwork.factoryAddress,
    token,
    jobRequester
  );
  await escrow.fundEscrow(
    web3Client,
    token,
    funderAddress,
    escrowAddress,
    fundAmount
  );
  const data = escrow.addOraclesData(escrowData);
  const url = await s3.uploadManifest(data, escrowAddress);
  const fortunesRequested = Number(escrowData.fortunesRequired);
  await escrow.setupEscrow(web3Client, escrowAddress, url, fortunesRequested);
  return escrowAddress;
};
