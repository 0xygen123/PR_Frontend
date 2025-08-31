//教室選択
import { DoorOpen } from 'lucide-react';
import { Button } from '../ui/button';

// RoomSelectorコンポーネントのプロパティ型定義
interface RoomSelectorProps {
  rooms: string[]; // 表示する教室のリスト
  selectedRoom: string; // 現在選択されている教室
  onRoomSelect: (room: string) => void; // 教室選択時のコールバック関数
}

/**
 * 教室選択コンポーネント
 * 選択された号館の教室をボタンで表示し、選択を処理する
 */
export function RoomSelector({ 
  rooms, // 選択可能な教室の配列
  selectedRoom, // 現在選択中の教室
  onRoomSelect // 教室選択時の処理関数
}: RoomSelectorProps) {
  return (
    <div>
      {/* セクションタイトル */}
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <DoorOpen className="w-4 h-4" /> {/* ドアのアイコン */}
        教室を選択 {/* セクションタイトルテキスト */}
      </h3>

      {/* 教室選択ボタンのグリッド */}
      <div className="grid grid-cols-3 gap-2"> {/* 3列のグリッドレイアウト */}
        {rooms.map((room) => ( // 各教室に対してボタンを生成
          <Button
            key={room} // Reactの一意キー
            variant={selectedRoom === room ? "default" : "outline"} // 選択状態で見た目を変更
            size="sm" // 小さいサイズ
            onClick={() => onRoomSelect(room)} // クリック時に教室選択処理
          >
            {room} {/* 教室名を表示 */}
          </Button>
        ))}
      </div>
    </div>
  );
}