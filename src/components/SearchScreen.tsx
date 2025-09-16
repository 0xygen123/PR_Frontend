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
 * Unity WebGL にメッセージを送信するラッパー
 * @param gameObject Unity 側のオブジェクト名
 * @param func 呼び出すメソッド名
 * @param param 渡すパラメータ（文字列 or 数値）
 */
function sendMessage(gameObject: string, func: string, param?: string | number) {
  const ModuleAny = (window as any).Module;
  if (ModuleAny?.SendMessage) {
    ModuleAny.SendMessage(gameObject, func, param);
  }
}


/**
 * SearchScreen
 * - APIから建物一覧を取得
 * - 選択された建物の部屋一覧をAPIで取得
 * - 選択内容をUnityサーバーに送信
 *   - 建物選択時: buildingId を送信
 *   - 部屋選択時: buildingId + roomId を送信
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

  // 検索結果（部屋一覧）を管理するstate
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // APIから取得した建物一覧を管理するstate
  const [buildings, setBuildings] = useState<{ id: number; building_name: string }[]>([]);
  // 建物一覧の読み込み状態を管理
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  // エラーメッセージを管理
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
        if (err instanceof Error) setErrorBuildings(err.message); // エラーメッセージをセット
      } finally {
        setLoadingBuildings(false); // 読み込み終了
      }
    };
    fetchBuildings();
  }, []);

  /**
   * 号館選択時の処理
   * @param building_id 選択された建物のID
   * @param buildingName 選択された建物名
   */
  const handleBuildingSelect = async (building_id: number, buildingName: string) => {
    // 選択状態を更新
    setSelectedBuilding(buildingName);
    setSelectedRoom('');

    try {
      // 選択された建物の部屋一覧をAPIで取得
      const res = await fetch(`http://100.104.15.110:8080/api/buildings/${building_id}/rooms`);
      if (!res.ok) throw new Error('部屋一覧の取得に失敗しました');

      const rooms: { id: number; room_name: string }[] = await res.json();

      // 検索結果形式に変換してstateにセット
      const results: SearchResult[] = rooms.map(r => ({
        building: buildingName,
        building_id,
        room: r.room_name,
        room_id: r.id
      }));
      setSearchResults(results);

      // Unityに建物IDを送信
      sendMessage("JSInterface","PathfindingRequested",building_id);
      console.log(building_id);
      
      
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
      setSearchResults([]);
    }
  };

  /**
 * 教室選択時の処理
 * @param roomName 選択された教室名
 * @param room_id  選択された教室ID
 */
const handleRoomSelect = async (roomName: string) => {
  // 教室の選択状態を更新
  setSelectedRoom(roomName);

  // 選択された部屋情報を検索結果から取得
  const selected = searchResults.find(r => r.room === roomName);
  if (selected) {
    // 検索結果をその教室1つに絞る
    setSearchResults([selected]);

      // Unityに buildingId + roomId を送信
      const messageData = `${selected.building},${selected.room}`;
      sendMessage("JSInterface","PathfindingRequested",messageData);
    }
  };

  /**
   * 案内開始処理
   */
  const handleNavigate = () => {
    onStartNavigation();
  };

  // 建物一覧が読み込み中
  if (loadingBuildings) return <div>
      建物一覧を読み込み中...
      </div>;

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
                  if (building) handleBuildingSelect(building.id, building.building_name);
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

            {/* 教室プルダウン（建物選択済みの場合のみ表示） */}
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
