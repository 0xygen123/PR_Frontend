import React from 'react';

// ErrorPopupコンポーネントのプロップスの型定義
interface ErrorPopupProps {
  isOpen: boolean;       // ポップアップの表示状態を管理
  message: string;       // 表示するメッセージ
  onClose: () => void;   // ポップアップを閉じるための関数
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ isOpen, message, onClose }) => {
  // isOpenがfalseの場合は何も表示しない
  if (!isOpen) {
    return null;
  }

  return (
    // オーバーレイ：画面全体を覆い、背景を少し暗くする
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      
      {/* ポップアップ本体 */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
        
        {/* タイトル */}
        <h3 className="text-lg font-bold text-red-600">メッセージ受信</h3>
        
        {/* Unityから受け取ったメッセージ */}
        <p className="mt-2 text-gray-700">{message}</p>
        
        {/* 閉じるボタン */}
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

export default ErrorPopup;