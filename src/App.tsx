import './App.css';
import { useState, useEffect } from "react";

// 各画面コンポーネントをインポート
import { SplashScreen } from "./components/SplashScreen";      // スプラッシュ画面
import { WalkingPhoneAlert } from "./components/WalkingPhoneAlert"; // 歩きスマホ注意画面
import { HomeScreen } from "./components/HomeScreen";          // ホーム画面
import { SearchScreen } from "./components/SearchScreen";      // 検索画面
import { NavigationScreen } from "./components/NavigationScreen"; // 案内画面
import { UnityScreen } from "./components/UnityScreen";        // Unity埋め込みテスト画面

// 表示できる画面の種類を列挙型（type）で定義
type Screen =
  | "splash"       // スプラッシュ画面
  | "home"         // ホーム画面
  | "search"       // 検索画面
  | "navigation"   // 案内画面
  | "unity";       // Unityテスト画面

/**
 * アプリケーションのメインコンポーネント
 * 画面遷移・状態管理を行う
 */
export default function App() {
  // 現在表示中の画面を管理する状態
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  // 選択された号館（例: 図書館や本館など）
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");

  // 選択された教室や場所（例: 1階総合受付、学生課など）
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // アプリ起動時にスプラッシュ画面を表示 → 2秒後にホーム画面に切替
  const [alertOpen, setAlertOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("home"); // 2秒後にホーム画面へ
      setAlertOpen(true); // 歩きスマホ注意画面を表示
    }, 2000);

    // コンポーネントが消えたときにタイマーを解除
    return () => clearTimeout(timer);
  }, []);

  /** 歩きスマホ注意ポップアップを閉じたらホームへ */
  const handleAlertComplete = () => {
    setAlertOpen(false);
    setCurrentScreen("home");
  };

  /** 検索ボタンを押したら検索画面へ */
  const handleSearchClick = () => {
    setCurrentScreen("search");
  };

  /** 戻るボタンを押したらホームへ */
  const handleBackToHome = () => {
    setSelectedBuilding("");
    setSelectedRoom("");
    setCurrentScreen("home");
  };

  /** 案内開始ボタンを押したら案内画面へ */
  const handleStartNavigation = () => {
    setCurrentScreen("navigation");
  };



   /**
   * 現在の画面状態（currentScreen）に応じて
   * どの画面コンポーネントを描画するかを決める関数
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        // アプリ起動時のスプラッシュ画面
        return <SplashScreen />;

      case "home":
        // ホーム画面
        // ・検索画面へ → handleSearchClick
        return (
          <>
            {/* ホーム画面本体 */}
            <HomeScreen onSearchClick={handleSearchClick} />

            {/* 注意ポップアップ */}
            {alertOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/80  z-50">
                <div className=" p-6 rounded-lg max-w-sm w-full">
                  {/* WalkingPhoneAlert は onComplete で閉じられる */}
                  <WalkingPhoneAlert onComplete={handleAlertComplete} />
                </div>
              </div>
            )}
          </>
        );

      case "search":
        // 検索画面
        // ・戻るボタンでホームへ → handleBackToHome
        // ・案内開始で navigation へ → handleStartNavigation
        // ・号館/教室の選択状態を親（App）で保持
        return (
          <SearchScreen
            onBack={handleBackToHome}
            onStartNavigation={handleStartNavigation}
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
        );

      case "navigation":
        // 案内画面
        // ・現在選択されている号館と教室を表示
        // ・戻るボタンでホームに戻る
        return (
          <NavigationScreen
            building={selectedBuilding}
            room={selectedRoom}
            onBack={handleBackToHome}
          />
        );

      case "unity":
        // Unity 埋め込みテスト画面
        // ・戻るボタンでホームに戻る
        return <UnityScreen onBack={handleBackToHome} />;

      default:
        // 万が一未定義の画面が指定された場合はホームにフォールバック
        return (
          <HomeScreen
            onSearchClick={handleSearchClick}
            //onQuickNavigation={handleQuickNavigation}
          />
        );
    }
  };

  return (
    // App全体を縦方向のflexコンテナに変更
    <div className={`h-screen w-full bg-background flex flex-col`}>

      {/* 各画面を描画するメインエリア */}
      {/* flex-1 を指定して、残りの高さいっぱいに広がるように設定 */}
      <div className="flex-1 p-4 pt-0">
        {/* 現在の画面を描画 */}
        {renderScreen()}
      </div>
    </div>
  );
}