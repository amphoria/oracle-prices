import {ethers} from "ethers"
import redstone from "redstone-api"

const ethPrice = document.getElementById('eth-price')
const osethPrice = document.getElementById('oseth-price')
const oethPrice = document.getElementById('oeth-price')
const primeEthPriceRatio = document.getElementById('prime-eth-ratio')
const primeEthPrice = document.getElementById('prime-eth-price')

// DIA Oracle for OETH/ETH
const diaAddress = "0xAB9e20E8aB03C4F9476531B3ba3A0fc522Cd0FAa"
const diaABI =
[
    // Function to get ratio of OETH to ETH.
    "function getPriceInUsd(string) view returns (uint256, uint256)"
]

// primeETH Oracle
const primeETHOracleAddress = "0xA755c18CD2376ee238daA5Ce88AcF17Ea74C1c32"
const primeETHOracleABI = 
[
    // Function to get primeETH price as a ratio of ETH price
    "function primeETHPrice() view returns (uint256)"
]

// Ethers provider objects
// const ethProvider = 
//     new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY)
const ethProvider = 
    new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")

// Ethers contract objects
const diaContract = new ethers.Contract(diaAddress, diaABI, ethProvider)
const primeETHOracleContract = new ethers.Contract(primeETHOracleAddress, 
                                                   primeETHOracleABI, 
                                                   ethProvider)

async function getEthPrice() {
    const redstonePrice = await redstone.getPrice("ETH")
    return redstonePrice.value
}

async function getOethPrice() {
    const oethPrice = await diaContract.getPriceInUsd("OETH/USD")
    return oethPrice[0]
}

async function getOsethPrice() {
    const redstonePrice = await redstone.getPrice("osETH")
    return redstonePrice.value
}

async function getPrimeEthRatio() {
    const primeEthRatio = await primeETHOracleContract.primeETHPrice()
    return primeEthRatio
}

function round(num, digits) {
    return Math.round(num * 10**digits) / 10**digits
}

async function main() {
    const ethPriceUsd = await getEthPrice()
    ethPrice.textContent = round(ethPriceUsd, 3)
    const oeth = await getOethPrice()
    oethPrice.textContent = round(Number(ethers.formatUnits(oeth, 8)), 3)
    osethPrice.textContent = round(await getOsethPrice(), 3)
    const primeEthRatio = round(Number(ethers.formatUnits(await getPrimeEthRatio(), 18)), 8)
    primeEthPriceRatio.textContent = primeEthRatio
    primeEthPrice.textContent = round(ethPriceUsd * primeEthRatio, 3)
}

main()
