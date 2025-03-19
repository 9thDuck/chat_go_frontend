export type PaginatedResponse<T> = {
    data: {
        records: T[];
        total_records: number;
    }
}
