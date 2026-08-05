/**
 * src/core/utils/saveMediaFile.ts
 * Mục đích: Copy file ảnh/âm thanh từ URI tạm (picker/camera) về thư mục vĩnh viễn
 *           của app (DocumentDirectoryPath). Đảm bảo file không bị mất khi OS dọn cache.
 *           Ảnh đã được nén bởi image-picker (quality 0.6, 500×500) trước khi gọi hàm này.
 */
import RNFS from 'react-native-fs';

/**
 * Copy một file từ URI nguồn về DocumentDirectoryPath với tên duy nhất.
 * Nếu file đã nằm trong DocumentDirectory thì trả về luôn, không copy.
 * @param sourceUri  file:// hoặc content:// URI từ picker/camera/recorder
 * @param prefix     'img' | 'audio' — tiền tố tên file
 * @param ext        đuôi file, vd 'jpg', 'm4a'
 * @returns          đường dẫn vĩnh viễn trong DocumentDirectory
 */
export const saveMediaFile = async (
  sourceUri: string,
  prefix: 'img' | 'audio',
  ext: string,
): Promise<string> => {
  const docDir = RNFS.DocumentDirectoryPath;

  // Nếu đã nằm trong DocumentDirectory → không cần copy
  if (sourceUri.startsWith('file://') && sourceUri.includes(docDir)) {
    return sourceUri;
  }
  if (!sourceUri.startsWith('file://') && sourceUri.includes(docDir)) {
    return `file://${sourceUri}`;
  }

  const fileName = `${prefix}_${Date.now()}.${ext}`;
  const destPath = `${docDir}/${fileName}`;

  // Chuẩn hoá URI
  const src = sourceUri.startsWith('file://')
    ? sourceUri.replace('file://', '')
    : sourceUri;

  await RNFS.copyFile(src, destPath);
  return `file://${destPath}`;
};
