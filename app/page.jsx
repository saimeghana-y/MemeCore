"use client"
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getAllMemes, getMemeComments } from './utils/memeExplorerContract';
import PinList from './components/Pins/PinList';

export default function Home() {
  const [listOfPins, setListOfPins] = useState([]);

  useEffect(() => {
    getAllPins();
  }, []);

  const getAllPins = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const memes = await getAllMemes(signer);

      // Map the memes to the format expected by PinItem
      const formattedMemes = await Promise.all(memes.map(async (meme) => {
        const memeId = meme.id.toNumber(); // Convert BigNumber to number
        const comments = await getMemeComments(signer, memeId);

        return {
          id: memeId,
          image: `https://gateway.lighthouse.storage/ipfs/${meme.ipfsCid}`, // Assuming you store the image on IPFS
          title: `Meme #${memeId}`,
          userName: meme.creator,
          userImage: '/path/to/default/user/image.jpg',
          upvotes: meme.upvotes.toNumber(), // Convert BigNumber to number
          downvotes: meme.downvotes.toNumber(), // Convert BigNumber to number
          comments: comments.length // Number of comments
        };
      }));

      setListOfPins(formattedMemes);
    } else {
      console.error("Ethereum object not found");
    }
  };

  return (
    <div className='p-3'>
      <PinList listOfPins={listOfPins} />
    </div>
  );
}