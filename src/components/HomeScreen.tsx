import { useState, useEffect, type ChangeEvent } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { osName } from "react-device-detect";

// --- Type Definitions ---
// (変更なし)
interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}
interface UnityMessagePayload {
    functionName: string;
    message: string | null;
}
interface SearchResult {
    building: string;
    building_id: number;
    room: string;
    room_id: number;
}
interface Building {
    id: number;
    building_name: string;
}
interface Room {
    id: number;
    room_name: string;
}

// --- API呼び出し関数 ---
// (変更なし)
const findRoom = async (building: string, room: string) => {
    try {
        const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings?name=${building}`);
        if (!res.ok) throw new Error(`建物情報の取得に失敗: ${res.status}`);
        const Building_data = await res.json();
        if (!Building_data || Building_data.length === 0) throw new Error("該当する建物が見つかりません。");
        const Building_id = Building_data[0].id;

        const res2 = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings/${Building_id}/rooms?name=${room}`);
        if (!res2.ok) throw new Error(`教室情報の取得に失敗: ${res2.status}`);
        const Room_data = await res2.json();
        if (!Room_data || Room_data.length === 0) throw new Error("該当する教室が見つかりません。");

        const unity_id = Room_data[0].unity_id;
        return unity_id;

    } catch (err) {
        console.error("部屋情報の取得に失敗しました:", err);
        return null;
    }
};

const findBuilding = async (building: string) => {
    try {
        const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings?name=${building}`);
        if (!res.ok) throw new Error(`サーバーからの応答が正常ではありません: ${res.status}`);
        const Building_data = await res.json();
        if (!Building_data || Building_data.length === 0) throw new Error("該当する建物が見つかりません。");

        const unity_id = Building_data[0].unity_id;
        console.log(unity_id);
        return unity_id;

    } catch (err) {
        console.error("建物情報の取得に失敗しました:", err);
        return null;
    }
};

// --- Helper Components ---
// (変更なし)
const Button = ({ onClick, children, className, disabled }: {
    onClick?: () => void,
    children: React.ReactNode,
    className?: string,
    disabled?: boolean
}) => (
    <button
        onClick={onClick}
        className={`border p-2 rounded ${className}`}
        disabled={disabled}
    >
        {children}
    </button>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white shadow rounded-lg ${className}`}>
        {children}
    </div>
);

const ErrorPopup = ({ isOpen, message, onClose }: { isOpen: boolean; message: string; onClose: () => void; }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
                <h3 className="text-lg font-bold text-red-600">メッセージ受信</h3>
                <p className="mt-2 text-gray-700">{message}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};


/** --- Main HomeScreen Component --- */

