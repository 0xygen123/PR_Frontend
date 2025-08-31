//検索結果表示
import { MapPin } from 'lucide-react';
import { Card } from '../ui/card';

// 検索結果の単一アイテムの型定義
interface SearchResult {
  building: string; // 号館名
  room: string; // 教室名
}

// SearchResultsコンポーネントのプロパティ型定義
interface SearchResultsProps {
  searchResults: SearchResult[]; // 表示する検索結果の配列
}

/*
 * 検索結果表示コンポーネント
 * 選択された号館の教室一覧をカード形式で表示する
 */
export function SearchResults({ 
  searchResults // 表示する検索結果の配列
}: SearchResultsProps) {
  // 検索結果が空の場合は何も表示しない
  if (searchResults.length === 0) {
    return null; // コンポーネントを非表示
  }

  return (
    <div>
      {/* セクションタイトル */}
      <h3 className="font-semibold mb-3">検索結果</h3>

      {/* 検索結果のリスト */}
      <div className="space-y-2"> {/* 各カード間にスペースを追加 */}
        {searchResults.map((result, index) => ( // 各検索結果に対してカードを生成
          <Card key={index} className="p-3"> {/* 一意キーとパディング */}
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-600" /> {/* 位置アイコン */}
              
              <div>
                {/* 号館名 */}
                <p className="font-medium">{result.building}</p>
                
                {/* 教室名 */}
                <p className="text-muted-foreground opacity-75">{result.room}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}