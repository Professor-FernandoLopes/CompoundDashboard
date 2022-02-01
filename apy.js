import Compound from '@compound-finance/compound-js';

const provider = 'https://speedy-nodes-nyc.moralis.io/a8942853640224a30fdad066/eth/mainnet';

const blocksPerDay = 4 * 60 * 24; // 4 blocks in 1 minute
const daysPerYear = 365;
const ethMantissa = Math.pow(10, 18); // 1 * 10 ^ 18

// recebe o endereço do cToken
async function calculateSupplyApy(cToken) {

// taxa por bloco não por ano
const supplyRatePerBlock = await Compound.eth.read(
    cToken,
    'function supplyRatePerBlock() returns (uint)',
    [],
    { provider }
  );

/* 
multiplica por cem para transformar tudo em percentual
o supply rate por bloco está multiplicado por 10**18, por isso
dividimos por ethMantissa
Multiplica por blocks per day para ter o resultado por dia
queremos apenas a décima parte por isso removemos 1
removemos 1 também porque 
*/
  return 100 * (Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear - 1) - 1);
}

  async function calculateApy(cToken, ticker) {         
  
 
  const cTokenAddress = Compound.util.getAddress(cToken);
  
  const [supplyApy] = await Promise.all([
   
    calculateSupplyApy(cTokenAddress),
    ]);
  
  return {ticker, supplyApy};

}

export default calculateApy;

// compSpeed= quantidade de comp tokens dada para lenders and borrowers no bloco atual
// totalSupply do cToken depende da quantidade de lenders