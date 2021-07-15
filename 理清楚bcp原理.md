- 正常过程梳理第一遍

| 函数 | 文件 |
| -------- | -------- |
| Mnemonic   | jsbip39.js   |
| libs.bitcoin.HDNode.fromSeedHex | big39-libs.nor.js |

```javascript
function calcBip32ExtendedKey(path) {
    var extendedKey = libs.bitcoin.HDNode.fromSeedHex(seed,network);
    // Derive the key from the path
    var pathBits = path.split("/");
    for (var i=0; i<pathBits.length; i++) {
        var bit = pathBits[i];
        var index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        extendedKey = extendedKey.deriveHardened(index);
    }
    return extendedKey;
}
window.network = libs.bitcoin.networks.bitcoin;
// 助记词
var phrase = "a,b,c,d,e,f,g,h,i,j,k,l,m";
var mnemonic = new Mnemonic("english");
window.seed = mnemonic.toSeed(phrase,"");
bip32ExtendedKey = calcBip32ExtendedKey("m/49'/0'/0'/0");
// 获取第 0 个地址
var key = bip32ExtendedKey.derive(0);
var keyPair = key.keyPair;
var address = keyPair.getAddress().toString();
var privkey = keyPair.toWIF();
var pubkey = keyPair.getPublicKeyBuffer().toString('hex');
var keyhash = libs.bitcoin.crypto.hash160(key.getPublicKeyBuffer());
var scriptsig = libs.bitcoin.script.witnessPubKeyHash.output.encode(keyhash);
var addressbytes = libs.bitcoin.crypto.hash160(scriptsig);
var scriptpubkey = libs.bitcoin.script.scriptHash.output.encode(addressbytes);
address = libs.bitcoin.address.fromOutputScript(scriptpubkey, network)
```