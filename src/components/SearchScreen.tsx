import { useState } from 'react';
import { ArrowLeft, Building, DoorOpen, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface SearchScreenProps {
  onBack: () => void;
  onStartNavigation: () => void;
  selectedBuilding: string;
  setSelectedBuilding: (building: string) => void;
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
}

const buildings = [
  '1号館',
  '2号館',
  '3号館',
  '4号館',
  '5号館',
  '図書館',
  '体育館',
  '食堂'
];

const roomsByBuilding: Record<string, string[]> = {
  '1号館': ['101', '102', '103', '201', '202', '203', '301', '302'],
  '2号館': ['201', '202', '203', '301', '302', '303', '401', '402'],
  '3号館': ['301', '302', '303', '401', '402', '403', '501', '502'],
  '4号館': ['401', '402', '403', '501', '502', '503', '601', '602'],
  '5号館': ['501', '502', '503', '601', '602', '603', '701', '702'],
  '図書館': ['閲覧室A', '閲覧室B', '個人学習室', 'グループ学習室'],
  '体育館': ['第1体育館', '第2体育館', 'トレーニング室', '更衣室'],
  '食堂': ['メインエリア', 'カフェエリア', 'イベントスペース']
};

export function SearchScreen({ 
  onBack, 
  onStartNavigation, 
  selectedBuilding, 
  setSelectedBuilding,
  selectedRoom,
  setSelectedRoom
}: SearchScreenProps) {
  const [searchResults, setSearchResults] = useState<Array<{building: string, room: string}>>([]);

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building);
    setSelectedRoom('');
    
    // 建物を選択したら、その建物の全ての部屋を表示
    const rooms = roomsByBuilding[building] || [];
    const results = rooms.map(room => ({ building, room }));
    setSearchResults(results);
  };

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    
    // 特定の部屋を選択したら、その部屋のみを結果に表示
    if (selectedBuilding) {
      setSearchResults([{ building: selectedBuilding, room }]);
    }
  };

  const handleNavigate = (building: string, room: string) => {
    setSelectedBuilding(building);
    setSelectedRoom(room);
    onStartNavigation();
  };

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
        <h1 className="font-bold">検索</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* 号館選択 */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                号館を選択
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {buildings.map((building) => (
                  <Button
                    key={building}
                    variant={selectedBuilding === building ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBuildingSelect(building)}
                  >
                    {building}
                  </Button>
                ))}
              </div>
            </div>

            {/* 教室選択 */}
            {selectedBuilding && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DoorOpen className="w-4 h-4" />
                  教室を選択
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(roomsByBuilding[selectedBuilding] || []).map((room) => (
                    <Button
                      key={room}
                      variant={selectedRoom === room ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoomSelect(room)}
                    >
                      {room}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 検索結果 */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">検索結果</h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{result.building}</p>
                            <p className="text-muted-foreground opacity-75">{result.room}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleNavigate(result.building, result.room)}
                        >
                          案内開始
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}