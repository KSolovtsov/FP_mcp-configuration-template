// Type definitions for Enhanced Notion MCP Server

export interface NotionFilter {
  property?: string;
  timestamp?: 'created_time' | 'last_edited_time';

  // Filter conditions
  rich_text?: {
    equals?: string;
    does_not_equal?: string;
    contains?: string;
    does_not_contain?: string;
    starts_with?: string;
    ends_with?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  number?: {
    equals?: number;
    does_not_equal?: number;
    greater_than?: number;
    less_than?: number;
    greater_than_or_equal_to?: number;
    less_than_or_equal_to?: number;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  checkbox?: {
    equals?: boolean;
    does_not_equal?: boolean;
  };

  select?: {
    equals?: string;
    does_not_equal?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  multi_select?: {
    contains?: string;
    does_not_contain?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  date?: {
    equals?: string;
    before?: string;
    after?: string;
    on_or_before?: string;
    on_or_after?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
    past_week?: {};
    past_month?: {};
    past_year?: {};
    next_week?: {};
    next_month?: {};
    next_year?: {};
  };

  people?: {
    contains?: string;
    does_not_contain?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  files?: {
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  relation?: {
    contains?: string;
    does_not_contain?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };

  formula?: {
    string?: any;
    checkbox?: any;
    number?: any;
    date?: any;
  };

  // Compound filters
  and?: NotionFilter[];
  or?: NotionFilter[];
}

export interface NotionSort {
  property?: string;
  timestamp?: 'created_time' | 'last_edited_time';
  direction: 'ascending' | 'descending';
}

export interface QueryDatabaseParams {
  database_id: string;
  filter?: NotionFilter;
  sorts?: NotionSort[];
  start_cursor?: string;
  page_size?: number;
}

export interface CreatePageParams {
  parent: {
    type?: 'page_id' | 'database_id';
    page_id?: string;
    database_id?: string;
  };
  properties: Record<string, any>;
  children?: any[];
  icon?: {
    type: 'emoji';
    emoji: string;
  } | {
    type: 'external';
    external: { url: string };
  };
  cover?: {
    type: 'external';
    external: { url: string };
  };
}

export interface UpdatePageParams {
  page_id: string;
  properties?: Record<string, any>;
  archived?: boolean;
  icon?: any;
  cover?: any;
}

export interface BlockContent {
  type: string;
  [key: string]: any;
}

export interface BatchUpdateOperation {
  page_id: string;
  properties: Record<string, any>;
}

export interface FileUploadParams {
  name: string;
  file?: Buffer;
  external_url?: string;
}
