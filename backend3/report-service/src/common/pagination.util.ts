import { PaginationParams, PaginatedResponse } from './types';

export class PaginationUtil {
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static createPaginatedResponse<T>(
    data: T[], 
    total: number, 
    params: PaginationParams
  ): PaginatedResponse<T> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  static getSkipTake(params: PaginationParams): { skip: number; take: number } {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    
    return { skip, take: limit };
  }
}