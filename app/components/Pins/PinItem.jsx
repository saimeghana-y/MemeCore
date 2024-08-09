import React from 'react';
import Image from 'next/image';
import UserTag from '../UserTag';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import { ethers } from 'ethers';
import { voteMeme } from '../../utils/memeExplorerContract';

function PinItem({ pin }) {
  const router = useRouter();

  const handleVote = async (memeId, isUpvote) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await voteMeme(signer, memeId, isUpvote);
      console.log(`Voted on meme #${memeId} with ${isUpvote ? 'upvote' : 'downvote'}`);
    } else {
      console.error("Ethereum object not found");
    }
  };

  const user = {
    name: pin?.userName,
    image: pin?.userImage,
  };

  return (
    <div className=''>
      <div className="relative 
       before:absolute
       before:h-full before:w-full
       before:rounded-3xl
       before:z-10
       hover:before:bg-gray-600 
       before:opacity-50
       cursor-pointer"
        onClick={() => router.push("/pin/" + pin.id)}
      >
        <Image
          src={pin.image}
          alt={pin.title}
          width={500}
          height={500}
          layout="responsive"
          className='rounded-3xl 
        cursor-pointer relative z-0'
        />
      </div>
      <h2 className='font-bold 
        text-[18px] mb-1 mt-2 line-clamp-2'>{pin.title}</h2>
      {/* <UserTag user={user} /> */}
      <div className="flex space-x-4 mt-2 items-center">
        <div className="flex items-center space-x-1">
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleVote(pin.id, true)} className="cursor-pointer text-green-500" />
          <span>{pin.upvotes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FontAwesomeIcon icon={faThumbsDown} onClick={() => handleVote(pin.id, false)} className="cursor-pointer text-red-500" />
          <span>{pin.downvotes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FontAwesomeIcon icon={faComment} className="text-blue-500" />
          <span>{pin.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default PinItem;