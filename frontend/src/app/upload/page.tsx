'use client';

import VideoUploader from '@/components/VideoUploader';
import VideoList from '@/components/VideoList';

export default function UploadPage() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">업로드 페이지</h1>
      <VideoUploader />
      <hr />
      <VideoList />
    </div>
  );
}
