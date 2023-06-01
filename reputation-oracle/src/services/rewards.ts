import Web3 from 'web3';
import { BAD_WORDS } from '../constants/badWords';

export interface FortuneEntry {
  fortune: string;
  score: boolean;
}

export interface ReputationEntry {
  workerAddress: string;
  reputation: number;
}

// Tech Debt: This is a temporary solution. Because the fortune example doesn't fit our cases.
// We will have to refactor it later with our reputation models. Currently we don't have any reputation models
export function filterAddressesToReward(
  web3: Web3,
  fortunesEntries: { [key: string]: FortuneEntry[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recordingOracleAddress: string
) {
  const filteredWorkers: string[] = [];
  const reputationValues: ReputationEntry[] = [];

  Object.keys(fortunesEntries).forEach((workerAddress) => {
    filteredWorkers.push(workerAddress);
    reputationValues.push({ workerAddress, reputation: 1 });
  });

  const workerAddresses = filteredWorkers.map(web3.utils.toChecksumAddress);
  return { workerAddresses, reputationValues };
}

export function checkBadWords(fortune: string) {
  const words = fortune.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');
  for (let i = 0; i < BAD_WORDS.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (words[j].toLowerCase() === BAD_WORDS[i].toString()) {
        return true;
      }
    }
  }
  return false;
}
