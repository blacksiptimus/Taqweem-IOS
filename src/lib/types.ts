export type Contract = {
  id: string;
  user_id: string;
  title: string | null;
  provider: string | null;
  category: string | null;
  amount: number | null;
  billing_cycle: string | null;
  renewal_date: string | null;
  cancel_by_date: string | null;
  notice_days: number | null;
  early_termination_fee: number | null;
  file_path: string | null;
  raw_text: string | null;
  notes: string | null;
  created_at: string;
};

export type ContractInsert = Omit<Contract, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};
