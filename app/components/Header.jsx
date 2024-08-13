"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { HiSearch, HiBell, HiChat } from "react-icons/hi";
import app from './../Shared/firebaseConfig';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const db = getFirestore(app);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    saveUserInfo();
  }, [session]);

  const saveUserInfo = async () => {
    if (session?.user) {
      await setDoc(doc(db, "user", session.user.email), {
        userName: session.user.name,
        email: session.user.email,
        userImage: session.user.image
      });
    }
  }

  const onCreateClick = () => {
      router.push('/pin-builder');
  }

  const onConnectWalletClick = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log('Connected account:', address);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  }

  return (
    <div className='flex justify-between gap-3 md:gap-2 items-center p-6'>
      <Image
        src='/logo.png'
        alt='logo'
        width={100}
        height={50}
        onClick={() => router.push('/')}
        className='hover:bg-gray-300 p-2 rounded-full cursor-pointer'
      />
      <button
        className='bg-black text-[#bebeae] p-3 px-6 rounded-full text-[20px] hidden md:block'
        onClick={() => router.push('/')}
      >
        Home
      </button>
      <button
        className='font-semibold p-3 px-6 rounded-full text-[20px] text-[#bebeae]'
        onClick={() => router.push('/templates')}
      >
        Templates
      </button>
      <button
        className='font-semibold p-3 px-6 rounded-full text-[20px] text-[#bebeae]'
        onClick={onCreateClick}
      >
        Upload
      </button>
      <button
        className='font-semibold p-3 px-6 rounded-full text-[20px] text-[#bebeae]'
        onClick={() => router.push('/createMeme')}
      >
        Create Meme
      </button>
      <div className=' p-2 px-6 gap-3 items-center rounded-full w-full hidden md:flex'>
        {/* <HiSearch className='text-[34px] text-gray-500' />
        <input
          type="text"
          placeholder='Search'
          className='bg-transparent outline-none w-full text-[20px]'
        /> */}
      </div>
      {/* <HiSearch className='text-[20px] text-gray-500 md:hidden' /> */}
      <HiBell className='text-[20px] md:text-[60px] text-gray-500 cursor-pointer' />
      <HiChat className='text-[20px] md:text-[60px] text-gray-500 cursor-pointer' />
      
          {!walletAddress && (
            <button
              className='font-semibold p-2 px-4 rounded-full text-[#bebeae]'
              onClick={onConnectWalletClick}
            >
              Connect Wallet
            </button>
          )}
        
      {walletAddress && (
        <div className='text-gray-500 text-[20px] ml-3'>
          {`Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
        </div>
      )}
    </div>
  );
}

export default Header;