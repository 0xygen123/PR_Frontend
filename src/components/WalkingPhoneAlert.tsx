import { AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
2
interface WalkingPhoneAlertProps {
  onComplete: () => void;
}

export function WalkingPhoneAlert({ onComplete }: WalkingPhoneAlertProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-orange-50  rounded-lg">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Smartphone className="w-20 h-20 text-orange-600" />
            <AlertTriangle className="w-8 h-8 text-red-600 absolute -top-2 -right-2" />
          </div>
        </div>
        
        <h2 className="text-red-600 animate-pulse mb-4">
          歩きスマホ注意
        </h2>

        <div className="text-orange-700 space-y-3 mb-8">
          <p>・歩行中のスマートフォン操作は危険です</p>
          <p>・周囲の安全を確認してから操作してください</p>
          <p>・階段や段差にご注意ください</p>
        </div>
        
        <Button 
          onClick={onComplete}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          閉じる
        </Button>

      </div>
    </div>
  );
}