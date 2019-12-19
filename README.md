# Newfang DID Resolver
Initialize the Resolver
```javascript
const Resolver = require('newfang-did-resolver');
let resolver = new Resolver();

//resolver.resolve('did:newfang:<newfang_specific_id>');

(async() => {
    console.log(await resolver.resolve('did:newfang:0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066'))
})();
```

Output:
```shell script
{ '@context': 'https://w3id.org/did/v1',
  id:
   'did:newfang:0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066',
  publicKey:
   [ { id:
        'did:newfang:0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066#owner',
       type: 'Secp256k1VerificationKey2018',
       owner: '0x5089E1c3742Ab4fD0e25837637488D74FFEB58e2',
       newfangSpecificId:
        '0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066' } ],
  access:
   { read: [ '0xC8e1F3B9a0CdFceF9fFd2343B943989A22517b26' ],
     reshare: [],
     delete: [] },
  authentication:
   [ { type: 'Secp256k1SignatureAuthentication2018',
       publicKey:
        'did:newfang:0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066#owner' } ] }
```
To generate Newfang Specific Id from storage Index
```javascript
let file_id = await resolver.generateFileId('<storage index>');
```

To call the contract functions, private key must be provided. There are two ways to achieve this.
+ During initialization
```javascript
//Resolver('<private Key>');
let privateKey = "0x637b316da08aa597df18f7f91b4da5d7cf0d7af777984284fb3fe755f3346284";
let resolver = new Resolver(privateKey);
```
+ To set private Key using setPrivateKey function
```javascript
resolver.setPrivateKey(privateKey);
```
Contract Functions:
```javascript
(async() => {
let tx = await resolver.contract.nonce('0x5089E1c3742Ab4fD0e25837637488D74FFEB58e2');
await tx.wait();
console.log(tx.hash);
})();
```

Signed Functions:
```javascript
(async() => {
    let file_id = "0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066";

    
    let client_resolver = new Resolver({privateKey: "24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA"});
    let sig = await client_resolver.getKeyHashRawTransaction(file_id, "read");
    
    console.log(await resolver.getKeyHashSigned(file_id, "read", sig));
})();
```
Output:
```shell script
{ encrypted_key:
   '0x39867be5f9b67a02f1f9cad5784e28557c614c8024b351e6cad5f9119e268309',
  validity: 1576581590 }
```
Update ACK Signed
```javascript
let client_resolver = new Resolver({privateKey: "24C4FE6063E62710EAD956611B71825B778B041B18ED53118CE5DA5F02E494BA"});
let sig = await client_resolver.updateRawTransaction(fileId, wallet.address, AccessTypes["read"], ethers.utils.hashMessage("<access-key>"), 0);
let tx = await resolver.updateACKSigned(fileId, wallet.address, AccessTypes["read"], ethers.utils.hashMessage("<access-key>"), 0, sig);
await tx.wait();
console.log(tx.hash);    
```
