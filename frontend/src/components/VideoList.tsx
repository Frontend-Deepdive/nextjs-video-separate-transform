'use client';

import React, { useEffect, useState } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/videos`, {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          },
        });

        if (!response.ok) throw new Error('API 요청 실패');
        console.log(response);

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('❌ 데이터 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>📼 업로드된 영상 목록</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <strong>{video.filename}</strong> -{' '}
            <a href={video.url} target="_blank" rel="noreferrer">
              열기
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
