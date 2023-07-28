export interface HistoryCleaningAction {
  id: number;
  beforePicture: string;
  afterPicture: string;
  score: number;
  date: string;
}
