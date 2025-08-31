// ナビゲーション画面コンポーネント
export const NavigationScreen = (
  { building, room, onBack }: {
    building: string,  // 建物名
    room: string,      // 部屋名
    onBack: () => void // 戻るボタン押下時の処理
  }
) => (
  <div className="h-full flex flex-col">
    
    {/* ヘッダー */}
    <div className="bg-red-600 text-white p-4 flex items-center gap-3">
      {/* 戻るボタン */}
      <button onClick={onBack} className="p-2 rounded-full hover:bg-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19-7-7 7-7"/> {/* 矢印アイコン */}
          <path d="M19 12H5"/>
        </svg>
      </button>
      {/* タイトルと場所情報 */}
      <div className="flex-1">
        <h1 className="font-bold">ストリートビュー</h1>
        <p className="opacity-90 text-sm">{building} {room}</p>
      </div>
    </div>

    {/* ストリートビュー表示エリア */}
    <div className="flex-1 relative bg-gray-200 flex items-center justify-center">
      
      {/* 左上に目的地情報カード */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md flex items-center gap-3">
        {/* 目的地アイコン（青色の矢印） */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="currentColor"
             className="h-5 w-5 text-blue-500 -rotate-90">
          <path d="M2 21l20-9L2 3v7l11 2-11 2v7z"/>
        </svg>
        <div>
          <p className="text-sm text-gray-500">目的地</p>
          <p className="font-semibold">{building} {room}</p>
        </div>
      </div>

      {/* 中央にストリートビューのプレースホルダー */}
      <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
             viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="mx-auto mb-4 h-16 w-16">
          <path d="m3 11 18-5v12L3 14v-3z"/>
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
        </svg>
        <p>ストリートビュー</p>
        <p className="mt-1 opacity-75">実際の実装では360度パノラマ画像を表示</p>
      </div>
    </div>
  </div>
);
