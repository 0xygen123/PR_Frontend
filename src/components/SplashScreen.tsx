import { MapPin } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-white">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="w-20 h-20 text-red-600" />
        <h1 className="text-red-600">キャンパスナビ</h1>
      </div>
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 opacity-80 text-red-600">読み込み中...</p>
    </div>
  );
}
