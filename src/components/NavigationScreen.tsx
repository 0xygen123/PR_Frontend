import {
  ArrowLeft,
  Navigation,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./ui/button";

interface NavigationScreenProps {
  building: string;
  room: string;
  onBack: () => void;
}

export function NavigationScreen({
  building,
  room,
  onBack,
}: NavigationScreenProps) {
  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="bg-red-600 text-white p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1>ストリートビュー</h1>
          <p className="opacity-90">
            {building} {room}
          </p>
        </div>
      </div>

      {/* ストリートビューエリア */}
      <div className="flex-1 relative bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Navigation className="w-16 h-16 mx-auto mb-4" />
            <p>ストリートビュー</p>
            <p className="mt-1 opacity-75">
              実際の実装では360度パノラマ画像を表示
            </p>
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="secondary">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}