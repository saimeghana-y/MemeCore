"use client"
import React, { useEffect, useState } from 'react'
import PinImage from './../../components/PinDetail/PinImage'
import PinInfo from './../../components/PinDetail/PinInfo'
import ImageEditor from './../../components/ImageEditor/ImageEditor'
import { HiArrowSmallLeft } from "react-icons/hi2"
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { getMeme } from './../../utils/memeExplorerContract' // Update the path as needed

function PinDetail({ params }) {
  const router = useRouter();
  const [pinDetail, setPinDetail] = useState(null);

  useEffect(() => {
    const fetchPinDetail = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Fetch the meme details
        const memeId = parseInt(params.pinId, 10); // Ensure memeId is a number
        const meme = await getMeme(signer, memeId);
        setPinDetail({
          id: meme.id.toString(),
          image: `https://gateway.lighthouse.storage/ipfs/${meme.ipfsCid}`, // Assuming you store the image on IPFS
          title: `Meme #${meme.id.toString()}`,
          userName: meme.creator,
          userImage: '/path/to/default/user/image.jpg',
          upvotes: meme.upvotes.toNumber(), // Convert BigNumber to number
          downvotes: meme.downvotes.toNumber(), // Convert BigNumber to number
        });
      } else {
        console.error("Ethereum object not found");
      }
    };

    fetchPinDetail();
  }, [params.pinId]);

  return (
    <>
      {pinDetail ? 
      <div className='bg-white p-3 md:p-12 rounded-2xl md:px-24 lg:px-36'>
        <HiArrowSmallLeft className='text-[60px] font-bold ml-[-50px] 
        cursor-pointer hover:bg-gray-200 rounded-full p-2'
        onClick={() => router.back()} />
        <div className='grid grid-cols-1 lg:grid-cols-2 md:gap-10 shadow-lg
        rounded-2xl p-3 md:p-7 lg:p-12 xl:pd-16'>
          <PinImage pinDetail={pinDetail} />
          <div className="">
            <PinInfo pinDetail={pinDetail} />
          </div>
        </div>
      </div> : null}
    </>
  )
}

export default PinDetail