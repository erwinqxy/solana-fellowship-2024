# Fetch NFTs by Owner Output

```bash
yarn demo ./scripts/fetchNftsByOwner.ts                                                                                                                                ─╯
yarn run v1.22.22
$ npx ts-node -r tsconfig-paths/register ./scripts/fetchNftsByOwner.ts
==== Local PublicKeys loaded ====
Test address: AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF
User address: 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj

===============================================
===============================================

Getting all assets by owner AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF...
Total assets returned: 1

===============================================
assetId: CP7N9wwNuswp7U443HcmPNxTdSpV62H9AASc1w1mjavK
ownership: {
  frozen: false,
  delegated: true,
  delegate: '6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj',
  ownership_model: 'single',
  owner: 'AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF'
}
compression: {
  eligible: false,
  compressed: true,
  data_hash: 'qcBsGiphHcQjhPwDQPnWDzupyWcgfVXMxz6NKa4QPTZ',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: '413V3b96c2x95o9wKJAWXN6mqosm6nwbmm8cgZTgsgsz',
  tree: 'EVQRSVjCC6PHt8N1LQgX6h41448fAp5KuzvwxLWHhHZP',
  seq: 2,
  leaf_id: 1
}

===============================================
===============================================

Getting latest assets by owner 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj...
Total assets returned: 2
assetId: joCJfMz64od7hstsHqf8HX3JzXhE4FKQSuMqBLa7yzk
ownership: {
  frozen: false,
  delegated: false,
  delegate: null,
  ownership_model: 'single',
  owner: '6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj'
}
compression: {
  eligible: false,
  compressed: true,
  data_hash: 'qcBsGiphHcQjhPwDQPnWDzupyWcgfVXMxz6NKa4QPTZ',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: 'CYnJR6VSsPxtfqKf6thxNaRGdABydZ81EFC5649VAx5V',
  tree: 'EVQRSVjCC6PHt8N1LQgX6h41448fAp5KuzvwxLWHhHZP',
  seq: 1,
  leaf_id: 0
}
✨  Done in 5.74s.
```
