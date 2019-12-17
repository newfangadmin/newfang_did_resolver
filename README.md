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
