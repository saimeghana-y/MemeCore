"use client"

import { useSearchParams } from 'next/navigation';
import Editor from './Editor';
import { useEffect, useState } from 'react';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  if (!templateId) {
    return <div>No template ID provided</div>;
  }

  return <Editor />;
}