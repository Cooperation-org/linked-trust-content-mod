import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import EscrowFactoryAbi from '@human-protocol/core/abis/EscrowFactory.json';
import HMTokenAbi from '@human-protocol/core/abis/HMToken.json';
import EscrowAbi from '@human-protocol/core/abis/Escrow.json';
import { escrow as escrowSchema } from '../schemas/escrow';
import Web3 from 'web3';
import { CURSE_WORDS } from '../constants/curseWords';
import { Type } from '@sinclair/typebox';
import Ajv from 'ajv';

const ConfigSchema = Type.Strict(
  Type.Object({
    REC_ORACLE_ADDRESS: Type.String(),
    REP_ORACLE_ADDRESS: Type.String(),
    EX_ORACLE_ADDRESS: Type.String(),
    REC_ORACLE_URL: Type.String(),
    REP_ORACLE_URL: Type.String(),
    EX_ORACLE_URL: Type.String(),
    REC_ORACLE_PERCENTAGE_FEE: Type.Number(),
    REP_ORACLE_PERCENTAGE_FEE: Type.Number(),
    EX_ORACLE_PERCENTAGE_FEE: Type.Number(),
  })
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

class Escrow {
  private recOracleAddress = process.env.REC_ORACLE_ADDRESS as string;
  private repOracleAddress = process.env.REP_ORACLE_ADDRESS as string;
  private exOracleAddress = process.env.EX_ORACLE_ADDRESS as string;
  private recOracleUrl = process.env.REC_ORACLE_URL as string;
  private repOracleUrl = process.env.REP_ORACLE_URL as string;
  private exOracleUrl = process.env.EX_ORACLE_URL as string;
  private recOracleFee = Number(process.env.REC_ORACLE_PERCENTAGE_FEE);
  private repOracleFee = Number(process.env.REP_ORACLE_PERCENTAGE_FEE);
  private exOracleFee = Number(process.env.EX_ORACLE_PERCENTAGE_FEE);

  async setupEscrow(web3: Web3, escrowAddress: string, url: string) {
    const escrowContract = new web3.eth.Contract(
      EscrowAbi as [],
      escrowAddress
    );
    const gas = await escrowContract.methods
      .setup(
        this.repOracleAddress,
        this.recOracleAddress,
        this.exOracleAddress,
        this.repOracleFee,
        this.recOracleFee,
        this.exOracleFee,
        url,
        url
      )
      .estimateGas({ from: web3.eth.defaultAccount });
    const gasPrice = await web3.eth.getGasPrice();
    await escrowContract.methods
      .setup(
        this.repOracleAddress,
        this.recOracleAddress,
        this.exOracleAddress,
        this.repOracleFee,
        this.recOracleFee,
        this.exOracleFee,
        url,
        url
      )
      .send({ from: web3.eth.defaultAccount, gas, gasPrice });
  }

  async checkApproved(
    web3: Web3,
    tokenAddress: string,
    jobRequester: string,
    fundAmount: string
  ) {
    const hmtoken = new web3.eth.Contract(HMTokenAbi as [], tokenAddress);
    const allowance = web3.utils.toBN(
      await hmtoken.methods
        .allowance(jobRequester, web3.eth.defaultAccount)
        .call()
    );

    const balance = web3.utils.toBN(
      await hmtoken.methods.balanceOf(jobRequester).call()
    );
    console.log(
      `allowance: ${allowance}, and balance: ${balance}, default account: ${web3.eth.defaultAccount}`
    );
    return (
      allowance.gte(web3.utils.toBN(fundAmount)) &&
      balance.gte(web3.utils.toBN(fundAmount))
    );
  }

  async checkBalance(
    web3: Web3,
    tokenAddress: string,
    jobRequester: string,
    fundAmount: string
  ) {
    const hmtoken = new web3.eth.Contract(HMTokenAbi as [], tokenAddress);
    const balance = web3.utils.toBN(
      await hmtoken.methods.balanceOf(jobRequester).call()
    );
    return balance.gte(web3.utils.toBN(fundAmount));
  }

  async createEscrow(
    web3: Web3,
    factoryAddress: string,
    token: string,
    jobRequester: string,
    jobRequesterId: number
  ) {
    const escrowFactory = new web3.eth.Contract(
      EscrowFactoryAbi as [],
      factoryAddress
    );
    const gas = await escrowFactory.methods
      // add jobRequesterId
      .createEscrow(token, [jobRequester], jobRequesterId)
      // originally web3.eth.defaultAccount
      .estimateGas({ from: web3.eth.defaultAccount });
    const gasPrice = await web3.eth.getGasPrice();
    console.log(`gas: ${gas}, gasPrice: ${gasPrice}`);
    console.log(this.recOracleFee, this.repOracleFee, this.exOracleFee);
    const result = await escrowFactory.methods
      .createEscrow(token, [jobRequester], 1)
      // originally web3.eth.defaultAccount
      .send({ from: web3.eth.defaultAccount, gas, gasPrice });
    // how to check the result
    console.log(`result: ${JSON.stringify(result)}`);
    return result.events.Launched.returnValues.escrow;
  }

  async fundEscrow(
    web3: Web3,
    tokenAddress: string,
    jobRequester: string,
    escrowAddress: string,
    fundAmount: string
  ) {
    const hmtoken = new web3.eth.Contract(HMTokenAbi as [], tokenAddress);
    if (jobRequester === web3.eth.defaultAccount) {
      const gas = await hmtoken.methods
        .transfer(escrowAddress, fundAmount)
        .estimateGas({ from: web3.eth.defaultAccount });
      const gasPrice = await web3.eth.getGasPrice();
      console.log(
        `jobRequester===defaultAccount => gas: ${gas}, and gasPrice: ${gasPrice}, fundamount: ${fundAmount}`
      );
      await hmtoken.methods
        .transfer(escrowAddress, fundAmount)
        .send({ from: web3.eth.defaultAccount, gas, gasPrice });
    } else {
      const gas = await hmtoken.methods
        .transferFrom(web3.eth.defaultAccount, escrowAddress, fundAmount)
        .estimateGas({ from: web3.eth.defaultAccount });
      const gasPrice = await web3.eth.getGasPrice();
      console.log(
        `jobRequester!==defaultAccount => gas: ${gas}, and gasPrice: ${gasPrice}, fundamount: ${fundAmount}`
      );
      await hmtoken.methods
        .transferFrom(web3.eth.defaultAccount, escrowAddress, fundAmount)
        .send({ from: web3.eth.defaultAccount, gas, gasPrice });
    }
  }

  checkCurseWords(text: string): boolean {
    const words = text.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
    return CURSE_WORDS.some((w) => words.includes(w));
  }

  addOraclesData(escrow: typeof escrowSchema.properties) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = escrow as any;
    data.recordingOracleAddress = this.recOracleAddress;
    data.reputationOracleAddress = this.repOracleAddress;
    data.exchangeOracleAddress = this.exOracleAddress;
    data.recordingOracleUrl = this.recOracleUrl;
    data.reputationOracleUrl = this.repOracleUrl;
    data.exchangeOracleUrl = this.exOracleUrl;
    return data;
  }
}

const escrowPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error(
      '.env file validation failed - ' +
        JSON.stringify(validate.errors, null, 2)
    );
  }
  server.decorate('escrow', new Escrow());
};

declare module 'fastify' {
  interface FastifyInstance {
    escrow: Escrow;
  }
}

export default fp(escrowPlugin);
