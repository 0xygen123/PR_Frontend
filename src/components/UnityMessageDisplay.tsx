import { useState, useEffect, type FC } from 'react';

// detailオブジェクトの型
interface UnityMessagePayload {
  functionName: string;
  message: string | null;
}

const UnityMessageDisplay: FC = () => {

  // 呼び出された関数名を保持するためのState
  const [functionName, setFunctionName] = useState<string>("");
  // Unityからのエラーメッセージを保持するためのState
  const [messageFromUnity, setMessageFromUnity] = useState<string>("...");
  

  useEffect(() => {
    const handleUnityMessage = (event: Event) => {
      const customEvent = event as CustomEvent<UnityMessagePayload>;
      
      //イベントにdetailが含まれていれば処理
      if (customEvent.detail) {
        console.log("Unityからイベントを受信:", customEvent.detail);

        //エラーを出した関数名を更新
        setFunctionName(customEvent.detail.functionName);
        
        if (typeof customEvent.detail.message === 'string') {
          setMessageFromUnity(customEvent.detail.message); //messageを更新
        } else {
          setMessageFromUnity("(引数なし)"); // messageがnullの場合の表示
        }
      }
    };

    //windowオブジェクトにイベントリスナーを追加
    window.addEventListener('unity-message', handleUnityMessage);

    return () => {
      //コンポーネント破棄時にイベントリスナーを削除
      window.removeEventListener('unity-message', handleUnityMessage);
    };
  }, []);

  return (
    <div style={{ border: '2px solid #333', padding: '20px', marginTop: '20px' }}>
      <h2>React Component</h2>

      <p><strong>呼び出された関数名:</strong></p>
      <p style={{ fontSize: '18px', color: 'green', fontFamily: 'monospace' }}>
        {functionName || "(まだ受信していません)"}
      </p>

      <p><strong>受け取ったメッセージ(引数):</strong></p>
      <p style={{ fontSize: '24px', color: 'blue' }}>
        {messageFromUnity}
      </p>
    </div>
  );
}

export default UnityMessageDisplay;