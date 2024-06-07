import {ethers} from "ethers"
import redstone from "redstone-api"

const ethPrice = document.getElementById('eth-price')
const osethPrice = document.getElementById('oseth-price')
const oethPrice = document.getElementById('oeth-price')
const primeEthPriceRatio = document.getElementById('prime-eth-ratio')
const primeEthPrice = document.getElementById('prime-eth-price')
const reETHPriceRatio = document.getElementById('reeth-price-ratio')
const ustbPriceRatio = document.getElementById('ustb-price-ratio')
const arcUSDPriceRatio = document.getElementById('arcusd-price-ratio')

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

// reETH price
const reETHAddress = "0xC0Cc5eA00cAe0894B441E3B5a3Bb57aa92F15421"
const reETHABI = 
[
    "function tokenPrice() view returns (uint256)"
]

// USTB Price
const ustbAddress = "0x83feDBc0B85c6e29B589aA6BdefB1Cc581935ECD"
const ustbABI =
[
    "function rebaseIndex() view returns (uint256)"
]

// arcUSD Price
const arcUSDAddress = "0xAEC9e50e3397f9ddC635C6c429C8C7eca418a143"
const arcUSDABI =
[
    "function rebaseIndex() view returns (uint256)"
]


// Ethers provider objects
// const ethProvider = 
//     new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY)
const ethProvider = 
    new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")
const realProvider = new ethers.JsonRpcProvider("https://real.drpc.org")

// Ethers contract objects
const diaContract = new ethers.Contract(diaAddress, diaABI, ethProvider)
const primeETHOracleContract = new ethers.Contract(primeETHOracleAddress, 
                                                   primeETHOracleABI, 
                                                   ethProvider)
const reETHContract = new ethers.Contract(reETHAddress, reETHABI, ethProvider)
const ustbContract = new ethers.Contract(ustbAddress, ustbABI, realProvider)
const arcUSDContract = new ethers.Contract(arcUSDAddress, arcUSDABI, realProvider)

function round(num, digits) {
    return Math.round(num * 10**digits) / 10**digits
}

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

async function getREETHPriceRatio() {
    const reETHPriceRatio = await reETHContract.tokenPrice()
    return reETHPriceRatio
}

async function getUSTBPriceRatio() {
    const ustbPriceRatio = await ustbContract.rebaseIndex()
    return ustbPriceRatio
}

async function getarcUSDPriceRatio() {
    const arcUSDPriceRatio = await arcUSDContract.rebaseIndex()
    return arcUSDPriceRatio
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
    const reEthRatio = ethers.formatUnits(await getREETHPriceRatio())
    reETHPriceRatio.textContent = reEthRatio
    const ustbRatio = ethers.formatUnits(await getUSTBPriceRatio())
    ustbPriceRatio.textContent = ustbRatio
    const arcUSDRatio = ethers.formatUnits(await getarcUSDPriceRatio())
    arcUSDPriceRatio.textContent = arcUSDRatio
}

main()
