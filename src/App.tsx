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
  | "alert"        // 歩きスマホ注意画面
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

  // ダークモードのON/OFFを管理
  const [darkMode, setDarkMode] = useState(false);

  // ダークモード切替関数
  const toggleTheme = () => setDarkMode(!darkMode);

  // アプリ起動時にスプラッシュ画面を表示 → 2秒後に注意画面に切替
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("alert"); // 2秒後に注意画面へ
    }, 2000);

    // コンポーネントが消えたときにタイマーを解除
    return () => clearTimeout(timer);
  }, []);

  /** 歩きスマホ注意画面を閉じたらホームへ */
  const handleAlertComplete = () => {
    setCurrentScreen("home");
  };

  /** 検索ボタンを押したら検索画面へ */
  const handleSearchClick = () => {
    setCurrentScreen("search");
  };

  /** 戻るボタンを押したらホームへ */
  const handleBackToHome = () => {
    setCurrentScreen("home");
  };

  /** 案内開始ボタンを押したら案内画面へ */
  const handleStartNavigation = () => {
    setCurrentScreen("navigation");
  };

  /** Unityテスト画面へ移動 */
  const handleNavigateToUnity = () => {
    setCurrentScreen("unity");
  };

  /** クイック案内（例: 図書館・食堂など） */
  const handleQuickNavigation = (location: string) => {
    // 場所名に対応する建物・部屋の情報を定義
    const locationMap: Record<string, { building: string; room: string }> = {
      図書館: { building: "中央図書館", room: "1階総合受付" },
      食堂: { building: "学生会館", room: "カフェテリア" },
      事務室: { building: "本館", room: "学生課" },
      体育館: { building: "体育館", room: "メインアリーナ" },
    };

    // 選ばれた場所の情報を取得
    const locationInfo = locationMap[location];

    // 情報が存在すれば号館と教室を設定し、案内画面へ
    if (locationInfo) {
      setSelectedBuilding(locationInfo.building);
      setSelectedRoom(locationInfo.room);
      setCurrentScreen("navigation");
    }
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

      case "alert":
        // 歩きスマホ注意画面
        // 完了すると handleAlertComplete() が呼ばれて home に遷移する
        return <WalkingPhoneAlert onComplete={handleAlertComplete} />;

      case "home":
        // ホーム画面
        // ・検索画面へ → handleSearchClick
        // ・クイック案内（図書館など） → handleQuickNavigation
        return (
          <HomeScreen
            onSearchClick={handleSearchClick}
            onQuickNavigation={handleQuickNavigation}
          />
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
            onQuickNavigation={handleQuickNavigation}
          />
        );
    }
  };

  return (
    // darkMode が true のときに全体へ `dark` クラスを付与
    <div className={`${darkMode ? 'dark' : ''} h-screen w-full bg-background`}>
      <div className="p-4">
        {/* ダークモード切替ボタン */}
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded bg-accent text-accent-foreground"
        >
          {darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
        </button>

        {/* Unityテスト画面へ遷移するボタン */}
        <button
          onClick={handleNavigateToUnity}
          className="mb-4 ml-2 px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Unityのテスト動作
        </button>

        {/* 現在の画面を描画 */}
        {renderScreen()}
      </div>
    </div>
  );
}