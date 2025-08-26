import { useState, useEffect, type FC } from 'react';
import ErrorPopup from './ErrorPopup'; // 作成したErrorPopupコンポーネントをインポート

// detailオブジェクトの型
interface UnityMessagePayload {
  functionName: string;
  message: string | null;
}

const UnityMessageDisplay: FC = () => {
  // 既存のState（デバッグ表示用）
  const [functionName, setFunctionName] = useState<string>("");
  const [messageFromUnity, setMessageFromUnity] = useState<string>("...");
  
  // ポップアップ用のStateを追加
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

  useEffect(() => {
    const handleUnityMessage = (event: Event) => {
      const customEvent = event as CustomEvent<UnityMessagePayload>;
      
      if (customEvent.detail) {
        console.log("Unityからイベントを受信:", customEvent.detail);

        const receivedMessage = customEvent.detail.message || "(引数なし)";

        // 既存のデバッグ表示用のStateを更新
        setFunctionName(customEvent.detail.functionName);
        setMessageFromUnity(receivedMessage);
        
        // --- ポップアップ表示ロジック ---
        // Unityからのmessageがnullや空文字でない場合にポップアップを表示する
        if (customEvent.detail.message) { 
          setPopupMessage(receivedMessage);
          setIsPopupOpen(true);
        }
      }
    };

    window.addEventListener('unity-message', handleUnityMessage);

    return () => {
      window.removeEventListener('unity-message', handleUnityMessage);
    };
  }, []);

  // ポップアップを閉じるための関数
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* ErrorPopupコンポーネントを呼び出し */}
      <ErrorPopup
        isOpen={isPopupOpen}
        message={popupMessage}
        onClose={handleClosePopup}
      />

      {/* 既存のメッセージ表示エリア (デバッグ用) */}
      <div style={{ border: '2px solid #333', padding: '20px', marginTop: '20px' }}>
        <h2>React Component (Debug View)</h2>
        <p><strong>呼び出された関数名:</strong></p>
        <p style={{ fontSize: '18px', color: 'green', fontFamily: 'monospace' }}>
          {functionName || "(まだ受信していません)"}
        </p>
        <p><strong>受け取ったメッセージ(引数):</strong></p>
        <p style={{ fontSize: '24px', color: 'blue' }}>
          {messageFromUnity}
        </p>
      </div>
    </>
  );
}

export default UnityMessageDisplay;