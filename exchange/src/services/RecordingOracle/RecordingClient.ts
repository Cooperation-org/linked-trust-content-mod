import axiosInstance from './../../config/axiosInterceptor';

const sendFortune = async (
  escrow: string,
  fortune: string,
  recordingOracleUrl: string,
  workerAddress: string,
  chainId: number
) => {
  const body = {
    workerAddress,
    escrowAddress: escrow,
    fortune,
    chainId,
  };
  const url = recordingOracleUrl.replace(/\/+$/, '');
  await axiosInstance.post(`${url}/send-fortunes`, body);
  return;
};

export default sendFortune;
