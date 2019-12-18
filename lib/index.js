const ethers = require('ethers');
const didJson = require('../build/NewfangDIDRegistry.json');
const Web3 = require("web3");

class Resolver {
  constructor(config) {
    if (!config) {
      config = {}
    }
    this.provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider(config.provider || "https://testnet2.matic.network"));
    this.address = config.address || "0xc1c5D409595f0f912fF050Ce136f6c5EB5399DEE";
    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey, this.provider);
      this.contract = new ethers.Contract(this.address, didJson.abi, this.wallet);
    } else {
      this.contract = new ethers.Contract(this.address, didJson.abi, this.provider);
    }
  }

  async setPrivateKey(privateKey) {
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(this.address, didJson.abi, this.wallet);
  }

  async sign(types, values, key) {
    let signer = new ethers.Wallet(key);
    types.push("uint256");
    values.push(await this.contract.nonce(signer.address));
    let payload = ethers.utils.defaultAbiCoder.encode(types, values);
    let payloadHash = ethers.utils.keccak256(payload);
    let signature = await signer.signMessage(ethers.utils.arrayify(payloadHash));
    let sig = ethers.utils.splitSignature(signature);
    sig.address = signer.address;
    return sig;
  }

  async resolve(didString) {
    let did = didString.split(":");
    if (did.length !== 3) {
      return {error: "Invalid DID"}
    }
    if (did[0].toLowerCase() !== "did") {
      return {error: "Invalid DID. DID should start with 'did',or 'DID'"}
    }
    if (did[1].toLowerCase() !== "newfang") {
      return {error: "Invalid DID. It is not a newfang DID. Newfang did is of format did:newfang:<newfang-spcific-id>"};
    }
    if (did[2].length !== 66) {
      return {error: "Invalid DID. Newfang specific id should be of length 66"}
    }
    let owner = await this.contract.owners(did[2]);
    return {
      '@context': 'https://w3id.org/did/v1',
      id: didString,
      publicKey:
        [{
          id: `${didString}#owner`,
          type: 'Secp256k1VerificationKey2018',
          owner: `${owner}`,
          newfangSpecificId: `${did[2]}`
        }],
      authentication:
        [{
          type: 'Secp256k1SignatureAuthentication2018',
          publicKey: `${didString}#owner`
        }]
    };
  }

  async getKeyHashSigned(id, access_type, sig) {
    access_type = ethers.utils.formatBytes32String(access_type);
    let tx = await this.contract.getKeyHashSigned(id, access_type, sig.address, sig.v, sig.r, sig.s);
    let data = await tx.wait();
    let result = {};
    result.encrypted_key = data.events[0].args[0];
    result.validity = parseInt(data.events[0].args[1]);
    return result;
  }

  async getKeyHashRawTransaction(id, access_type) {
    return await this.sign(["bytes32", "bytes32"], [id, ethers.utils.formatBytes32String(access_type)], this.wallet.privateKey);
  }


}

module.exports = Resolver;
