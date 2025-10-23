import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { osName } from "react-device-detect";

// --- Type Definitions ---

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}

interface UnityMessagePayload {
    functionName: string;
    message: string | null;
}

// --- Helper Components (These can be moved to their own files) ---

const Button = ({ onClick, children, className }: { onClick?: () => void, children: React.ReactNode, className?: string }) => (
    <button onClick={onClick} className={`border p-2 rounded ${className}`}>
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

export const HomeScreen = ({ onSearchClick }: { onSearchClick: () => void; }) => {
    // Unityのコンテキストを初期化し、sendMessage関数を取得
    const { unityProvider, sendMessage, isLoaded, unload } = useUnityContext({
        loaderUrl: "/Build/b6cf73e983dbc4b68e972c5c2c5add8d.loader.js",
        dataUrl: "/Build/469be7a921709f91a18e7f222e828db8.data",
        frameworkUrl: "/Build/470ba071bb95eb745b267c99af5f081f.framework.js",
        codeUrl: "/Build/1dba53c8f36b24d7a4cc51db313b7ac4.wasm",
    });

    // 位置情報用のState
    const [location, setLocation] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
    });

    // ポップアップ表示用のState
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    // ★ Unityの準備完了を管理するState
    const [isUnityReady, setIsUnityReady] = useState(false);

    useEffect(() => {
        return () => {
            unload();
        };
    }, [unload]);


    //デバイスを認識して、Unityに送信
    useEffect(() => {
        if (isLoaded) {
            sendMessage("JSInterface", "SetUserDevice", osName);
        }

    }, [isLoaded]);

    // Unityからのメッセージを監視するuseEffect
    useEffect(() => {
        const handleUnityMessage = (event: Event) => {
            const customEvent = event as CustomEvent<UnityMessagePayload>;
            if (!customEvent.detail) return; // detailがない場合は何もしない

            const { functionName, message } = customEvent.detail;
            console.log("Unityからイベントを受信:", functionName, message); // 受信内容をログに出力

            // ★ 'onUnityLoaded' を受信したら isUnityReady を true にする
            if (functionName === "onUnityLoaded") {
                console.log("Unityの準備完了通知を受信！");
                setIsUnityReady(true);
            }
            // 'onUnityLoaded' 以外のメッセージ（エラーなど）が来た場合の処理
            else if (message) {
                setPopupMessage(message);
                setIsPopupOpen(true);
            }
        };

        window.addEventListener('unity-message', handleUnityMessage);
        return () => {
            window.removeEventListener('unity-message', handleUnityMessage);
        };
    }, []); // 依存配列は空のままでOK

    // 位置情報の監視とUnityへの送信を行うuseEffect
    useEffect(() => {
        // ★ Unityの準備が完了していない場合は、何もしない
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
                console.log("Unityへ位置情報を送信:", locationString); // 送信をログに出力
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
        // ★ 依存配列に isUnityReady と sendMessage を指定
    }, [isUnityReady, sendMessage]);

    // ポップアップを閉じる関数
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    /*
    // 空の座標を送信してエラーを発生させる関数
    const sendEmptyCoordinates = () => {
        sendMessage("JSInterface", "SetLocation", "");
    };
    */

    const FollowUser = () => {
        sendMessage("JSInterface", "FollowToUser");
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <ErrorPopup
                isOpen={isPopupOpen}
                message={popupMessage}
                onClose={handleClosePopup}
            />
            {/* ヘッダー */}
            <div className="bg-red-700 text-white p-4">
                <h1 className="flex items-center gap-2 text-xl font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    キャンパスナビ
                </h1>
            </div>

            {/* 検索バー */}
            <div className="p-4">
                <Button
                    onClick={onSearchClick}
                    className="w-full flex justify-start items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 mr-2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    建物・教室を検索
                </Button>
            </div>

            {/* Unityアプリケーション表示エリア */}
            <div className="flex-1 min-h-0 p-4">
                <div className="w-full h-full bg-gray-900 rounded-lg relative overflow-hidden">
                    <Unity unityProvider={unityProvider} className="w-full h-full" />
                    <Card className="absolute top-4 left-4 p-3">
                        <div className="flex items-center gap-2 cursor-pointer"
                            onClick={FollowUser}
                        >
                            {/* アイコン部分 */}
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-blue-600"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                            </div>
                            {/* テキスト部分 */}
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
                    <div className="absolute top-4 right-4">
                    </div>
                </div>
            </div>
        </div>
    );
};