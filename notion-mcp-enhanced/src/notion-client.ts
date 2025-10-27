// Enhanced Notion API Client with full API support

import { Client } from '@notionhq/client';
import type {
  QueryDatabaseParams,
  CreatePageParams,
  UpdatePageParams,
  NotionFilter,
  NotionSort,
} from './types.js';

export class EnhancedNotionClient {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  // ========== SEARCH ==========

  async search(query: string, filter?: any, sort?: any, startCursor?: string, pageSize = 100) {
    return this.client.search({
      query,
      filter,
      sort,
      start_cursor: startCursor,
      page_size: pageSize,
    });
  }

  // ========== PAGES ==========

  async getPage(pageId: string) {
    return this.client.pages.retrieve({ page_id: pageId });
  }

  async createPage(params: CreatePageParams) {
    return this.client.pages.create(params as any);
  }

  async updatePage(params: UpdatePageParams) {
    const { page_id, ...rest } = params;
    return this.client.pages.update({
      page_id,
      ...rest,
    } as any);
  }

  async deletePage(pageId: string) {
    return this.client.pages.update({
      page_id: pageId,
      archived: true,
    });
  }

  async getPageProperty(pageId: string, propertyId: string) {
    return this.client.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    });
  }

  // ========== DATABASES ==========

  async listDatabases() {
    // Note: This endpoint is deprecated but still works
    const response = await this.search('', {
      filter: { property: 'object', value: 'database' },
    });
    return response;
  }

  async getDatabase(databaseId: string) {
    return this.client.databases.retrieve({ database_id: databaseId });
  }

  /**
   * Query database with filters and sorting - THE KEY FEATURE!
   */
  async queryDatabase(params: QueryDatabaseParams) {
    const { database_id, filter, sorts, start_cursor, page_size = 100 } = params;

    return this.client.databases.query({
      database_id,
      filter: filter as any,
      sorts: sorts as any,
      start_cursor,
      page_size,
    });
  }

  async createDatabase(params: any) {
    return this.client.databases.create(params);
  }

  async updateDatabase(databaseId: string, params: any) {
    return this.client.databases.update({
      database_id: databaseId,
      ...params,
    });
  }

  // ========== BLOCKS ==========

  async getBlock(blockId: string) {
    return this.client.blocks.retrieve({ block_id: blockId });
  }

  async getBlockChildren(blockId: string, startCursor?: string, pageSize = 100) {
    return this.client.blocks.children.list({
      block_id: blockId,
      start_cursor: startCursor,
      page_size: pageSize,
    });
  }

  async appendBlocks(blockId: string, children: any[]) {
    return this.client.blocks.children.append({
      block_id: blockId,
      children,
    });
  }

  async updateBlock(blockId: string, block: any) {
    return this.client.blocks.update({
      block_id: blockId,
      ...block,
    } as any);
  }

  async deleteBlock(blockId: string) {
    return this.client.blocks.delete({ block_id: blockId });
  }

  // ========== COMMENTS ==========

  async createComment(pageId: string, richText: any[]) {
    return this.client.comments.create({
      parent: { page_id: pageId },
      rich_text: richText,
    } as any);
  }

  async getComments(blockId: string, startCursor?: string) {
    return this.client.comments.list({
      block_id: blockId,
      start_cursor: startCursor,
    });
  }

  // ========== USERS ==========

  async listUsers(startCursor?: string, pageSize = 100) {
    return this.client.users.list({
      start_cursor: startCursor,
      page_size: pageSize,
    });
  }

  async getUser(userId: string) {
    return this.client.users.retrieve({ user_id: userId });
  }

  async getBot() {
    return this.client.users.me({});
  }

  // ========== HELPER METHODS ==========

  /**
   * Extract ID from Notion URL
   */
  extractIdFromUrl(url: string): string | null {
    const regex = /([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
    const match = url.match(regex);
    return match ? match[0].replace(/-/g, '') : null;
  }

  /**
   * Format ID with dashes
   */
  formatId(id: string): string {
    const clean = id.replace(/-/g, '');
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }

  /**
   * Build simple text rich text object
   */
  buildRichText(text: string) {
    return [{ type: 'text', text: { content: text } }];
  }

  /**
   * Build property value for different types
   */
  buildProperty(type: string, value: any) {
    switch (type) {
      case 'title':
        return { title: this.buildRichText(value) };
      case 'rich_text':
        return { rich_text: this.buildRichText(value) };
      case 'number':
        return { number: value };
      case 'select':
        return { select: { name: value } };
      case 'multi_select':
        return { multi_select: Array.isArray(value) ? value.map(v => ({ name: v })) : [{ name: value }] };
      case 'date':
        return { date: typeof value === 'string' ? { start: value } : value };
      case 'people':
        return { people: Array.isArray(value) ? value.map(id => ({ id })) : [{ id: value }] };
      case 'checkbox':
        return { checkbox: value };
      case 'url':
        return { url: value };
      case 'email':
        return { email: value };
      case 'phone_number':
        return { phone_number: value };
      case 'status':
        return { status: { name: value } };
      default:
        throw new Error(`Unsupported property type: ${type}`);
    }
  }
}
