import { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { SearchHeader } from './search/SearchHeader';
import { SelectedLocationDisplay } from './search/SelectedLocationDisplay';
import type { SearchResult } from './search/types';

// SearchScreenコンポーネントのプロパティ型定義
interface SearchScreenProps {
  onBack: () => void; // 戻るボタンが押された時のコールバック
  onStartNavigation: () => void; // 案内開始ボタンが押された時のコールバック
  selectedBuilding: string; // 選択中の号館名
  setSelectedBuilding: (building: string) => void; // 号館選択状態を更新する関数
  selectedRoom: string; // 選択中の教室名
  setSelectedRoom: (room: string) => void; // 教室選択状態を更新する関数
}

/**
 * SearchScreen
 * - APIから建物一覧を取得
 * - 選択された建物の部屋一覧をAPIで取得
 * - 建物・教室選択をプルダウンで行う
 */
export function SearchScreen({
  onBack,
  onStartNavigation,
  selectedBuilding,
  setSelectedBuilding,
  selectedRoom,
  setSelectedRoom
}: SearchScreenProps) {

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [buildings, setBuildings] = useState<{ id: number; building_name: string }[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [errorBuildings, setErrorBuildings] = useState<string | null>(null);

  /**
   * 初回レンダリング時に建物一覧をAPIから取得
   */
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch('https://r-navi.math.ryukoku.ac.jp/api/buildings');
        if (!res.ok) throw new Error('建物一覧の取得に失敗しました');
        const data: { id: number; building_name: string }[] = await res.json();
        setBuildings(data);
      } catch (err) {
        if (err instanceof Error) setErrorBuildings(err.message);
      } finally {
        setLoadingBuildings(false);
      }
    };
    fetchBuildings();
  }, []);

  /**
   * 号館選択時の処理
   */
  const handleBuildingSelect = async (building_id: number, buildingName: string) => {
    setSelectedBuilding(buildingName);
    setSelectedRoom('');

    try {
      const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings/${building_id}/rooms`);
      if (!res.ok) throw new Error('部屋一覧の取得に失敗しました');
      const rooms: { id: number; room_name: string }[] = await res.json();

      const results: SearchResult[] = rooms.map(r => ({
        building: buildingName,
        building_id,
        room: r.room_name,
        room_id: r.id
      }));
      setSearchResults(results);
      //console.log("取得した部屋一覧:" + JSON.stringify(results));

    } catch (err) {
      if (err instanceof Error) console.error(err.message);
      setSearchResults([]);
    }
  };

  /**
   * 教室選択時の処理
   */
  const handleRoomSelect = (roomName: string) => {
    // 教室の選択状態を更新するだけ
    setSelectedRoom(roomName);

  };

  /**
   * 案内開始処理
   */
  const handleNavigate = () => {
    onStartNavigation();
  };

  if (loadingBuildings) return <div>建物一覧を読み込み中...</div>;
  if (errorBuildings) return <div>建物一覧取得エラー: {errorBuildings}</div>;

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <SearchHeader
        onBack={onBack}
        onNavigate={handleNavigate}
        selectedBuilding={selectedBuilding}
        selectedRoom={selectedRoom}
      />

      {/* メイン */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">

            {/* 建物プルダウン */}
            <div>
              <label htmlFor="buildingSelect" className="block mb-1 font-medium">
                建物を選択
              </label>
              <select
                id="buildingSelect"
                className="border rounded p-2 w-full"
                value={selectedBuilding}
                onChange={(e) => {
                  const buildingName = e.target.value;
                  const building = buildings.find(b => b.building_name === buildingName);
                  if (building) {
                    handleBuildingSelect(building.id, building.building_name);
                  } else {
                    // 「-- 選択してください --」が選ばれた場合
                    setSelectedBuilding('');
                    setSelectedRoom('');
                    setSearchResults([]);
                  }
                }}
              >
                <option value="">-- 選択してください --</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.building_name}>
                    {b.building_name}
                  </option>
                ))}
              </select>

              {/* 選択された建物・教室の表示 */}
              <SelectedLocationDisplay
                selectedBuilding={selectedBuilding}
                selectedRoom={selectedRoom}
              />
            </div>

            {/* 教室プルダウン */}
            {selectedBuilding && (
              <div className="mt-4">
                <label htmlFor="roomSelect" className="block mb-1 font-medium">
                  教室を選択
                </label>
                <select
                  id="roomSelect"
                  className="border rounded p-2 w-full"
                  value={selectedRoom}
                  onChange={(e) => handleRoomSelect(e.target.value)}
                >
                  <option value="">-- 選択してください --</option>
                  {searchResults.map(r => (
                    <option key={r.room} value={r.room}>
                      {r.room}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}