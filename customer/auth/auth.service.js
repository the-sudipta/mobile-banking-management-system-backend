"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const customer_service_1 = require("../customer.service");
const token_blacklist_service_1 = require("./token_blacklist.service");
let AuthService = class AuthService {
    constructor(customerService, jwtService, tokenBlacklistService) {
        this.customerService = customerService;
        this.jwtService = jwtService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async signUp(myobj) {
        return await this.customerService.Create_Signup(myobj);
    }
    async signIn(logindata) {
        const user = await this.customerService.Login(logindata);
        if (!user) {
            throw new common_1.UnauthorizedException('Email is incorrect');
        }
        if (!(await bcrypt.compare(logindata.password, user.password))) {
            throw new common_1.UnauthorizedException('Password is incorrect');
        }
        const payload = logindata;
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async logout(email, token) {
        try {
            const decision = await this.tokenBlacklistService.addToBlacklist(email, token);
            if (decision != null) {
                return decision;
            }
            else {
                throw new common_1.InternalServerErrorException('Problem in Token Blacklist Service');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async UpdatePassword(req, password) {
        try {
            const decision = await this.customerService.Update_Password(req, password);
            if (decision !== null) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Update Password Auth Service error = ' + e.message);
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    async destroy_temporary_JWT(req) {
        try {
            const token = await this.extractTokenFromHeader(req);
            const user = await this.customerService.get_user_from_Request(req);
            const decision = await this.tokenBlacklistService.addToBlacklist(user.email, token);
            if (decision != null) {
                return decision;
            }
            else {
                throw new common_1.InternalServerErrorException('Problem in Token Blacklist Service');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        jwt_1.JwtService,
        token_blacklist_service_1.TokenBlacklistService])
], AuthService);
//# sourceMappingURL=auth.service.js.map