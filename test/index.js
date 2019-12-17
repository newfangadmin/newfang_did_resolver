const assert = require('assert');
const Resolver = require('../lib/index');
const ethers = require('ethers');
let resolver, wallet;

let IDs = [
  "0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066",
  "0x3d725c5ee53025f027da36bea8d3af3b6a3e9d2d1542d47c162631de48e66c1c",
  "0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe"
];

let privateKey = "0x637b316da08aa597df18f7f91b4da5d7cf0d7af777984284fb3fe755f3346284";

let AccessTypes = {
  read: ethers.utils.formatBytes32String("read"),
  reshare: ethers.utils.formatBytes32String("reshare"),
  delete: ethers.utils.formatBytes32String("delete")
};
describe('Import and class initialization', async () => {
  it('initialize', async () => {
    resolver = new Resolver({privateKey: privateKey});
    assert.ok(resolver.wallet.address, "Wallet not defined");
  });


  it('Connect to contract', async () => {
    assert.ok(resolver.contract, "Conract not connected");
  });

  it('optional parameters', async () => {
    let config = {
      privateKey: privateKey,
      provider: "https://testnet2.matic.network",
      address: "0x86e9541EE9aB0Bd0848Bcf7B5ED8A3c3B58Ce186"
    };
    let reolver_optional = new Resolver(config);
    assert.ok(reolver_optional.provider.connection.url === config.provider, "Provider not set");
    assert.ok(reolver_optional.address === config.address, "Address not set");
  });

  it('Sign', async () => {
    wallet = new ethers.Wallet(privateKey);
    let sig = (await resolver.sign(["bytes32", "bytes32"], [IDs[1], AccessTypes.read], wallet.privateKey));
    assert.ok(sig.v === 28 || sig.v === 27, `Expected 28 or 27 but got ${sig.v}`);
    assert.ok(sig.r.length === 66, `Length of R expected to be 66 but got ${sig.r.length}`);
    assert.ok(sig.s.length === 66, `Length of S expected to be 66 but got ${sig.s.length}`);
  });

  it('Resolve', async () => {
    let id = IDs[0];
    let doc = (await resolver.resolve(`did:newfang:${id}`));
    assert.ok(doc.publicKey[0].newfangSpecificId === id, `Expected ${id} but got ${doc.publicKey[0].newfangSpecificId}`);
  });

  it('Get Key Hash Signed', async () => {
    // let test_wallet = new ethers.Wallet("24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA");
    // let tx = await resolver.contract.share(IDs[0], test_wallet.address, AccessTypes.read, ethers.utils.hashMessage("asdf"), 120);
    // await tx.wait();
    let client_resolver = new Resolver({privateKey: "24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA"});
    let sig = await client_resolver.getKeyHashRawTransaction(IDs[0], "read");
    let data = await resolver.getKeyHashSigned(IDs[0], "read", sig);
    assert.ok(data.validity, `validity should be non zero`);
  });

  it('Resolver without any parameter', async () => {
    let r = new Resolver();
    let id = IDs[0];
    let doc = (await r.resolve(`did:newfang:${id}`));
    assert.ok(doc.publicKey[0].newfangSpecificId === id, `Expected ${id} but got ${doc.publicKey[0].newfangSpecificId}`);
  });

  it('Set Private Key', async () => {
    let r = new Resolver();
    r.setPrivateKey(privateKey);
    assert.ok(r.wallet.privateKey === privateKey, `Private key not set`);
  });
});
