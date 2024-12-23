export type Transaction = {
  id?: string;
  year: number;
  month: string;
  earned: string;
  owed: string;
  transactionType: string;
  paid: boolean;
};