import "./CanvaClone.css";
import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef, useState } from 'react';
import { findAirtableAssets } from './airtableAssetLibrary';
import { findUnsplashAssets } from './unsplashAssetLibrary';
import { useSearchParams } from 'next/navigation';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { uploadMeme } from '../utils/memeExplorerContract';
import axios from 'axios'; // Make sure axios is installed

const LIGHTHOUSE_API_KEY = '8b8ce4db.801c788f6eda450cbde10e488c818a0e';

// templates array
const templates = [
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

function CanvaClone({
  assetLibrary = 'airtable'
}) {
  const cesdkContainer = useRef(null);
  const cesdkInstance = useRef(null); // Store the cesdk instance in a ref
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [initialImageURL, setInitialImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState('');

  useEffect(() => {
    const fetchTemplateImage = () => {
      if (templateId) {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          setInitialImageURL(template.thumbnailURL);
        }
      } else {
        // Set to the first template by default if no templateId
        setInitialImageURL(templates[0].thumbnailURL);
      }
    };

    fetchTemplateImage();
  }, [templateId]);

  useEffect(() => {
    if (!cesdkContainer.current || !initialImageURL) return;
    let cesdk;
    console.log('canva clone');
    const externalAssetSources = {
      ...(assetLibrary === 'airtable' && {
        airtable: {
          findAssets: findAirtableAssets,
          credits: {
            name: 'Airtable',
            url: 'https://airtable.com/shr4x8s9jqaxiJxm5/tblSLR9GBwiVwFS8z?backgroundColor=orange'
          }
        }
      }),
      ...(assetLibrary === 'unsplash' && {
        unsplash: {
          findAssets: findUnsplashAssets,
          credits: {
            name: 'Unsplash',
            url: 'https://unsplash.com/'
          },
          license: {
            name: 'Unsplash license (free)',
            url: 'https://unsplash.com/license'
          }
        }
      })
    };

    let config = {
      role: 'Adopter',
      theme: 'light',
      license: `arSuFjRta2YcEbT078z-P3KuGWfCsT2GV_PqAIhh-O4HqWq5ZpPOichl3xMhAGED`,
      assetSources: {
        ...externalAssetSources,
        custom: {
          findAssets: () => {
            return {
              assets: [{
                id: "custom-image-1",
                type: 'ly.img.image',
                locale: 'en',
                label: "Programming",
                thumbUri: initialImageURL,
                size: {
                  width: 512,
                  height: 512
                },
                meta: {
                  uri: initialImageURL
                },
                context: {
                  sourceId: 'custom'
                },
                credits: {
                  name: "Freepik",
                  url: "https://www.flaticon.com/free-icon/programming_1208884?related_id=1208782&origin=search"
                }
              }],
              currentPage: 1,
              total: 1,
              nextPage: undefined
            };
          }
        }
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png']
              },
            }
          }
        }
      },
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      }
      // ... other config options
    };

    if (cesdkContainer.current && initialImageURL) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(async (instance) => {
        cesdk = instance;
        cesdkInstance.current = cesdk; // Store the cesdk instance in the ref

        // Add default asset sources for stickers and shapes
        cesdk.addDefaultAssetSources(); // Add this line
        cesdk.addDemoAssetSources({ sceneMode: 'Design' });
        // Create the scene from the initial image URL
        await cesdk.engine.scene.createFromImage(initialImageURL);

        // Find the automatically added graphic block in the scene
        const graphicBlocks = cesdk.engine.block.findByType('graphic');
        if (graphicBlocks.length > 0) {
          const graphicBlockId = graphicBlocks[0];

          // Modify the image block's properties
          cesdk.engine.block.setOpacity(graphicBlockId, 1);
          cesdk.engine.block.setSize(graphicBlockId, { width: 0.3, height: 0.3 });
          
        }

      // Attach engine canvas to DOM
      if (typeof document !== 'undefined') {
        document.getElementById('cesdk_container').append(cesdk.element);
      }
      }).catch(error => {
        console.error('Error initializing CE.SDK:', error);
      });
    }

    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };

  }, [cesdkContainer, assetLibrary, initialImageURL]);

  const onSave = async () => {
    if (cesdkContainer.current) {
      setLoading(true);
      try {
        const engine = cesdkInstance.current?.engine;
        if (!engine) throw new Error('CE.SDK engine not available');

        const page = engine.scene.getCurrentPage();

        // Export the page as a PNG blob
        const pageBlob = await engine.block.export(page, 'image/png');

        // Convert blob to file object
        const file = new File([pageBlob], "exported-image.png", {
          type: "image/png",
        });

        // Upload the file to Lighthouse
        const response = await lighthouse.upload([file], LIGHTHOUSE_API_KEY, null, (progressData) => {
          let percentageDone = 100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
          console.log(percentageDone);
        });

        let fileHash;
        if (response && response.data && response.data.Hash) {
          fileHash = response.data.Hash;
        } else {
          console.error('Unexpected response structure:', response);
        }

        const imageUrl = `https://gateway.lighthouse.storage/ipfs/${fileHash}`;
        console.log('Image URL:', imageUrl);

        // Upload meme to blockchain
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const txHash = await uploadMeme(signer, fileHash);
          console.log("Transaction hash:", txHash);

          const txReceipt = await provider.waitForTransaction(txHash);
          if (txReceipt.status === 1) {
            console.log("Meme successfully uploaded to blockchain");
          } else {
            console.error("Transaction failed");
          }
        } else {
          console.error("Ethereum object not found");
        }

      } catch (error) {
        console.error("Error saving image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      console.log('generating suggestions');
      const response = await axios.post('/api/generateSuggestions', { prompt });
      setSuggestions(response.data.text.split('\n')); // Assuming the response is a newline-separated string
      console.log('suggestions:', response.data.text.split('\n'));
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caseContainer flex justify-center items-center h-screen">
      <div className="wrapper flex flex-col items-center" style={{ width: '90%' }}>
        <div className="saveButtonContainer" style={{ marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', width: '70%' }}>
          <button onClick={onSave} className='bg-red-500 p-2 text-white font-semibold px-3 rounded-lg width: 70%'>
            {loading ? <span>Loading...</span> : <span>Save</span>}
          </button>
        </div>
        <div ref={cesdkContainer} id="cesdk_container" className="cesdk" style={{ width: '70%' }}></div>
        <div className="ai-suggestions" style={{ width: '70%', margin: '15px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt for AI suggestions"
            className="ai-prompt-input"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              marginBottom: '15px',
              fontSize: '16px',
              color: '#374151',
              boxSizing: 'border-box'
            }}
          />
          <button  onClick={handleGenerateSuggestions} className="ai-generate-button" style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            Generate Suggestions
          </button>
          {suggestions.length > 0 && (
            <div className="suggestions-card" style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>AI Suggestions:</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {suggestions.map((suggestion, index) => (
                  <li key={index} style={{
                    padding: '10px',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : '#f3f4f6',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    color: '#374151'
                  }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CanvaClone;