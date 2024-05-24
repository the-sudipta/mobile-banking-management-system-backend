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
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("../customer.service");
let TokenBlacklistService = class TokenBlacklistService {
    constructor(patientService) {
        this.patientService = patientService;
        this.blacklistedTokens = new Set();
    }
    async addToBlacklist(email, token) {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString();
            const decision = await this.patientService.addToBlacklist(token, dateString, email);
            if (decision) {
                return { success: true };
            }
            else {
                return { success: false };
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async isTokenBlacklisted(token) {
        const data = await this.patientService.get_token_by_token(token);
        return !!data;
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], TokenBlacklistService);
//# sourceMappingURL=token_blacklist.service.js.map