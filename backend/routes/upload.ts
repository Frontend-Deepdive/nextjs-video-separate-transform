import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

import { convertTo360p } from '../utils/ffmpeg';
import { uploadToGCP } from '../utils/gcp';
import { insertVideoMetadata } from '../utils/supabase';

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.post('/', upload.single('video'), async (req, res): Promise<void> => {
  let originalPath: string | null = null;
  let convertedPath: string | null = null;

  try {
    console.log('🟢 [1] 요청 수신됨');

    const file = req.file;
    if (!file) {
      console.log('🔴 [2] 파일 없음');
      res.status(400).json({ error: '파일 없음' });
      return;
    }

    originalPath = file.path;
    console.log('🟢 [3] 업로드된 파일 경로:', originalPath);

    convertedPath = await convertTo360p(originalPath);
    console.log('🟢 [4] 변환된 파일 경로:', convertedPath);

    const gcpUrl = await uploadToGCP(convertedPath, `videos/${file.filename}-360p.mp4`);
    console.log('🟢 [5] GCP 업로드 성공:', gcpUrl);

    await insertVideoMetadata({
      filename: file.originalname,
      url: gcpUrl,
    });
    console.log('🟢 [6] Supabase 메타데이터 저장 완료');

    res.json({ message: '업로드 성공', url: gcpUrl });
    console.log('🟢 [7] 클라이언트 응답 완료');
  } catch (err: any) {
    console.error('❌ 업로드 처리 중 오류 발생:', err);
    res.status(500).json({
      error: '업로드 실패',
      detail: err?.message ?? '알 수 없는 오류',
    });
  } finally {
    try {
      if (originalPath) {
        await fs.unlink(originalPath);
        console.log('🧹 원본 파일 삭제 완료');
      }
      if (convertedPath) {
        await fs.unlink(convertedPath);
        console.log('🧹 변환 파일 삭제 완료');
      }
    } catch (cleanupErr) {
      console.warn('⚠️ 파일 삭제 중 오류 발생:', cleanupErr);
    }
  }
});

export default router;
