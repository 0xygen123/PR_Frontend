/**
 * 検索機能で使用する型定義ファイル
 */

// 検索結果の単一アイテムの型定義
export interface SearchResult {
  building: string; // 号館名
  room: string; // 教室名
}

// 号館と教室の対応関係を表すマップの型定義
export type RoomsByBuilding = Record<string, string[]>;