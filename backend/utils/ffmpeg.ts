import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export const convertTo360p = (inputPath: string): Promise<string> => {
  const dir = path.dirname(inputPath); // /backend/uploads
  const filename = path.basename(inputPath);
  const outputPath = path.join(dir, `${filename}-360p.mp4`);

  return new Promise((resolve, reject) => {
    console.log('🎬 FFmpeg 변환 시작:', inputPath);
    console.log('🎯 FFmpeg 출력 경로:', outputPath);

    ffmpeg(inputPath)
      .videoCodec('libx264')
      .size('640x360')
      .output(outputPath)
      .on('end', () => {
        console.log('✅ FFmpeg 변환 완료:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err: Error) => {
        console.error('❌ FFmpeg 오류:', err);
        reject(err);
      })
      .run();
  });
};
