import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

// SearchHeaderコンポーネントのプロパティ型定義
interface SearchHeaderProps {
  onBack: () => void; // 戻るボタンが押された時のコールバック関数
  onNavigate: () => void; // 案内開始ボタンが押された時のコールバック関数
  selectedBuilding: string; // 現在選択されている号館名
  selectedRoom: string; // 現在選択されている教室名
}

/**
 * 検索画面のヘッダーコンポーネント
 * 戻るボタンと案内開始ボタンを含む
 */
export function SearchHeader({ 
  onBack, // 戻るボタンのクリックハンドラー
  onNavigate, // 案内開始ボタンのクリックハンドラー
  selectedBuilding, // 選択中の号館
}: SearchHeaderProps) {
  return (
    <div className="bg-red-600 text-white p-4 flex items-center gap-3">
      {/* 戻るボタン */}
      <Button 
        variant="ghost" // ゴーストバリアント（背景なし）
        size="sm" // 小さいサイズ
        onClick={onBack} // クリック時に戻る処理を実行
        className="text-white hover:bg-white" // 白いテキスト、ホバー時青背景
      >
        <ArrowLeft className="w-4 h-4" /> {/* 左矢印アイコン */}
      </Button>

      {/* ページタイトル */}
      <h1 className="font-bold flex-1">検索</h1> {/* flex-1で残りの空間を埋める */}

      {/* 案内開始ボタン（号館が選択されている場合のみ表示） */}
      {selectedBuilding && (
        <Button 
          variant="ghost" // ゴーストバリアント
          size="sm" // 小さいサイズ
          onClick={onNavigate} // クリック時に案内開始
          className="text-white bg-white/20 hover:bg-white/30" // 半透明背景
        >
          案内開始 {/* ボタンテキスト */}
        </Button>
      )}
    </div>
  );
}