export const HomeScreen = () => {

    const { unityProvider, sendMessage, isLoaded, unload } = useUnityContext({
        loaderUrl: "/Build/3517d7a01a316e5bf9186dfad0c60e87.loader.js",
        dataUrl: "/Build/72b8084547a26c4d11625e36e4ebec30.data",
        frameworkUrl: "/Build/44fdf7c87db8aaf4789a6cc8968a3b46.framework.js",
        codeUrl: "/Build/7e5429539ecbb895932239683ce6971a.wasm",
    });

    const [location, setLocation] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
    });

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isUnityReady, setIsUnityReady] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loadingBuildings, setLoadingBuildings] = useState(true);
    const [errorBuildings, setErrorBuildings] = useState<string | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    // ★ 2D/3D切り替えボタン用のState
    const [switchButton, setSwitchButton] = useState("2D");

    // (useEffect群は変更なし)
    useEffect(() => {
        return () => {
            unload();
        };
    }, [unload]);

    useEffect(() => {
        if (isLoaded) {
            sendMessage("JSInterface", "SetUserDevice", osName);
        }
    }, [isLoaded]);

    useEffect(() => {
        const handleUnityMessage = (event: Event) => {
            const customEvent = event as CustomEvent<UnityMessagePayload>;
            if (!customEvent.detail) return;

            const { functionName, message } = customEvent.detail;
            console.log("Unityからイベントを受信:", functionName, message);

            if (functionName === "onUnityLoaded") {
                console.log("Unityの準備完了通知を受信！");
                setIsUnityReady(true);
            }
            else if (message) {
                setPopupMessage(message);
                setIsPopupOpen(true);
            }
        };

        window.addEventListener('unity-message', handleUnityMessage);
        return () => {
            window.removeEventListener('unity-message', handleUnityMessage);
        };
    }, []);

    useEffect(() => {
        if (!isUnityReady) {
            console.log("Unity準備待機中... 位置情報監視は開始しません。");
            return;
        }

        if (!navigator.geolocation) {
            setLocation((prev) => ({
                ...prev,
                error: "お使いのブラウザは位置情報機能に対応していません。",
            }));
            return;
        }

        let watcherId: number | null = null;

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                latitude,
                longitude,
                error: null,
            });

            if (latitude !== null && longitude !== null) {
                const locationString = `${latitude},${longitude}`;
                console.log("Unityへ位置情報を送信:", locationString);
                sendMessage("JSInterface", "SetLocation", locationString);
            }
        };

        const handleError = (error: GeolocationPositionError) => {
            setLocation((prev) => ({
                ...prev,
                error: `位置情報の取得に失敗しました: ${error.message}`,
            }));
        };

        console.log("Unity準備完了。位置情報の監視を開始します。");
        watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });

        return () => {
            if (watcherId) {
                console.log("位置情報の監視を停止します。");
                navigator.geolocation.clearWatch(watcherId);
            }
        };
    }, [isUnityReady, sendMessage]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const res = await fetch('https://r-navi.math.ryukoku.ac.jp/api/buildings');
                if (!res.ok) throw new Error('建物一覧の取得に失敗しました');
                const data: Building[] = await res.json();
                setBuildings(data);
            } catch (err) {
                if (err instanceof Error) setErrorBuildings(err.message);
            } finally {
                setLoadingBuildings(false);
            }
        };
        fetchBuildings();
    }, []);

    // (handleClosePopup は変更なし)
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // ★ FollowUser (isUnityReady チェックを追加)
    const FollowUser = () => {
        if (isUnityReady) {
            sendMessage("JSInterface", "FollowToUser");
        } else {
            console.log("Unity not ready, cannot follow user.");
        }
    }

    // (handleBuildingSelect, handleRoomSelect は変更なし)
    const handleBuildingSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
        const buildingName = e.target.value;
        const building = buildings.find(b => b.building_name === buildingName);

        if (building) {
            setSelectedBuilding(building.building_name);
            setSelectedRoom('');
            setSearchResults([]);

            try {
                const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings/${building.id}/rooms`);
                if (!res.ok) throw new Error('部屋一覧の取得に失敗しました');
                const rooms: Room[] = await res.json();

                const results: SearchResult[] = rooms.map(r => ({
                    building: building.building_name,
                    building_id: building.id,
                    room: r.room_name,
                    room_id: r.id
                }));
                setSearchResults(results);
            } catch (err) {
                if (err instanceof Error) console.error(err.message);
                setSearchResults([]);
            }
        } else {
            setSelectedBuilding('');
            setSelectedRoom('');
            setSearchResults([]);
        }
    };

    const handleRoomSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoom(e.target.value);
    };

    // ★ handleStartNavigation (isUnityReady チェックを追加)
    const handleStartNavigation = async () => {
        if (!selectedBuilding) {
            alert("建物を選択してください。");
            return;
        }

        // ★ Unityの準備ができていない場合は送信しない
        if (!isUnityReady) {
            alert("Unityの準備が完了していません。");
            return;
        }

        let unity_id: string | null = null;
        let destinationName = "";

        try {
            if (selectedBuilding && selectedRoom) {
                console.log(`教室のIDを取得中: ${selectedBuilding} ${selectedRoom}`);
                unity_id = await findRoom(selectedBuilding, selectedRoom);
                destinationName = `${selectedBuilding} ${selectedRoom}`;

            } else if (selectedBuilding) {
                console.log(`建物のIDを取得中: ${selectedBuilding}`);
                unity_id = await findBuilding(selectedBuilding);
                destinationName = selectedBuilding;
            }

            if (unity_id) {
                sendMessage("JSInterface", "PathfindingRequested", unity_id);
                console.log(`Unityに目的地IDを送信しました: ${destinationName} (ID: ${unity_id})`);
                setIsDropdownOpen(false);

            } else {
                console.error("Unity IDの取得に失敗したため、メッセージは送信されませんでした。");
                alert("目的地の情報取得に失敗しました。APIの応答を確認してください。");
            }

        } catch (err) {
            console.error("目的地IDの取得または送信中にエラーが発生しました:", err);
            if (err instanceof Error) {
                alert(`目的地の情報取得中にエラーが発生しました: ${err.message}`);
            } else {
                alert("目的地の情報取得中に不明なエラーが発生しました。");
            }
        }
    };

    // ★ --- 2D/3D 切り替え関数 (NavigationScreenから移植) ---
    const ViewSwitch = (currentView: string) => {
        if (!isUnityReady) {
            console.log("Unity not ready, cannot switch view.");
            return;
        }

        if (currentView === "2D") {
            sendMessage("JSInterface", "SwitchToPlaneView");
            setSwitchButton("3D");
        }
        else {
            sendMessage("JSInterface", "SwitchToSolidView");
            setSwitchButton("2D");
        }
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* (ErrorPopup, ヘッダー は変更なし) */}
            <ErrorPopup
                isOpen={isPopupOpen}
                message={popupMessage}
                onClose={handleClosePopup}
            />
            <div className="bg-red-700 text-white p-4">
                <h1 className="flex items-center gap-2 text-xl font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    キャンパスナビ
                </h1>
            </div>

            {/* (検索バー, ドロップダウン は変更なし) */}
            <div className="p-4 relative">
                <Button
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="w-full flex justify-start items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 mr-2"><circle cx="11" cy="11" r="8" /><path d="m16.5 16.5 4.5 4.5" /></svg>
                    {selectedBuilding && selectedRoom
                        ? `目的地: ${selectedBuilding} ${selectedRoom}`
                        : selectedBuilding
                            ? `目的地: ${selectedBuilding}`
                            : "建物・教室を検索"}
                </Button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-4 right-4 mt-2 z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4 space-y-4">
                            
                            <div>
                                <label htmlFor="buildingSelect" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    建物を選択
                                </label>
                                <select
                                    id="buildingSelect"
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={selectedBuilding}
                                    onChange={handleBuildingSelect}
                                    disabled={loadingBuildings}
                                >
                                    <option value="">-- 選択してください --</option>
                                    {loadingBuildings ? (
                                        <option value="" disabled>読み込み中...</option>
                                    ) : errorBuildings ? (
                                        <option value="" disabled>{errorBuildings}</option>
                                    ) : (
                                        buildings.map(b => (
                                            <option key={b.id} value={b.building_name}>
                                                {b.building_name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {selectedBuilding && (
                                <div>
                                    <label htmlFor="roomSelect" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                        教室を選択 (オプション)
                                    </label>
                                    <select
                                        id="roomSelect"
                                        className="border rounded p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={selectedRoom}
                                        onChange={handleRoomSelect}
                                        disabled={!selectedBuilding || searchResults.length === 0}
                                    >
                                        <option value="">-- 選択してください --</option>
                                        {searchResults.length > 0 ? (
                                            searchResults.map(r => (
                                                <option key={r.room_id} value={r.room}>
                                                    {r.room}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>教室が見つかりません</option>
                                        )}
                                    </select>
                                </div>
                            )}
                            
                            <Button
                                onClick={handleStartNavigation}
                                disabled={!selectedBuilding}
                                className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {selectedBuilding && selectedRoom
                                    ? "教室へ案内開始"
                                    : selectedBuilding
                                        ? "建物へ案内開始"
                                        : "案内開始"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Unityアプリケーション表示エリア */}
            <div className="flex-1 min-h-0 p-4">
                <div className="w-full h-full bg-gray-900 rounded-lg relative overflow-hidden">
                    <Unity unityProvider={unityProvider} className="w-full h-full" />
                    
                    {/* (現在地カード は変更なし) */}
                    <Card className="absolute top-4 left-4 p-3">
                        <div className="flex items-center gap-2 cursor-pointer"
                            onClick={FollowUser}
                        >
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-blue-600"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">現在地</p>
                                <p className="text-gray-500 text-sm">
                                    {location.error ? <span className="text-red-500">{location.error}</span> :
                                        location.latitude && location.longitude
                                            ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
                                            : "位置情報を取得中..."}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* ★ 2D/3D切り替えボタン を配置 */}
                    <div className="absolute top-4 right-4">
                        {selectedBuilding && selectedRoom && isUnityReady && (
                            <Button
                                onClick={() => { ViewSwitch(switchButton) }}
                                // ★ TailwindCSSのクラスを調整 (Cardと似た外観に)
                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-md rounded-lg"
                            >
                                {switchButton}に切り替え
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};