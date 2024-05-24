import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer.service';
import { LoginDTO } from '../customer.dto';
import { Request } from 'express';
import { TokenBlacklistService } from './token_blacklist.service';
export declare class AuthService {
    private customerService;
    private jwtService;
    private tokenBlacklistService;
    constructor(customerService: CustomerService, jwtService: JwtService, tokenBlacklistService: TokenBlacklistService);
    signUp(myobj: LoginDTO): Promise<any>;
    signIn(logindata: LoginDTO): Promise<{
        access_token: string;
    }>;
    logout(email: string, token: string): Promise<any>;
    UpdatePassword(req: Request, password: string): Promise<any>;
    extractTokenFromHeader(request: Request): string | undefined;
    destroy_temporary_JWT(req: Request): Promise<any>;
}
