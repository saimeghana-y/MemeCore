import { useEffect } from 'react';

const useCreativeEngine = (onLoad) => {
  useEffect(() => {
    const loadScript = async () => {
      if (!window.CreativeEngine && typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0/index.js';
        script.onload = () => {
          if (onLoad && window.CreativeEngine) {
            onLoad(window.CreativeEngine);
          }
        };
        document.body.appendChild(script);
      } else {
        onLoad(window.CreativeEngine);
      }
    };

    loadScript();
  }, [onLoad]);
};

export default useCreativeEngine;