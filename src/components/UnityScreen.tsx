import Unity from "./Unity"

interface UnityScreenProps {
  onBack: () => void;
}

export function UnityScreen({ onBack }: UnityScreenProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Unityのテスト画面</h1>
      <Unity />
      
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground"
      >
        ホームに戻る
      </button>
    </div>
  );
}