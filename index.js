import {ethers} from "ethers"
import redstone from "redstone-api"

const ethPrice = document.getElementById('eth-price')
const osethPrice = document.getElementById('oseth-price')
const oethPrice = document.getElementById('oeth-price')
const primeEthPriceRatio = document.getElementById('prime-eth-ratio')
const primeEthPrice = document.getElementById('prime-eth-price')
const reETHPriceRatio = document.getElementById('reeth-price-ratio')
const ukrePrice = document.getElementById('ukre-price')

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

// UKRE price
const ukreAddress = "0x835d3E1C0aA079C6164AAd21DCb23E60eb71AF48"
const ukreABI =
[
    "function getSharePrice() view returns (uint256)"
]

// Ethers provider objects
const ethProvider = 
    new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/JTXUw4DQJ0PEVskCBSsadhBnk3rkd4vN")
// const realProvider = new ethers.JsonRpcProvider("https://real.drpc.org")
const realProvider = new ethers.JsonRpcProvider("https://tangible-real.gateway.tenderly.co/29G4PChJRVFiAJiyQg1FnC")

// Ethers contract objects
const diaContract = new ethers.Contract(diaAddress, diaABI, ethProvider)
const primeETHOracleContract = new ethers.Contract(primeETHOracleAddress, 
                                                   primeETHOracleABI, 
                                                   ethProvider)
const reETHContract = new ethers.Contract(reETHAddress, reETHABI, ethProvider)
const ukreContract = new ethers.Contract(ukreAddress, ukreABI, realProvider)

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

async function getUKREPrice() {
    const ukrePrice = await ukreContract.getSharePrice()
    return ukrePrice
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
    ukrePrice.textContent = ethers.formatUnits(await getUKREPrice())
}

main()
