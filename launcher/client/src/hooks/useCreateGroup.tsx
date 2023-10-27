import { ethers } from 'ethers';
import { useState } from 'react';
import HMTokenABI from '@human-protocol/core/abis/HMToken.json';
import { ChainId, ESCROW_NETWORKS, HM_TOKEN_DECIMALS } from '../constants';
import { useAccount, useChainId, useSigner, useSwitchNetwork } from 'wagmi';
import { FortuneJobRequestType, JobLaunchResponse } from '../components/types';

import axiosInstance from './../config/axiosInterceptor';

type UseCreateGroupProps = {
  onLaunch?: () => void;
  onSuccess?: (response: JobLaunchResponse) => void;
  onFail?: (message: string) => void;
};

const useCreateGroup = ({
  onLaunch,
  onSuccess,
  onFail,
}: UseCreateGroupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const connectedChainId = useChainId();
  const { switchNetwork } = useSwitchNetwork();

  const handleLaunch = async (jobRequest: FortuneJobRequestType) => {
    if (!signer || !address) return;

    if (connectedChainId !== jobRequest.chainId) {
      switchNetwork?.(jobRequest.chainId);
      return;
    }

    setIsLoading(true);
    const data: FortuneJobRequestType = {
      ...jobRequest,
      jobRequester: address,
      token: ESCROW_NETWORKS[jobRequest.chainId as ChainId]?.hmtAddress!,
    };

    try {
      const contract = new ethers.Contract(data.token, HMTokenABI, signer);
      const jobLauncherAddress = process.env.REACT_APP_JOB_LAUNCHER_ADDRESS;
      if (!jobLauncherAddress) {
        alert('Job Launcher address is missing');
        setIsLoading(false);
        return;
      }
      const balance = await contract.balanceOf(address);
      console.log(`balance: ${balance}, and address: ${address}`);

      const fundAmount = ethers.utils.parseUnits(
        data.fundedAmt,
        HM_TOKEN_DECIMALS
      );
      console.log(`fundAmount: ${fundAmount}`);

      if (balance.lt(fundAmount)) {
        throw new Error('Balance not enough for funding the escrow');
      }
      const allowance = await contract.allowance(address, jobLauncherAddress);
      console.log(`allowance: ${allowance}`);

      if (allowance.lt(fundAmount)) {
        const tx = await contract.approve(jobLauncherAddress, fundAmount);
        const receipt = await tx.wait();
        console.log(
          `tx: ${JSON.stringify(tx)}, and receipt: ${JSON.stringify(receipt)}`
        );
      }
      if (onLaunch) onLaunch();
      const result = await axiosInstance.post('/api/groups', data);
      if (onSuccess)
        onSuccess({ escrowAddress: result.data.id, exchangeUrl: '' });
    } catch (err: any) {
      if (onFail) {
        if (err.name === 'AxiosError') onFail(err.response.data);
        else onFail(err.message);
      }
    }

    setIsLoading(false);
  };

  return { isLoading, handleLaunch };
};

export default useCreateGroup;
