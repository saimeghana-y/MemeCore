import React from 'react';
import Templates from './Templates';

async function getTemplates() {
  // In a real application, this data would typically come from an API or database
  return [
    {
      id: '1',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafybeigrh52ylhtg2uenhehjzkiqcvkgqylsven6pnf52yldpryqnhh26i'
    },
    {
      id: '2',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreielx7qrna2x3yvhbzzh6qq7yqcwdmfgcjros4rm2qq3mjm6axuhq4'
    },
    {
      id: '3',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreicfxz3pqhvlmv2mvd34pewcd2y2vku2l26iz5sgr43m4a6thrlqry'
    },
    {
      id: '4',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreig74xlqso6gp6onty7hqntom2nhjkmwb7x7rwqyxd2tbzwftp5ce4'
    },
    {
      id: '5',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafybeifb2jre4jegkuua5aev4ssiczo3lhfdzqyh2xmqqsvnibtpqsttqe'
    },
    {
      id: '6',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreigszugdm7d52juee7viapuuedxbp73t3chhq2run2ieez7yfgscqa'
    },
    {
      id: '7',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreihhvcyt5cf5ut4muvsi5sjwkt574nvehp75df2mrc2z7v7uz6utz4'
    },
    {
      id: '8',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafybeid4x4uc3bt6xqggo24qrh5564uhabpxdcergns47qqmuaei3xkmkq'
    },
    {
      id: '9',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreidmoba4lq4p5hjvmh6pbluarfkg6yj7pwx4pggvkey6ujvjwgjegq'
    },
    {
      id: '10',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreifvjhjyooltzalkwzas6ji2qn5d6cynn2qpuxef66zriqhxzgeq54'
    },
    {
      id: '11',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreiecmqmohmnmqmis7cjvauws5g5qnb6jcr2ghazttmpblhfrjyjjnq'
    },
    {
      id: '12',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreic3y64bthzgdsc65km5eomzjmxmef67mfj4temh5emmko65qkawby'
    },
    {
      id: '13',
      label: 'Customize',
      thumbnailURL: 'https://gateway.lighthouse.storage/ipfs/bafkreiaje6536pkz3zqoi2cf4tczydlzhdyn2dlcy3rgtj45t6mcul6xnu'
    },
  ];
}

export default async function TemplatesPage() {
  const templates = await getTemplates();
  return <Templates templates={templates} />;
}