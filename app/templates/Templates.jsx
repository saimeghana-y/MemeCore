import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Templates = ({ templates }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-6">
      {templates.map((template) => (
        <Link key={template.id} href={`/editor?templateId=${template.id}`}>
          <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
            <Image src={template.thumbnailURL} alt={template.label} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-xl font-semibold">{template.label}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Templates;