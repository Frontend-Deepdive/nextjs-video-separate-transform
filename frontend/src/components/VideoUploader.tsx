'use client';
import React, { useState } from 'react';

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('파일을 먼저 선택하세요.');
      return;
    }

    setStatus('업로드 중...');

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setStatus(`✅ 업로드 성공: ${result.url}`);
      } else {
        setStatus(`❌ 업로드 실패: ${result.error}`);
        console.error(result);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ 네트워크 또는 서버 오류');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h2>🎥 영상 업로드</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={!file}>
        업로드
      </button>
      <p>{status}</p>
    </div>
  );
}
