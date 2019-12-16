const ethers = require('ethers');
const didJson = require('../build/NewfangDIDRegistry.json');
const Web3 = require("web3");

class Resolver {
  constructor(config) {
    this.provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider(config.provider || "https://testnet2.matic.network"));
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.address = config.address || "0x0D6ABA8102dBE478817275B663B87d624224EF20"

  }
}

module.exports = Resolver;
