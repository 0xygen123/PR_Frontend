//号館選択
import { Building } from 'lucide-react';
import { Button } from '../ui/button';

// BuildingSelectorコンポーネントのプロパティ型定義
interface BuildingSelectorProps {
  buildings: string[]; // 表示する号館のリスト
  selectedBuilding: string; // 現在選択されている号館
  onBuildingSelect: (building: string) => void; // 号館選択時のコールバック関数
}

/**
 * 号館選択コンポーネント
 * 利用可能な号館をボタンで表示し、選択を処理する
 */
export function BuildingSelector({ 
  buildings, // 選択可能な号館の配列
  selectedBuilding, // 現在選択中の号館
  onBuildingSelect // 号館選択時の処理関数
}: BuildingSelectorProps) {
  return (
    <div>
      {/* セクションタイトル */}
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Building className="w-4 h-4" /> {/* 建物アイコン */}
        号館を選択 {/* セクションタイトルテキスト */}
      </h3>

      {/* 号館選択ボタンのグリッド */}
      <div className="grid grid-cols-2 gap-2"> {/* 2列のグリッドレイアウト */}
        {buildings.map((building) => ( // 各号館に対してボタンを生成
          <Button
            key={building} // Reactの一意キー
            variant={selectedBuilding === building ? "default" : "outline"} // 選択状態で見た目を変更
            size="sm" // 小さいサイズ
            onClick={() => onBuildingSelect(building)} // クリック時に号館選択処理
          >
            {building} {/* 号館名を表示 */}
          </Button>
        ))}
      </div>
    </div>
  );
}