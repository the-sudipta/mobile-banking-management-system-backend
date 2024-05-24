import { CustomerService } from '../customer.service';
export declare class TokenBlacklistService {
    private patientService;
    private blacklistedTokens;
    constructor(patientService: CustomerService);
    addToBlacklist(email: string, token: string): Promise<any>;
    isTokenBlacklisted(token: string): Promise<boolean>;
}
