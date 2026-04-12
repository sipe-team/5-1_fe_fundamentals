export type ApiQueryValue = string | number | boolean | null | undefined;

export type ApiQueryParams = Record<string, ApiQueryValue>;

export interface IdPathRequest {
  id: string;
}

export interface DateQueryRequest {
  date: string;
}
