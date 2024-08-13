import React, { useEffect, useState } from 'react'
import UserTag from '../UserTag'
import { ethers } from 'ethers'
import MemeDetail from './../../components/PinDetail/MemeDetail'
import { FaTwitter, FaFarcaster } from 'react-icons/fa' // Import social media icons
import { getMemeComments } from './../../utils/memeExplorerContract' // Update the path as needed

function PinInfo({ pinDetail }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const fetchedComments = await getMemeComments(signer, pinDetail.id);
        setComments(fetchedComments.map(comment => ({
          commenter: comment.commenter,
          content: comment.content
        })));
      } else {
        console.error("Ethereum object not found");
      }
    };

    fetchComments();
  }, [pinDetail.id]);

  const user = {
    name: pinDetail.userName,
    email: pinDetail.email,
    image: pinDetail.userImage
  };

  return (
    <div className="text-black">
      <div className='mb-5 ml-[45px]'>
        <h2 className='text-[30px] font-bold'>{pinDetail.title}</h2>
        <UserTag user={user} />
      </div>
      <MemeDetail memeId={pinDetail.id} comments={comments} />
      <div className="flex space-x-4 mt-4" style={{ marginLeft: '45px' }}>
        <button onClick={() => {
          const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pinDetail.image)}&text=Check out this meme!`;
          window.open(tweetUrl, '_blank');
        }} className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <FaTwitter className="mr-2" /> Share on Twitter
        </button>
      </div>
      {/* <button className='p-2 bg-[#CA1D26] px-5 text-[15px]
      mt-10 text-white hover:scale-105 transition-all border-radius[8px] float-right'
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          backgroundColor: '#CA1D26',
          color: 'white',
          cursor: 'pointer',
          border: 'none',
          fontWeight: '600',
          transition: 'background-color 0.3s',
          marginRight: '40px'
        }}
        onClick={() => window.open(pinDetail.link)}>Create New</button> */}
    </div>
  )
}

export default PinInfo