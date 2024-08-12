"use client"

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import('../editor/Editor'), { ssr: false });

export default function EditorPage() {

  return <Editor />;
}