import { useState, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { SearchHeader } from './search/SearchHeader';
import { BuildingSelector } from './search/BuildingSelector';
import { RoomSelector } from './search/RoomSelector';
import { SelectedLocationDisplay } from './search/SelectedLocationDisplay';
import { SearchResults } from './search/SearchResults';
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
 * - 選択した建物IDをUnityサーバーに送信
 */
export function SearchScreen({
  onBack,
  onStartNavigation,
  selectedBuilding,
  setSelectedBuilding,
  selectedRoom,
  setSelectedRoom
}: SearchScreenProps) {
  // 検索結果（部屋一覧）を管理するstate
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // APIから取得した建物一覧を管理するstate
  const [buildings, setBuildings] = useState<{ id: number; building_name: string }[]>([]);
  // 建物一覧の読み込み状態とエラー状態を管理するstate
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  // エラーメッセージを保存するstate（null許容）
  const [errorBuildings, setErrorBuildings] = useState<string | null>(null);

  /**
   * 初回レンダリング時に建物一覧をAPIから取得
   */
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch('http://100.104.15.110:8080/api/buildings');
        if (!res.ok) throw new Error('建物一覧の取得に失敗しました');

        const data: { id: number; building_name: string }[] = await res.json();
        setBuildings(data); // APIから取得した建物をstateに保存
      } catch (err) {
        if (err instanceof Error) setErrorBuildings(err.message);
      } finally {
        setLoadingBuildings(false); // 読み込み終了
      }
    };
    fetchBuildings();
  }, []);

  /**
   * 号館選択時の処理
   * @param buildingId 選択された建物のID
   * @param buildingName 選択された建物名
   */
  const handleBuildingSelect = async (buildingId: number, buildingName: string) => {
    // 同じ建物を再度押した場合は選択解除
    if (selectedBuilding === buildingName) {
      setSelectedBuilding('');
      setSelectedRoom('');
      setSearchResults([]);
      return;
    }

    setSelectedBuilding(buildingName); // 新しい号館を選択
    setSelectedRoom(''); // 教室選択リセット

    try {
      // 選択された建物の部屋一覧をAPIで取得
      const res = await fetch(`http://100.104.15.110:8080/api/buildings/${buildingId}/rooms`);
      if (!res.ok) throw new Error('部屋一覧の取得に失敗しました');

      const rooms: { id: number; room_name: string }[] = await res.json();

      // 検索結果形式に変換
      const results: SearchResult[] = rooms.map(r => ({
        building: buildingName,
        room: r.room_name
      }));
      setSearchResults(results); // 検索結果を更新

      // Unity側に選択した建物IDを送信
      await fetch('http://100.104.15.110:8080/api/unity/sendBuilding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingId })
      });

    } catch (err) {
      if (err instanceof Error) console.error(err.message);
      setSearchResults([]); // 取得失敗時は空にする
    }
  };

  /**
   * 教室選択時の処理
   * @param room 選択された教室名
   */
  const handleRoomSelect = (room: string) => {
    if (selectedRoom === room) {
      setSelectedRoom(''); // 同じ教室を再度押した場合はクリア
      if (selectedBuilding) {
        // 建物の全部屋を再表示
        const rooms = searchResults.map(r => r.room);
        const results = rooms.map(r => ({ building: selectedBuilding, room: r }));
        setSearchResults(results);
      }
      return;
    }

    setSelectedRoom(room); // 新しい教室を選択

    // 特定の教室のみを検索結果に設定
    if (selectedBuilding) {
      setSearchResults([{ building: selectedBuilding, room }]);
    }
  };

  /**
   * 案内開始処理
   */
  const handleNavigate = () => {
    onStartNavigation();
  };

  // 建物一覧が読み込み中の場合
  if (loadingBuildings) return <div>建物一覧を読み込み中...</div>;

  // 建物一覧取得に失敗した場合
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

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">

            {/* 建物選択 */}
            <div>
              <BuildingSelector
                buildings={buildings.map(b => b.building_name)} // 名前だけ渡す
                selectedBuilding={selectedBuilding}
                onBuildingSelect={(buildingName: string) => {
                  // 名前からIDを取得してhandleBuildingSelect呼び出し
                  const building = buildings.find(b => b.building_name === buildingName);
                  if (building) handleBuildingSelect(building.id, building.building_name);
                }}
              />

              {/* 選択された建物・教室の表示 */}
              <SelectedLocationDisplay
                selectedBuilding={selectedBuilding}
                selectedRoom={selectedRoom}
              />
            </div>

            {/* 教室選択（建物選択済みの場合のみ表示） */}
            {selectedBuilding && (
              <RoomSelector
                rooms={searchResults.map(r => r.room)} // APIで取得した部屋名リスト
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
              />
            )}

            {/* 検索結果表示 */}
            <SearchResults searchResults={searchResults} />

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
