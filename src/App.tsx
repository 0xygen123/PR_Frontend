import './App.css';
import { useState, useEffect } from "react";

// 各画面コンポーネントをインポート
import { SplashScreen } from "./components/SplashScreen";       // スプラッシュ画面
import { WalkingPhoneAlert } from "./components/WalkingPhoneAlert"; // 歩きスマホ注意画面
import { HomeScreen } from "./components/HomeScreen";           // ホーム画面 (★ 修正: onSearchClickを受け取らないように変更)

// 表示できる画面の種類を列挙型（type）で定義
type Screen =
  | "splash"       // スプラッシュ画面
  | "home"         // ホーム画面

/**
 * アプリケーションのメインコンポーネント
 * 画面遷移・状態管理を行う
 */
export default function App() {
  // 現在表示中の画面を管理する状態
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  // 選択された号館（例: 図書館や本館など）
  // ★ 削除: HomeScreen内で管理するため不要
  // const [selectedBuilding, setSelectedBuilding] = useState('');
  // 選択された教室や場所（例: 1階総合受付、学生課など）
  // ★ 削除: HomeScreen内で管理するため不要
  // const [selectedRoom, setSelectedRoom] = useState('');

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
    // setCurrentScreen("home"); // すでにhomeになっているはずなので不要かも
  };

  // ★ 削除: HomeScreen内で検索ボタンのクリックを処理するため不要
  // /** 検索ボタンがクリックされた時の処理 → 検索画面へ */
  // const handleSearchClick = () => {
  //   setCurrentScreen("search");
  // };

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
        return (
          <>
            {/* ホーム画面本体 */}
            {/* ★ 修正: onSearchClick を削除 */}
            <HomeScreen />

            {/* 注意ポップアップ */}
            {alertOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4"> {/* p-4 追加 */}
                <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl"> {/* スタイル調整 */}
                  {/* WalkingPhoneAlert は onComplete で閉じられる */}
                  <WalkingPhoneAlert onComplete={handleAlertComplete} />
                </div>
              </div>
            )}
          </>
        );

      default:
        // 万が一未定義の画面が指定された場合はホームにフォールバック
        // ★ 修正: onSearchClick を削除
        return (
          <HomeScreen />
        );
    }
  };

  return (
    // App全体を縦方向のflexコンテナに変更
    // ★ 修正: pt-0 を削除し、p-0 に変更（子要素でpaddingを管理するため）
    <div className={`h-screen w-full bg-background flex flex-col`}>

      {/* 各画面を描画するメインエリア */}
      {/* ★ 修正: flex-1のみにし、paddingは子要素(HomeScreenなど)に任せる */}
      <div className="flex-1 min-h-0"> {/* min-h-0 を追加 */}
        {/* 現在の画面を描画 */}
        {renderScreen()}
      </div>
    </div>
  );
}