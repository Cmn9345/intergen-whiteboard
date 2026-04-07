import PocketBase from 'pocketbase';

// PocketBase 客戶端單例
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// 在開發環境下啟用自動取消
if (process.env.NODE_ENV === 'development') {
  pb.autoCancellation(false);
}

export default pb;
