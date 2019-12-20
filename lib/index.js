const ethers = require('ethers');
const didJson = require('../build/NewfangDIDRegistry.json');
const Web3 = require("web3");

const AccessTypes = {
  read: ethers.utils.formatBytes32String("read"),
  reshare: ethers.utils.formatBytes32String("reshare"),
  delete: ethers.utils.formatBytes32String("delete")
};

class Resolver {
  constructor(config) {
    if (!config) {
      config = {}
    }
    this.provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider(config.provider || "https://testnet2.matic.network"));
    this.address = config.address || "0xBedE189FC89124177876012f113fd2ecFBeBa15a";
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
      access: {
        read: await this.contract.getAllUsers(did[2], AccessTypes.read),
        reshare: await this.contract.getAllUsers(did[2], AccessTypes.reshare),
        delete: await this.contract.getAllUsers(did[2], AccessTypes.delete)
      },
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

  async createDIDSigned(id, sig) {
    return await this.contract.createDIDSigned(id, sig.address, sig.v, sig.r, sig.s);
  }

  async createDIDRawTransaction(id) {
    return await this.sign(["bytes32"], [id], this.wallet.privateKey);
  }

  async generateFileId(storage_index) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(storage_index));
  }

  async shareSigned(file_id, user, accessTypes, accessKey, validity, sig) {
    return await this.contract.shareSigned(file_id, user, accessTypes, accessKey, validity, sig.address, sig.v, sig.r, sig.s)
  }

  async shareRawTransaction(file_id, user, accessTypes, accessKey, validity) {
    return await this.sign(["bytes32", "address", "bytes32", "bytes32", "uint256"], [file_id, user, accessTypes, accessKey, validity], this.wallet.privateKey);
  }

  async updateACKSigned(file_id, user, accessTypes, accessKey, validity, sig) {
    return await this.contract.updateACKSigned(file_id, user, accessTypes, accessKey, validity, sig.address, sig.v, sig.r, sig.s)
  }

  async updateRawTransaction(file_id, user, accessTypes, accessKey, validity) {
    return await this.sign(["bytes32", "address", "bytes32", "bytes32", "uint256"], [file_id, user, accessTypes, accessKey, validity], this.wallet.privateKey);
  }

  async changeOwnerSigned(id, new_owner, sig) {
    return await this.contract.changeOwnerSigned(id, new_owner, sig.address, sig.v, sig.r, sig.s);
  }

  async changeOwnerRawTransaction(id, new_owner) {
    return await this.sign(["bytes32", "address"], [id, new_owner], this.wallet.privateKey);
  }

  async fileUpdateSigned(file_id, n, k, file_size, ueb, sig) {
    return await this.contract.fileUpdateSigned(file_id, n, k, file_size, ueb, sig.address, sig.v, sig.r, sig.s);
  }

  async fileUpdateRawTransaction(file_id, n, k, file_size, ueb) {
    return await this.sign(["bytes32", "uint256", "uint256", "uint256", "string"], [file_id, n, k, file_size, ueb], this.wallet.privateKey);
  }

}

module.exports = Resolver;
