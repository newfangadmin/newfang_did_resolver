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
  authentication:
   [ { type: 'Secp256k1SignatureAuthentication2018',
       publicKey:
        'did:newfang:0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066#owner' } ] }
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
  //  resolver.getKeyHashSigned(file id, AccessType, privateKey of signer)
  console.log(await resolver.getKeyHashSigned("0x4de0e96b0a8886e42a2c35b57df8a9d58a93b5bff655bc37a30e2ab8e29dc066", "read", privateKey));
})();
```
Output:
```shell script
{ encrypted_key:
   '0x39867be5f9b67a02f1f9cad5784e28557c614c8024b351e6cad5f9119e268309',
  validity: 1576581590 }
```
