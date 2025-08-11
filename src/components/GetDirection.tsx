import React, { useState, useEffect, useCallback, useRef } from 'react';

interface DeviceOrientationEventWithCompass extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

const Compass: React.FC = () => {

  const [heading, setHeading] = useState<number | null>(null); // デバイスの現在の方角（0-360°）
  const [error, setError] = useState<string | null>(null); // エラーメッセージを保持
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false); // iOSでセンサーへのアクセス許可がされたかどうかのフラグ
  const [dataSource, setDataSource] = useState<string>('待機中...'); // どのセンサー情報を利用しているかを示す文字列
  
  // 絶対方位のイベント(deviceorientationabsolute)が一度でも発火したかを記録するためのフラグ
  const absoluteEventFired = useRef(false);

  // デバイスの向きが変わるたびに呼び出されるメインの処理関数
  const handleOrientation = useCallback((event: DeviceOrientationEventWithCompass) => {
    let currentHeading: number | null = null;
    
    // iOSのSafariが提供するwebkitCompassHeadingがあれば使用
    if (event.webkitCompassHeading) {
      currentHeading = event.webkitCompassHeading;
    } 
    // 標準のalpha値が存在する場合
    else if (event.alpha !== null) {
      if (event.absolute === true || typeof event.absolute === 'undefined') {
        currentHeading = event.alpha;
      }
    }

    // 有効な方角が取得できた場合のみstateを更新
    if (currentHeading !== null) {
      setHeading(Math.round(currentHeading));
    }
  }, []);

  // iOSデバイスでセンサーのアクセス許可をリクエストする関数
  const requestPermission = async () => {
    const requestPermissionFunc = (DeviceOrientationEvent as any).requestPermission;

    // 対応していなければエラー表示
    if (typeof requestPermissionFunc !== 'function') {
      setError('このデバイス/ブラウザでは権限リクエストはサポートされていません。');
      return;
    }
    
    try {
      // ユーザーに許可を求めるダイアログ表示
      const permissionState = await requestPermissionFunc();
      
      if (permissionState === 'granted') {
        // 許可された場合
        setPermissionGranted(true);
        setDataSource('webkitCompassHeading (iOS)'); 
      } else {
        // 拒否された場合
        setError('デバイスの方角センサーへのアクセスが拒否されました。');
      }
    } catch (err) {
      // リクエスト中に何らかのエラーが発生した場合
      if (err instanceof Error) {
        setError(`権限リクエスト中にエラーが発生しました: ${err.message}`);
      } else {
        setError(`権限リクエスト中に不明なエラーが発生しました。`);
      }
      console.error(err);
    }
  };

  // 許可が下りたiOSデバイス向けのuseEffect
  useEffect(() => {
    // センサーのアクセス許可がtrueの場合のみイベントリスナーを追加
    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
    }
    
    // コンポーネントがアンマウントされる際のクリーンアップ処理
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, [permissionGranted, handleOrientation]);
  
  // 現在のデバイスがiOSかどうかを判定するフラグ
  const isIOS = typeof (DeviceOrientationEvent as any)?.requestPermission === 'function';

  // AndroidデバイスやPC向けのuseEffect
  useEffect(() => {
    if (isIOS) return;

    // 'deviceorientationabsolute' イベント用のハンドラ
    const absoluteHandler = (event: DeviceOrientationEvent) => {
      // このイベントが最初に発火した時だけ実行
      if (!absoluteEventFired.current) {
        setDataSource('deviceorientationabsolute (絶対方位)');
        absoluteEventFired.current = true; // フラグを立て、以降は実行しない
      }
      handleOrientation(event);
    };

    // 'deviceorientation' イベント用のハンドラ
    const standardHandler = (event: DeviceOrientationEvent) => {
      // 絶対方位イベントがまだ一度も発火していない場合のみ、データソースを更新
      if (!absoluteEventFired.current) {
        setDataSource('deviceorientation (回転)');
      }
      handleOrientation(event);
    };

    // 2種類のイベントリスナーを登録して対応しているほうを実行
    window.addEventListener('deviceorientationabsolute', absoluteHandler as EventListener, true);
    window.addEventListener('deviceorientation', standardHandler as EventListener, true);
    
    // クリーンアップ処理
    return () => {
      window.removeEventListener('deviceorientationabsolute', absoluteHandler as EventListener);
      window.removeEventListener('deviceorientation', standardHandler as EventListener);
    }
  }, [isIOS, handleOrientation]);


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🧭 デバイスの方角</h2>
      
      {/* iOSデバイスで、まだ許可が下りていない場合にのみ表示 */}
      {isIOS && !permissionGranted && (
        <>
          <p>iPhone/iPadでは、センサーへのアクセス許可が必要です。</p>
          <button onClick={requestPermission} style={{ padding: '10px 20px', fontSize: '1rem' }}>
            アクセスを許可する
          </button>
        </>
      )}

      {/* エラーが発生した場合にエラーメッセージを表示 */}
      {error && <p style={{ color: 'red' }}><strong>エラー:</strong> {error}</p>}
      
      {/* 方角が取得できた場合にのみ、その値を表示 */}
      {heading !== null && (
        <div style={{ margin: '20px 0' }}>
          <p style={{ fontSize: '1.2rem' }}>現在の方角 (北: 0°)</p>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '10px 0' }}>{heading}°</p>
        </div>
      )}
      
      {/* どのセンサーを利用しているかを表示するデバッグ情報 */}
      <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>使用中のセンサー:</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#000' }}>
          {dataSource}
        </p>
      </div>

    </div>
  );
};

export default Compass;