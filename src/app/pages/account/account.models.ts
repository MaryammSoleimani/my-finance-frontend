// account.models.ts
export interface AccountData {
  id: number;
  name: string;
  balance: number;
  type: string;
  is_debt: boolean;
  color: string;
}

export interface AccountApiResponse {
  assets: AccountData[];
  liabilities: AccountData[];
  net_worth: number;
  total_assets: number;
  total_liabilities: number;
  chart_data: {
    series: any[];
    dates: string[];
    colors: string[];
  };
}
