export interface QueryParams {
  take?: number;
  page?: number;
}

export interface ListResponse<T> {
  results: T[];
  meta: {
    total: number;
    page: number;
    pageCount: number;
    pages: number;
  };
}
