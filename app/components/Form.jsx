"use client";
import React, { useState } from 'react';
import UploadImage from './UploadImage';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';
import { getMemeExplorerContract, uploadMeme, voteMeme, addComment, tipMeme } from '../utils/memeExplorerContract';

const LIGHTHOUSE_API_KEY = '8b8ce4db.801c788f6eda450cbde10e488c818a0e';

function Form() {
    const { data: session } = useSession();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const progressCallback = (progressData) => {
        let percentageDone = 100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };

    const onSave = async () => {
        if (title && desc && file) {
            setLoading(true);
            try {
                const response = await lighthouse.upload([file], LIGHTHOUSE_API_KEY, null, progressCallback);
                let fileHash;
                if (response && response.data && response.data.Hash) {
                    console.log('Hash is:', response.data.Hash);
                    fileHash = response.data.Hash;
                } else {
                    console.error('Unexpected response structure:', response);
                    // Handle the case where the response doesn't have the expected structure
                }

                const imageUrl = `https://gateway.lighthouse.storage/ipfs/${fileHash}`;
                console.log('image url : ', imageUrl);

                // Store metadata in Lighthouse Storage
                const metadata = {
                    title: title || '',
                    desc: desc || '',
                    link: link || '',
                    image: imageUrl,
                };

                console.log('metadata is : ', JSON.stringify(metadata));
                const responseMeta = await lighthouse.uploadText(
                    JSON.stringify(metadata),
                    LIGHTHOUSE_API_KEY
                );
                console.log('response is : ', responseMeta);

                // Connect to Ethereum and upload the meme
                if (window.ethereum) {
                  const provider = new ethers.providers.Web3Provider(window.ethereum);
                  const signer = provider.getSigner();

                  const txHash = await uploadMeme(signer, fileHash);
                  console.log("Transaction hash:", txHash);

                  const txReceipt = await provider.waitForTransaction(txHash);
                  if (txReceipt.status === 1) {
                      console.log("Meme successfully uploaded to blockchain");
                      // Redirect after successful upload
                      // router.push("/" + session.user.email);
                  } else {
                      console.error("Transaction failed");
                  }
              } else {
                  console.error("Ethereum object not found");
              }

                console.log("Saved");
            } catch (error) {
                console.error("Error saving document: ", error);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please fill all fields and upload an image.');
        }
    };

    return (
        <div className='bg-white p-16 rounded-2xl'>
            <div className='flex justify-end mb-6'>
                <button onClick={onSave} className='bg-red-500 p-2 text-white font-semibold px-3 rounded-lg'>
                    {loading ? <Image src="/loading-indicator.png" width={30} height={30} alt='loading' className='animate-spin' /> : <span>Save</span>}
                </button>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <UploadImage setFile={setFile} />
                <div className="col-span-2">
                    <div className='w-[100%]'>
                        <input type="text" placeholder='Add your title' onChange={(e) => setTitle(e.target.value)}
                            className='text-[35px] text-black outline-none font-bold w-full border-b-[2px] border-gray-400 placeholder-gray-400' />
                        <h2 className='text-[12px] mb-8 w-full text-gray-400'>The first 40 Characters are what usually show up in feeds</h2>
                        <textarea type="text" onChange={(e) => setDesc(e.target.value)}
                            placeholder='Tell everyone what your meme is about' className='text-black outline-none w-full mt-8 pb-4 text-[14px] border-b-[2px] border-gray-400 placeholder-gray-400' />
                        {/* <input type="text" onChange={(e) => setLink(e.target.value)}
                            placeholder='Add a Destination Link' className='text-black outline-none w-full pb-4 mt-[90px] border-b-[2px] border-gray-400 placeholder-gray-400' /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;