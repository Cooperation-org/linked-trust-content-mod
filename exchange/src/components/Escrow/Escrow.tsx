// import EscrowABI from '@human-protocol/core/abis/Escrow.json';
import {
  // getContract,
  getProvider,
} from '@wagmi/core';
import axios from 'axios';
// import { ethers } from 'ethers';
import {
  // useCallback,
  // useEffect,
  useState,
} from 'react';
import { useAccount, useNetwork } from 'wagmi';
// import sendFortune from '../../services/RecordingOracle/RecordingClient';
import './Escrow.css';
import { EscrowDetails } from './EscrowDetails';
import { JobDetail } from './JobDetail';
import { ModList } from './ModList';

// const statusesMap = [
//   'Launched',
//   'Pending',
//   'Partial',
//   'Paid',
//   'Complete',
//   'Cancelled',
// ];

interface Content {
  id: number;
  url: string;
  message?: string;
  jobId: number;
  status: string;
  updateHook: string;
  imgUrl: string;
  isThread?: boolean | null;
  fullThread?: string | { [key: string]: any };
}
interface JobDetail {
  id: number;
  title: string;
  description: string;
  groupId: number;
  contentId: null | number | string;
  reviewersRequired: number;
  fundAmount: number;
  escrowAddress: string;
  group: { [key: string]: any };
  content: Content;
}

interface JobDetail {}

// function parseQuery(qs: any) {
//   const result: string[] = [];
//   if (qs.length === 0) {
//     return {};
//   }

//   if (qs[0] === '?') {
//     qs = qs.slice(1);
//   }

//   const kvs = qs.split('&');

//   for (let kv of kvs) {
//     const kvArr = kv.split('=');

//     if (kvArr.length > 2) {
//       continue;
//     }

//     const key = kvArr[0];
//     const value = kvArr[1];

//     result[key] = value;
//   }

//   return result;
// }

export const Escrow = () => {
  const { address } = useAccount();
  // const { chain } = useNetwork();
  // const provider = getProvider();

  const [jobDetail, setJobDetails] = useState<JobDetail>();
  const [escrowAddress, setEscrowAddress] = useState('');

  const [page, setPage] = useState('');
  const [mods, setMods] = useState([]);
  const [modDetail, setModDetail] = useState({});

  // const setMainEscrow = useCallback(
  //   async (address: string) => {
  //     setEscrow(address);
  //     const Escrow = getContract({
  //       address,
  //       abi: EscrowABI,
  //       signerOrProvider: provider,
  //     });

  //     const escrowSt = await Escrow.status();
  //     setEscrowStatus(statusesMap[escrowSt]);

  //     const balance = await Escrow.getBalance();
  //     setBalance(ethers.utils.formatEther(balance));

  //     const manifestUrl = await Escrow.manifestUrl();
  //     if (manifestUrl) {
  //       const manifestContent = (await axios.get(manifestUrl)).data;

  //       setRecordingOracleUrl(manifestContent.recordingOracleUrl);
  //     }
  //     return;
  //   },
  //   [provider]
  // );

  // useEffect(() => {
  //   const qs: any = parseQuery(window.location.search);
  //   const address = qs.address;
  //   if (ethers.utils.isAddress(address)) {
  //     setMainEscrow(ethers.utils.getAddress(address));
  //   }
  // }, [setMainEscrow]);

  // const send = async () => {
  //   await sendFortune(
  //     escrow,
  //     fortune,
  //     recordingOracleUrl,
  //     address as string,
  //     chain?.id as number
  //   );
  //   alert('Your fortune has been submitted');
  //   setFortune('');
  //   return;
  // };

  const fetchEscrowDetail = async () => {
    const fetchJobUrl = `/api/jobs/escrow/${escrowAddress}`;
    const response = await axios.get(fetchJobUrl);
    setJobDetails(response.data);
    setPage('viewJob');
  };

  const fetchModList = (jobId: string) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: '/api/job/' + jobId + '/content/',
    };
    axios
      .request(config)
      .then((response) => {
        setMods(response.data);
        setPage('viewMilestone');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateRisk = async (contentId: string, riskStatus: string) => {
    if (jobDetail) {
      const riskUpdateURL = `/api/jobs/${jobDetail.id}/content/${contentId}/review/`;

      let risk: boolean = false;
      let notRisk: boolean = false;
      if (riskStatus === 'Risk') {
        risk = true;
        notRisk = false;
      } else {
        notRisk = true;
        risk = false;
      }

      const data = {
        address,
        status: riskStatus,
        risk,
        notRisk,
      };
      await axios.post(riskUpdateURL, data);
    } else {
      alert('No job detail!!!');
    }
  };

  return (
    <div className="escrow-container">
      <div className="escrow-view">
        <div>
          <input
            onChange={(e) => setEscrowAddress(e.target.value)}
            value={escrowAddress}
            style={{ marginRight: '10px' }}
          />
          <button type="button" onClick={fetchEscrowDetail}>
            Confirm
          </button>
        </div>

        {page === 'escrowDetails' && (
          <EscrowDetails
            escrowDetail={jobDetail}
            fetchModList={(jobId: string) => fetchModList(jobId)}
          />
        )}

        {page === 'viewMilestone' && (
          <ModList
            mods={mods}
            updatePage={(pageName: string) => setPage(pageName)}
            updateModDetail={(detail: Object) => setModDetail(detail)}
          />
        )}

        {page === 'viewJob' && (
          <JobDetail
            jobDetail={jobDetail}
            updateRisk={updateRisk}
            updatePage={(pageName: string) => setPage(pageName)}
          />
        )}

        {/* <span>
          Fill the exchange address to pass the fortune to the recording oracle
        </span>
        <span>
          <b>Address: </b> {escrow}
        </span>
        <span>
          <b>Status: </b> {escrowStatus}
        </span>
        <span>
          <b>Balance: </b> {balance}
        </span>
        <div>
          <input onChange={(e) => setFortune(e.target.value)} />
          <button type="button" onClick={send}>
            Send Fortune
          </button>
        </div> */}
      </div>
    </div>
  );
};
