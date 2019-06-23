export interface WebGridColumn {
  label: string;
  name: string;
}

export interface WebGridLoadOptions {
  page?: number;
  pageSize?: number;
  sort?: {column: string, dir: 'asc' | 'desc'}
  done: (data: any, total?: number) => void;
}

export interface WebGridDS {
  load: (options: WebGridLoadOptions) => void;
}

export interface WebGridConfig {
  columns: WebGridColumn[];
  data?: any[];
  dataSource: WebGridDS;
  listeners: any;
}
