import { ethers } from 'ethers';

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_memeId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "addComment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "memeId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "commenter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"name": "CommentAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "memeId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tipper",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "MemeTipped",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "memeId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsCid",
				"type": "string"
			}
		],
		"name": "MemeUploaded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "memeId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isUpvote",
				"type": "bool"
			}
		],
		"name": "MemeVoted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_memeId",
				"type": "uint256"
			}
		],
		"name": "tipMeme",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsCid",
				"type": "string"
			}
		],
		"name": "uploadMeme",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_memeId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isUpvote",
				"type": "bool"
			}
		],
		"name": "voteMeme",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "cidExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllMemes",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "ipfsCid",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "score",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "upvotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "downvotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tipAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct MemeExplorer.Meme[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_memeId",
				"type": "uint256"
			}
		],
		"name": "getMeme",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "ipfsCid",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "score",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "upvotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "downvotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tipAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct MemeExplorer.Meme",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_memeId",
				"type": "uint256"
			}
		],
		"name": "getMemeComments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "commenter",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					}
				],
				"internalType": "struct MemeExplorer.Comment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSortedMemeIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "memeComments",
		"outputs": [
			{
				"internalType": "address",
				"name": "commenter",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "memeCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "memeIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "memes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ipfsCid",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "score",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "upvotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "downvotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tipAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Add the ABI of your deployed contract here
const contractAddress = '0xcb070a0d2e42caca949972ba1f0c95241bbffc04'; // Add the address of your deployed contract here

export const getMemeExplorerContract = async (signer) => {
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
};

export const uploadMeme = async (signer, ipfsCid) => {
	const contract = await getMemeExplorerContract(signer);
	const tx = await contract.uploadMeme(ipfsCid);
	return tx.hash;
};

export const voteMeme = async (signer, memeId, isUpvote) => {
  const contract = await getMemeExplorerContract(signer);
  const tx = await contract.voteMeme(memeId, isUpvote);
  await tx.wait();
};

export const addComment = async (signer, memeId, content) => {
  const contract = await getMemeExplorerContract(signer);
  const tx = await contract.addComment(memeId, content);
  await tx.wait();
};

export const tipMeme = async (signer, memeId, amount) => {
  const contract = await getMemeExplorerContract(signer);
  const tx = await contract.tipMeme(memeId, { value: ethers.utils.parseEther(amount) });
  await tx.wait();
};

export const getMeme = async (signer, memeId) => {
  const contract = await getMemeExplorerContract(signer);
  return await contract.getMeme(memeId);
};

export const getMemeComments = async (signer, memeId) => {
  const contract = await getMemeExplorerContract(signer);
  return await contract.getMemeComments(memeId);
};

export const getSortedMemeIds = async (signer) => {
  const contract = await getMemeExplorerContract(signer);
  return await contract.getSortedMemeIds();
};

export const getAllMemes = async (signer) => {
  const contract = await getMemeExplorerContract(signer);
  return await contract.getAllMemes();
};