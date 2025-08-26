import { useState, useEffect } from 'react';

// APIから返ってくる building オブジェクトの型を定義
type Building = {
  id: number;
  building_name: string;
  image_path: string;
  unity_id: string;
};

export function BuildingList() {
  // APIから取得した建物オブジェクトのリストを保存するstate
  const [buildings, setBuildings] = useState<Building[]>([]);
  // 建物名だけの配列を保存するstate
  const [buildingNames, setBuildingNames] = useState<string[]>([]);
  // データの読み込み状態を管理するstate
  const [loading, setLoading] = useState(true);
  // エラーメッセージを保存するstate（null許容）
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('??????????????');
        
        if (!response.ok) {
          throw new Error('サーバーからの応答がありません');
        }
        
        const data: Building[] = await response.json();
        
        setBuildings(data);

        const names = data.map(building => building.building_name);
        setBuildingNames(names);

      } catch (err) {
        let errorMessage = '不明なエラーが発生しました';
        
        // errがErrorオブジェクトのインスタンスかチェック
        if (err instanceof Error) {
          // このifブロックの中では、errはError型だと推論される
          errorMessage = err.message;
        }
        
        setError(errorMessage);

      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []); // 初回レンダリング時のみ実行

  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div>
      <h1>🏢 建物一覧</h1>
      <ul>
        {buildings.map((building) => (
          <li key={building.id}>
            {building.building_name}
          </li>
        ))}
      </ul>
      
      <hr />

      <h2>建物名リスト（ドロップダウン例）</h2>
      <select>
        {buildingNames.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}