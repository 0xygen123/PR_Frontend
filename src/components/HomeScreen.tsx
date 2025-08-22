import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface HomeScreenProps {
  onSearchClick: () => void;
  onQuickNavigation: (location: string) => void;
}

export function HomeScreen({
  onSearchClick,
  onQuickNavigation,
}: HomeScreenProps) {
  const quickLocations = [
    { name: "図書館", icon: "📚" },
    { name: "食堂", icon: "🍽️" },
    { name: "事務室", icon: "🏢" },
    { name: "体育館", icon: "🏃" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="bg-red-700 text-white p-4">
        <h1 className="flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          キャンパスナビ
        </h1>
      </div>

      {/* 検索バー */}
      <div className="p-4">
        <Button
          onClick={onSearchClick}
          variant="outline"
          className="w-full justify-start text-muted-foreground"
        >
          <Search className="w-4 h-4 mr-2" />
          建物・教室を検索
        </Button>
      </div>

      {/* 地図エリア */}
      <div className="flex-1 relative bg-gray-100 m-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-16 h-16 mx-auto mb-4" />
            <p>地図を読み込み中...</p>
            <p className="mt-1 opacity-75">
              実際の実装ではMapbox/Google Mapsを使用
            </p>
          </div>
        </div>

        {/* 現在地表示 */}
        <Card className="absolute top-4 left-4 p-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-medium">現在地</p>
              <p className="text-muted-foreground">
                正門エントランス
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* クイックアクション */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold mb-3">
          よく使用される場所
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLocations.map((location) => (
            <Button
              key={location.name}
              variant="outline"
              size="sm"
              onClick={() => onQuickNavigation(location.name)}
              className="flex items-center gap-2"
            >
              <span>{location.icon}</span>
              {location.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}