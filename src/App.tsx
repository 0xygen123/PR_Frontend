import './App.css';
import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { WalkingPhoneAlert } from "./components/WalkingPhoneAlert";
import { HomeScreen } from "./components/HomeScreen";
import { SearchScreen } from "./components/SearchScreen";
import { NavigationScreen } from "./components/NavigationScreen";

type Screen =
  | "splash"
  | "alert"
  | "home"
  | "search"
  | "navigation";

export default function App() {

  // 追加: ダークモードの状態を管理
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const [currentScreen, setCurrentScreen] =
    useState<Screen>("splash");
  const [selectedBuilding, setSelectedBuilding] =
    useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  useEffect(() => {
    // スプラッシュスクリーンを2秒表示
    const timer = setTimeout(() => {
      setCurrentScreen("alert");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAlertComplete = () => {
    setCurrentScreen("home");
  };

  const handleSearchClick = () => {
    setCurrentScreen("search");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
  };

  const handleStartNavigation = () => {
    setCurrentScreen("navigation");
  };

  const handleQuickNavigation = (location: string) => {
    const locationMap: Record<string, { building: string; room: string }> = {
      図書館: { building: "中央図書館", room: "1階総合受付" },
      食堂: { building: "学生会館", room: "カフェテリア" },
      事務室: { building: "本館", room: "学生課" },
      体育館: { building: "体育館", room: "メインアリーナ" },
    };

    const locationInfo = locationMap[location];
    if (locationInfo) {
      setSelectedBuilding(locationInfo.building);
      setSelectedRoom(locationInfo.room);
      setCurrentScreen("navigation");
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen />;
      case "alert":
        return (
          <WalkingPhoneAlert onComplete={handleAlertComplete} />
        );
      case "home":
        return (
          <HomeScreen
            onSearchClick={handleSearchClick}
            onQuickNavigation={handleQuickNavigation}
          />
        );
      case "search":
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
        return (
          <NavigationScreen
            building={selectedBuilding}
            room={selectedRoom}
            onBack={handleBackToHome}
          />
        );
      default:
        return (
          <HomeScreen
            onSearchClick={handleSearchClick}
            onQuickNavigation={handleQuickNavigation}
          />
        );
    }
  };

  return (
    // darkModeがtrueなら darkクラスを付与
    <div className={`${darkMode ? 'dark' : ''} h-screen w-full bg-background`}>
      <div className="p-4">
        {/* ダークモード切替ボタン */}
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded bg-accent text-accent-foreground"
        >
          {darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
        </button>

        {renderScreen()}
      </div>
    </div>
  );
}
