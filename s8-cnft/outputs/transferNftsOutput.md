# Transfer NFTS output 

```bash 
yarn demo ./scripts/transferNfts.ts                                                                                                                                    ─╯
yarn run v1.22.22
$ npx ts-node -r tsconfig-paths/register ./scripts/transferNfts.ts
==== Local PublicKeys loaded ====
Test address: AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF
User address: 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj

===============================================
===============================================

Getting all assets by owner AYYerY6AVzWeaYK7R1nmiyCwYLn9HNJn1morE75BnPxF...
Total assets returned: 5

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
assetId: AsyzHsiRY4Z1f1TTwFjyAArSoT45L9TTbE2SqYpr3NYe
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
  data_hash: '4ciCKTHug3jtA9o4kzb5Q7PkSt4cWHXA3mpqy9VHbz7Q',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: 'CmCm2Rv9AcnhxqfkQxsLxHmjxKZTQc6w54qNfRX8S5U4',
  tree: 'CXwYdikpd1ge9HPbcrecn9xFasogNuMEpuUuTq7bHfRE',
  seq: 2,
  leaf_id: 1
}

===============================================
assetId: 7dhrumxLKSSEbXJJNJMwY2GuKEpwNyMb9XAhtEiewgjB
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
  data_hash: 'J2gxcxqEGB9WJ84A9uLmmrKR9SqxF734Khu4KbM43UaU',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: '7R8oDZ8BFmz7cdQdPzqWtxP4VkrcWsu6XjfNufGyrmhr',
  tree: 'GPTNRKnoJ2WoZVgrEcFuLM2R8FyqtaGZV3YtotGuQxZ4',
  seq: 2,
  leaf_id: 1
}

===============================================
assetId: 4G9jkEcXWs6dCdJutsey7BkPzUmy6kmbRBHhsUvAFGqi
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
  data_hash: 'EGFvDM2Liub1Hz7HTVPumDpfuy9aEHrkxEnC44uvUkdh',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: '5Dv542aDMKYfE2tbw1NNUP5fkTGEFBDjt7T7wPBoM7vM',
  tree: '5NsEDdKn8ShmB9dTkywjZsBcKe8whJTwdqCCNMA9v6KM',
  seq: 2,
  leaf_id: 1
}

===============================================
assetId: 28MVSAmgt3VrgRkE1hdDBokpERMK4saFQ5C6g2JCG4Fo
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
  data_hash: '5VchADVDeCiSrPgPzgAjz2uPHcgd4DE6aygREUczia7B',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: 'kTdxYm2NsLBjDGHnR6ZWypX6WHrszNDTPan8n5qJvLx',
  tree: 'AawhaqAfUJebDEozWR87UUexGb7JiyPeTpyNgNz4Wtso',
  seq: 2,
  leaf_id: 1
}

===============================================
===============================================

Getting latest assets by owner 6qfSPnvNrRy5aNiXN4DLSLqb7wpBCmCTQ3yEM1x8NFkj...
Total assets returned: 10
assetId: 7FwWrkgGzCiGPjzyKXJgHJYYN219jogKimEw3erS3X73
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
  data_hash: '5VchADVDeCiSrPgPzgAjz2uPHcgd4DE6aygREUczia7B',
  creator_hash: 'CRE3DhzVboknY7CkBCcRriGvrNvEutEHgSbhDypjXCkU',
  asset_hash: 'Ct4L7VJyPYbL5Xdg6MH9unJm4ExvWvxTsyoJQH1zHgB7',
  tree: 'AawhaqAfUJebDEozWR87UUexGb7JiyPeTpyNgNz4Wtso',
  seq: 1,
  leaf_id: 0
}
✨  Done in 5.08s.
```