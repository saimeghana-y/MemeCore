"use client"

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import('./Editor'), { ssr: false });

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  if (!templateId) {
    return <div>No template ID provided</div>;
  }

  return <Editor />;
}