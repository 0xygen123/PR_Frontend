import { MapPin } from 'lucide-react';

// SelectedLocationDisplayコンポーネントのプロパティ型定義
interface SelectedLocationDisplayProps {
  selectedBuilding: string; // 選択されている号館名
  selectedRoom: string; // 選択されている教室名
}

/**
 * 選択された場所の表示コンポーネント
 * 現在選択されている号館と教室を視覚的に表示する
 */
export function SelectedLocationDisplay({ 
  selectedBuilding, // 選択中の号館
  selectedRoom // 選択中の教室
}: SelectedLocationDisplayProps) {
  // 号館が選択されていない場合は何も表示しない
  if (!selectedBuilding) {
    return null; // コンポーネントを非表示
  }

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      {/* 選択された場所の情報を表示するカード */}
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-blue-600" /> {/* 位置アイコン */}
        
        <div>
          {/* 選択された号館名 */}
          <p className="font-medium">{selectedBuilding}</p>
          
          {/* 選択された教室名または案内の種類 */}
          <p className="text-sm text-muted-foreground">
            {selectedRoom ? selectedRoom : "建物全体への案内"} {/* 教室選択の有無で表示を切り替え */}
          </p>
        </div>
      </div>
    </div>
  );
}