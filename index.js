import {ethers} from "ethers";
import redstone from "redstone-api";

const ethPrice = document.getElementById('eth-price')
const osethPrice = document.getElementById('oseth-price')
const oethPrice = document.getElementById('oeth-price')

// DIA Oracle for OETH/ETH
const diaAddress = "0xAB9e20E8aB03C4F9476531B3ba3A0fc522Cd0FAa"
const diaABI =
[
    // Function to get ratio of OETH to ETH.
    "function getPriceInUsd(string) view returns (uint256, uint256)"
]

// Ethers provider objects
const ethProvider = 
    new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/ca1b1cda8d6940e6af90ec7b1b8cf84d")

// Ethers contract object
const diaContract = new ethers.Contract(diaAddress, diaABI, ethProvider)

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

function round(num, digits) {
    return Math.round(num * 10**digits) / 10**digits
}

async function main() {
    ethPrice.textContent = round(await getEthPrice(), 3)
    const oeth = await getOethPrice()
    oethPrice.textContent = round(Number(ethers.formatUnits(oeth, 8)), 3)
    osethPrice.textContent = round(await getOsethPrice(), 3)
}

main()
