import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import {osName} from "react-device-detect";

const findRoom = async (building: string, room: string) => {
  try {
    const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings?name=${building}`);
    //let unity_id = res.unity_id;
    const Building_data = await res.json();
    const Building_id = Building_data[0].id;

    const res2 = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings/${Building_id}/rooms?name=${room}`);
    const Room_data = await res2.json();
    //本当はこれを送る
    const unity_id = Room_data[0].unity_id;


    // レスポンスが正常でない場合（404, 500エラーなど）
    if (!res.ok) {
      throw new Error('サーバーからの応答が正常ではありません。');
    }

    return unity_id;

  } catch (err) {
    // ネットワークエラーや上記でthrowしたエラーをキャッチ
    console.error("部屋情報の取得に失敗しました:", err);
    return null; // エラー発生時にnullを返す
  }
};

const findBuilding = async (building: string) => {
  try {
    const res = await fetch(`https://r-navi.math.ryukoku.ac.jp/api/buildings?name=${building}`);
    //let unity_id = res.unity_id;
    const Building_data = await res.json();
    const unity_id = Building_data[0].unity_id;
    console.log(unity_id);

    // レスポンスが正常でない場合（404, 500エラーなど）
    if (!res.ok) {
      throw new Error('サーバーからの応答が正常ではありません。');
    }

    return unity_id;

  } catch (err) {
    // ネットワークエラーや上記でthrowしたエラーをキャッチ
    console.error("建物情報の取得に失敗しました:", err);
    return null; // エラー発生時にnullを返す
  }
};

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

// --- Helper Components ---

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

// --- Main NavigationScreen Component ---

export const NavigationScreen = ({ building, room, onBack }: { building: string; room: string; onBack: () => void; }) => {
    // Unityのコンテキストを初期化し、sendMessage関数を取得
    const { unityProvider, sendMessage, unload} = useUnityContext({
        loaderUrl: "/Build/3517d7a01a316e5bf9186dfad0c60e87.loader.js",
        dataUrl: "/Build/72b8084547a26c4d11625e36e4ebec30.data",
        frameworkUrl: "/Build/44fdf7c87db8aaf4789a6cc8968a3b46.framework.js",
        codeUrl: "/Build/7e5429539ecbb895932239683ce6971a.wasm",
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
    const [isUnityReady, setIsUnityReady] = useState(false);

    //switch button
    const [switchButton, setswitchButton] = useState("2D");

    useEffect(() => {
    return () => {
        unload();
    };
}, [unload]);


    /**
     * Unityの準備が完了したら、目的地を送信する
     */
    useEffect(() => {
        
    // useEffectの中で非同期処理を行うためのasync関数を定義
    const fetchAndSendMessage = async () => {
        if (isUnityReady && building && room) {
            // await を使って、findRoomの結果（Promise）が解決されるのを待つ
            console.log(building + room);
            const unity_id = await findRoom(building, room);

            // unity_idが正常に取得できた場合のみメッセージを送信
            if (unity_id) {
                sendMessage("JSInterface", "PathfindingRequested", unity_id);
                console.log(`Unityに目的地IDを送信しました: ${unity_id}`);
            } else {
                console.error("Unity IDの取得に失敗したため、メッセージは送信されませんでした。");
            }
        }

        if(isUnityReady && building && !room){
            const unity_id = await findBuilding(building);

            // unity_idが正常に取得できた場合のみメッセージを送信
            if (unity_id) {
                sendMessage("JSInterface", "PathfindingRequested", unity_id);
                console.log(`Unityに目的地IDを送信しました: ${unity_id}`);
            } else {
                console.error("Unity IDの取得に失敗したため、メッセージは送信されませんでした。");
            }
        }
    };

    // 定義した非同期関数を実行
    fetchAndSendMessage();

}, [isUnityReady, building, room, sendMessage]);

    //デバイスを認識して、Unityに送信
    useEffect(() => {
        if(isUnityReady){
            sendMessage("JSInterface", "SetUserDevice", osName);
        }

    }, [isUnityReady]);


// Unityからのメッセージを監視するuseEffect
    useEffect(() => {
         const handleUnityMessage = (event: Event) => {
            const customEvent = event as CustomEvent<UnityMessagePayload>;
            // ★ `onUnityLoaded` を処理するロジックに変更
            if (!customEvent.detail) return; 

            const { functionName, message } = customEvent.detail;
            console.log("Unityからイベントを受信:", functionName, message);

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
      setLocation((prev) => ({ ...prev, error: "お使いのブラウザは位置情報機能に対応していません。" }));
      return;
    }

    console.log("Unity準備完了。位置情報の監視を開始します。");
    let watcherId: number | null = null;
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude, error: null });
      if (latitude !== null && longitude !== null) {
        const locationString = `${latitude},${longitude}`;
        // console.log("Unityへ位置情報を送信:", locationString); // ログが多い場合はコメントアウト
        sendMessage("JSInterface", "SetLocation", locationString);
      }
    };
    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({ ...prev, error: `位置情報の取得に失敗しました: ${error.message}` }));
    };
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
  // ★ 依存配列に isUnityReady を追加
  }, [isUnityReady, sendMessage]);


    // ポップアップを閉じる関数
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // 空の座標を送信してエラーを発生させる関数
    /*
    const sendEmptyCoordinates = () => {
        sendMessage("JSInterface", "SetLocation", "");
    };
    */

    const ViewSwitch = (currentView : string) => {
        if(currentView === "2D"){
            sendMessage("JSInterface", "SwitchToPlaneView");
            setswitchButton("3D");
        }
        else{
            sendMessage("JSInterface", "SwitchToSolidView");
            setswitchButton("2D");
        }
    }

    const FollowtoUser = () => {
        sendMessage("JSInterface", "FollowToUser");
    }
    return (
        <div className="h-full flex flex-col">
            <ErrorPopup
                isOpen={isPopupOpen}
                message={popupMessage}
                onClose={handleClosePopup}
            />
            {/* ヘッダー */}
            <div className="bg-red-600 text-white p-4 flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                </button>
                <div className="flex-1">
                    <h1 className="font-bold">案内画面</h1>
                    <p className="opacity-90 text-sm">{building} {room}</p>
                </div>
            </div>

            {/* Unityアプリケーション表示エリア */}
            <div className="flex-1 min-h-0">
                <div className="w-full h-full bg-gray-900 rounded-lg relative overflow-hidden">
                    <Unity unityProvider={unityProvider} className="w-full h-full" />
            {/* 目的地表示カード */}
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md flex items-center gap-3 max-w-xs">
                
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">目的地</p>
                    <p className="font-semibold truncate">{building} {room}</p>
                </div>
            </div>

            {/* 現在地表示カード */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md flex items-center gap-3 max-w-xs"
            onClick={FollowtoUser}
            >
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-green-600">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-gray-500">現在地</p>
                    <p className="font-semibold text-sm truncate">
                        {location.error ? <span className="text-red-500">{location.error}</span> :
                            location.latitude && location.longitude
                                ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
                                : "取得中..."}
                    </p>
                </div>
            </div>
                    {/*
                    {/* 空の座標を送信するボタン */}
                    {/* <div className="absolute bottom-4 right-4">
                        <button
                            onClick={sendEmptyCoordinates}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            空の座標を送信
                        </button>
                    </div> */}

                    {/*2D3D切り替えボタン */}
                {room && (
                    <div className="absolute bottom-4 right-4">
                        <button
                            onClick={() => { ViewSwitch(switchButton) }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {switchButton}に切り替え
                        </button>
                    </div>
                )}

            </div>
        </div>
    </div>
);
};