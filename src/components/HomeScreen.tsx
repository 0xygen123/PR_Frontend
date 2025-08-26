const Button = ({ onClick, children, className}: { onClick?: () => void, children: React.ReactNode, className?: string, variant?: string, size?: string }) => (
    <button onClick={onClick} className={`border p-2 rounded ${className}`}>
        {children}
    </button>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white shadow rounded-lg ${className}`}>
        {children}
    </div>
);

export const HomeScreen = ({ onSearchClick, onQuickNavigation }: { onSearchClick: () => void; onQuickNavigation: (location: string) => void; }) => {
  const quickLocations = [
    { name: "図書館", icon: "📚" },
    { name: "食堂", icon: "🍽️" },
    { name: "事務室", icon: "🏢" },
    { name: "体育館", icon: "🏃" },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ヘッダー */}
      <div className="bg-red-700 text-white p-4">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          キャンパスナビ
        </h1>
      </div>

      {/* 検索バー */}
      <div className="p-4">
        <Button
          onClick={onSearchClick}
          variant="outline"
          className="w-full flex justify-start items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          建物・教室を検索
        </Button>
      </div>

      <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 m-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto mb-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <p>地図を読み込み中...</p>
            <p className="mt-1 opacity-75 text-sm">
              実際の実装ではMapbox/Google Mapsを使用
            </p>
          </div>
        </div>

        <Card className="absolute top-4 left-4 p-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
            <div>
              <p className="font-medium text-gray-800">現在地</p>
              <p className="text-gray-500 text-sm">
                
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* クイックアクション */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
          よく使用される場所
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLocations.map((location) => (
            <Button
              key={location.name}
              variant="outline"
              size="sm"
              onClick={() => onQuickNavigation(location.name)}
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <span>{location.icon}</span>
              {location.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};