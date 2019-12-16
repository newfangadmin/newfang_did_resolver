const assert = require('assert');
const Resolver = require('../lib/index');
let resolver;
describe('Import and class initialization', async () => {
  it('initialize', async () => {
    resolver = new Resolver({privateKey: "0x637b316da08aa597df18f7f91b4da5d7cf0d7af777984284fb3fe755f3346284"});
    assert.ok(resolver.wallet.address, "Wallet not defined");
  });

  it('optional parameters', async () => {
    let config = {
      privateKey: "0x637b316da08aa597df18f7f91b4da5d7cf0d7af777984284fb3fe755f3346284",
      provider: "https://testnet2.matic.network",
      address: "0x0D6ABA8102dBE478817275B663B87d624224EF21"
    };
    let reolver_optional = new Resolver(config);
    assert.ok(reolver_optional.provider.connection.url === config.provider,"Provider not set");
    assert.ok(reolver_optional.address === config.address, "Address not set");
  });

  // it('Connect to contract', async()=>{
  //
  // });
});
