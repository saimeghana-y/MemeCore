"use client";

import "./CanvaClone.css";
import { useEffect, useRef, useState } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { findAirtableAssets } from '../editor/airtableAssetLibrary';
import { findUnsplashAssets } from '../editor/unsplashAssetLibrary';
import axios from 'axios';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { uploadMeme } from '../utils/memeExplorerContract';

const LIGHTHOUSE_API_KEY = '8b8ce4db.801c788f6eda450cbde10e488c818a0e';

export default function CreateMeme() {
  const cesdkContainer = useRef(null);
  const cesdkInstance = useRef(null);
  const [initialImageURL, setInitialImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState('');

  useEffect(() => {
    if (!cesdkContainer.current || !initialImageURL) return;
    let cesdk;

    const externalAssetSources = {
      airtable: {
        findAssets: findAirtableAssets,
        credits: {
          name: 'Airtable',
          url: 'https://airtable.com/shr4x8s9jqaxiJxm5/tblSLR9GBwiVwFS8z?backgroundColor=orange'
        }
      },
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
    };

    let config = {
      role: 'Adopter',
      theme: 'light',
      license: LIGHTHOUSE_API_KEY,
      assetSources: {
        ...externalAssetSources,
        custom: {
          findAssets: () => ({
            assets: [{
              id: "custom-image-1",
              type: 'ly.img.image',
              locale: 'en',
              label: "Programming",
              thumbUri: initialImageURL,
              size: { width: 512, height: 512 },
              meta: { uri: initialImageURL },
              context: { sourceId: 'custom' },
              credits: {
                name: "Freepik",
                url: "https://www.flaticon.com/free-icon/programming_1208884?related_id=1208782&origin=search"
              }
            }],
            currentPage: 1,
            total: 1,
            nextPage: undefined
          })
        }
      },
      ui: {
        elements: {
          panels: { settings: true },
          navigation: {
            action: {
              export: { show: true, format: ['image/png'] }
            }
          }
        }
      },
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      }
    };

    CreativeEditorSDK.init(cesdkContainer.current, config).then(async (instance) => {
      cesdk = instance;
      cesdkInstance.current = cesdk;

      await cesdk.engine.scene.createFromImage(initialImageURL);
      if (typeof document !== 'undefined') {
        document.getElementById('cesdk_container').append(cesdk.element);
      }
    }).catch(error => {
      console.error('Error initializing CE.SDK:', error);
    });

    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, initialImageURL]);

  const onSave = async () => {
    if (cesdkContainer.current) {
      setLoading(true);
      try {
        const engine = cesdkInstance.current?.engine;
        if (!engine) throw new Error('CE.SDK engine not available');

        const page = engine.scene.getCurrentPage();
        const pageBlob = await engine.block.export(page, 'image/png');
        const file = new File([pageBlob], "exported-image.png", { type: "image/png" });

        const response = await lighthouse.upload([file], LIGHTHOUSE_API_KEY);
        const fileHash = response.data.Hash;
        const imageUrl = `https://gateway.lighthouse.storage/ipfs/${fileHash}`;

        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          await uploadMeme(signer, fileHash);
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
    <div>
      <div ref={cesdkContainer} id="cesdk_container" style={{ width: '100%', height: '500px' }}></div>
      <button onClick={onSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt for AI suggestions"
      />
      <button onClick={handleGenerateSuggestions}>Generate Suggestions</button>
      {suggestions && <div>{suggestions}</div>}
    </div>
  );
}