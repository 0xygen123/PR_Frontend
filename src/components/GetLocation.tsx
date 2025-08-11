import { useState, useEffect } from "react";

// 位置情報データの型定義
interface GeolocationState {
  latitude: number | null;            // 緯度
  longitude: number | null;           // 経度
  altitude: number | null;            // 高度
  speed: number | null;               // 移動速度 (m/s)
  heading: number | null;             // 移動方向 (0-360度)
  accuracy: number | null;            //緯度・経度の精度
  altitudeAccuracy: number | null;   //高度の精度
  error:
  string | null;
}

//sendMessage関数の型定義
interface GetLocationProps {
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter: string
  ) => void;
}

const GetLocation: React.FC<GetLocationProps> = ({ sendMessage }) => {
  // 位置情報の初期設定
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    altitude: null,
    speed: null,
    heading: null,
    accuracy: null,
    altitudeAccuracy: null,
    error: null,
  });

  // レンダリング時に処理開始
  useEffect(() => {
    // ブラウザがAPIに対応していない場合エラー発生
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "お使いのブラウザは位置情報機能に対応していません。",
      }));
      return;
    }

    let watcherId: number | null = null;

    // 成功時のコールバック関数
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, altitude, speed, heading ,accuracy, altitudeAccuracy} = position.coords;
      setLocation({
        latitude,
        longitude,
        altitude,
        speed,
        heading,
        accuracy,
        altitudeAccuracy,
        error: null,
      });

      // 緯度と経度が取得できたらUnity側へ送信
      if (latitude !== null && longitude !== null) {
        const locationString = `${latitude},${longitude}`;
        sendMessage("JSInterface", "SetLocation", locationString);
      }
    };

    // 失敗時のコールバック関数
    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: `位置情報の取得に失敗しました: ${error.message}`,
      }));
    };
    
    // 位置情報の監視を開始
    watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true, // 高精度の位置情報を要求する
      timeout: 10000,           // タイムアウトまでの時間 (ミリ秒)
      maximumAge: 0,            // キャッシュされた位置情報を使わない
    });

    // コンポーネントがアンマウントされたときに監視を停止する
    return () => {
      if (watcherId) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, []);

    return (
    <div>
      <h2>あなたの現在地情報</h2>
      {location.error ? (
        <p style={{ color: "red" }}>{location.error}</p>
      ) : (
        <>
          {location.latitude !== null && location.longitude !== null ?(
            <ul>
              <li>緯度 (Latitude): {location.latitude.toFixed(6)}</li>
              <li>経度 (Longitude): {location.longitude.toFixed(6)}</li>
              <li>
                高度 (Altitude): 
                {location.altitude !== null ? `${location.altitude.toFixed(2)} m` : "N/A"}
              </li>
              <li>
                移動速度 (Speed): 
                {location.speed !== null ? `${(location.speed * 3.6).toFixed(2)} km/h` : "N/A"}
              </li>
              <li>
                緯度経度の精度 (Accuracy):
                {location.accuracy !== null ? `${location.accuracy.toFixed(2)}` : "N/A"}
              </li>
              <li>
                高度の精度 (AltitudeAccuracy):
                {location.altitudeAccuracy !== null ? `${location.altitudeAccuracy.toFixed(2)}` : "N/A"}
              </li>
            </ul>
          ) : (
            <p>位置情報を取得中...</p>
          )}
        </>
      )}
    </div>
  );
}
export default GetLocation;