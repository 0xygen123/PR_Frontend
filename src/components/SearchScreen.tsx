import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { SearchHeader } from './search/SearchHeader';
import { BuildingSelector } from './search/BuildingSelector';
import { RoomSelector } from './search/RoomSelector';
import { SelectedLocationDisplay } from './search/SelectedLocationDisplay';
import { SearchResults } from './search/SearchResults';
import { buildings, roomsByBuilding } from './search/constants';
import type { SearchResult } from './search/types';

// SearchScreenコンポーネントのプロパティ型定義
interface SearchScreenProps {
  onBack: () => void; // 戻るボタンが押された時のコールバック関数
  onStartNavigation: () => void; // 案内開始ボタンが押された時のコールバック関数
  selectedBuilding: string; // 現在選択されている号館名
  setSelectedBuilding: (building: string) => void; // 号館選択状態を更新する関数
  selectedRoom: string; // 現在選択されている教室名
  setSelectedRoom: (room: string) => void; // 教室選択状態を更新する関数
}

/**
 * 検索画面のメインコンポーネント
 * 号館と教室の選択、検索結果の表示を管理する
 */
export function SearchScreen({ 
  onBack, // 戻るボタンのクリックハンドラー
  onStartNavigation, // 案内開始ボタンのクリックハンドラー
  selectedBuilding, // 選択中の号館
  setSelectedBuilding, // 号館選択状態の更新関数
  selectedRoom, // 選択中の教室
  setSelectedRoom // 教室選択状態の更新関数
}: SearchScreenProps) {
  // 検索結果の状態管理
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  /**
   * 号館選択時の処理関数
   * @param building 選択された号館名
   */
  const handleBuildingSelect = (building: string) => {
    // 同じ号館を再度押した場合はキャンセル
    if (selectedBuilding === building) {
      setSelectedBuilding(''); // 号館選択をクリア
      setSelectedRoom(''); // 教室選択をクリア
      setSearchResults([]); // 検索結果をクリア
      return; // 処理を終了
    }
    
    setSelectedBuilding(building); // 新しい号館を選択
    setSelectedRoom(''); // 教室選択をリセット
    
    // 建物を選択したら、その建物の全ての部屋を表示
    const rooms = roomsByBuilding[building] || []; // 選択された号館の教室リストを取得
    const results = rooms.map(room => ({ building, room })); // 検索結果形式に変換
    setSearchResults(results); // 検索結果を更新
  };

  /**
   * 教室選択時の処理関数
   * @param room 選択された教室名
   */
  const handleRoomSelect = (room: string) => {
    // 同じ教室を再度押した場合はキャンセル
    if (selectedRoom === room) {
      setSelectedRoom(''); // 教室選択をクリア
      // 建物の全ての部屋を再表示
      if (selectedBuilding) {
        const rooms = roomsByBuilding[selectedBuilding] || []; // 号館の全教室を取得
        const results = rooms.map(r => ({ building: selectedBuilding, room: r })); // 検索結果形式に変換
        setSearchResults(results); // 検索結果を更新
      }
      return; // 処理を終了
    }
    
    setSelectedRoom(room); // 新しい教室を選択
    
    // 特定の部屋を選択したら、その部屋のみを結果に表示
    if (selectedBuilding) {
      setSearchResults([{ building: selectedBuilding, room }]); // 選択された教室のみを検索結果に設定
    }
  };

  /**
   * 案内開始時の処理関数
   */
  const handleNavigate = () => {
    onStartNavigation(); // 親コンポーネントの案内開始処理を呼び出し
  };

  return (
    <div className="h-full flex flex-col"> {/* 全画面高さのフレックスコンテナ */}
      {/* ヘッダー */}
      <SearchHeader
        onBack={onBack} // 戻るボタンの処理
        onNavigate={handleNavigate} // 案内開始ボタンの処理
        selectedBuilding={selectedBuilding} // 選択中の号館
        selectedRoom={selectedRoom} // 選択中の教室
      />

      {/* メインコンテンツエリア */}
      <div className="flex-1 overflow-hidden"> {/* 残り高さを占有し、オーバーフローを隠す */}
        <ScrollArea className="h-full"> {/* スクロール可能エリア */}
          <div className="p-4 space-y-4"> {/* パディングと要素間スペース */}
            
            {/* 号館選択セクション */}
            <div>
              <BuildingSelector
                buildings={buildings} // 利用可能な号館リスト
                selectedBuilding={selectedBuilding} // 選択中の号館
                onBuildingSelect={handleBuildingSelect} // 号館選択時の処理
              />
              
              {/* 選択された場所の表示 */}
              <SelectedLocationDisplay
                selectedBuilding={selectedBuilding} // 選択中の号館
                selectedRoom={selectedRoom} // 選択中の教室
              />
            </div>

            {/* 教室選択セクション（号館が選択されている場合のみ表示） */}
            {selectedBuilding && (
              <RoomSelector
                rooms={roomsByBuilding[selectedBuilding] || []} // 選択された号館の教室リスト
                selectedRoom={selectedRoom} // 選択中の教室
                onRoomSelect={handleRoomSelect} // 教室選択時の処理
              />
            )}

            {/* 検索結果セクション */}
            <SearchResults searchResults={searchResults} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}