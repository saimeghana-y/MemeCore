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
  // ... (same as before)
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
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchTemplateImage = () => {
      if (templateId) {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          setInitialImageURL(template.thumbnailURL);
        }
      }
    };

    fetchTemplateImage();
  }, [templateId]);

  useEffect(() => {
    if (!cesdkContainer.current || !initialImageURL) return;

    const initializeCEsdk = async () => {
      try {
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

        const config = {
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
          // ... other config options
        };

        const instance = await CreativeEditorSDK.init(cesdkContainer.current, config);
        cesdkInstance.current = instance;

        // Create the scene from the initial image URL
        await instance.engine.scene.createFromImage(initialImageURL);

        // Find the automatically added graphic block in the scene
        const graphicBlocks = instance.engine.block.findByType('graphic');
        if (graphicBlocks.length > 0) {
          const graphicBlockId = graphicBlocks[0];

          // Modify the image block's properties
          instance.engine.block.setOpacity(graphicBlockId, 1);
          instance.engine.block.setPosition(graphicBlockId, { x: 0.5, y: 0.5 });
          instance.engine.block.setSize(graphicBlockId, { width: 0.3, height: 0.3 });
        }

        // Attach engine canvas to DOM
        if (typeof window !== 'undefined') {
          document.getElementById('cesdk_container').append(instance.element);
        }

      } catch (error) {
        console.error('Error initializing CE.SDK:', error);
      }
    };

    initializeCEsdk();

    return () => {
      if (cesdkInstance.current) {
        cesdkInstance.current.dispose();
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
      const response = await axios.post('/api/generateSuggestions', { prompt });
      setSuggestions(response.data.text);
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
            placeholder="Enter prompt for suggestions"
            style={{ width: 'calc(100% - 90px)', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <button onClick={handleGenerateSuggestions} style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>
            Generate Suggestions
          </button>
          <div className="suggestions-list" style={{ marginTop: '15px' }}>
            {loading && <p>Loading suggestions...</p>}
            {suggestions.map((suggestion, index) => (
              <p key={index} style={{ marginBottom: '10px' }}>{suggestion}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvaClone;