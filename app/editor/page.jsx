"use client"

import { useSearchParams } from 'next/navigation';
import Editor from './Editor';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  if (!templateId) {
    return <div>No template ID provided</div>;
  }

  return <Editor />;
}