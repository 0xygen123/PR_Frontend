import { AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from './ui/button';


interface WalkingPhoneAlertProps {
  onComplete: () => void; // 警告を閉じる時に実行される処理
}

// 歩きスマホ警告の画面を表示するコンポーネント
export function WalkingPhoneAlert({ onComplete }: WalkingPhoneAlertProps) {
  return (
    // 画面全体をオレンジ背景にして中央寄せ
    <div className="h-full flex flex-col items-center justify-center p-6 bg-orange-50">
      <div className="text-center max-w-md">
        
        {/* スマホ＋警告アイコン */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* スマホのアイコン（大きめ） */}
            <Smartphone className="w-20 h-20 text-orange-600" />
            {/* 三角の警告アイコン（右上に重ねる） */}
            <AlertTriangle className="w-8 h-8 text-red-600 absolute -top-2 -right-2" />
          </div>
        </div>
        
        {/* 警告メッセージ（赤文字・点滅アニメーション） */}
        <h2 className="text-red-600 animate-pulse mb-4">
          歩きスマホ注意
        </h2>

        {/* 注意事項のリスト（オレンジ文字・間隔あり） */}
        <div className="text-orange-700 space-y-3 mb-8">
          <p>・歩行中のスマートフォン操作は危険です</p>
          <p>・周囲の安全を確認してから操作してください</p>
          <p>・階段や段差にご注意ください</p>
        </div>
        
        {/* 閉じるボタン */}
        <Button 
          onClick={onComplete} // 閉じる処理を実行
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          閉じる
        </Button>

      </div>
    </div>
  );
}
