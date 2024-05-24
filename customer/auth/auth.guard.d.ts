import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenBlacklistService } from "./token_blacklist.service";
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private token_blacklistService;
    constructor(jwtService: JwtService, token_blacklistService: TokenBlacklistService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
