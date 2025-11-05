export interface Drop {
    id: string;
    name: string;
    stock: number;
    tags: string[];
    mediaUrls: string[];
    createdAt: string;
    claimWindowStart: string;
    claimWindowEnd: string;
}