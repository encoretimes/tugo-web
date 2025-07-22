export interface Point {
  id: number;
  type: 'earn' | 'spend';
  description: string;
  amount: number;
  date: string;
}
