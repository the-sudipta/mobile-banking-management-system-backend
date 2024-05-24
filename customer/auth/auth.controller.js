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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const bcrypt = require("bcrypt");
const customer_dto_1 = require("../customer.dto");
const auth_guard_1 = require("./auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getIndex() {
        return 'Relax! Customer Auth is working.';
    }
    async Signup(signup_info) {
        try {
            signup_info.password = await bcrypt.hash(signup_info.password, 12);
            const user_id = await this.authService.signUp(signup_info);
            if (user_id < 0) {
                throw new common_1.BadRequestException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Email Already Exists',
                });
            }
            else {
                return user_id;
            }
        }
        catch (e) {
            throw new common_1.BadRequestException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: e.message,
            });
        }
    }
    async Login(login_info) {
        return await this.authService.signIn(login_info);
    }
    async Logout(req) {
        try {
            const token = await this.authService.extractTokenFromHeader(req);
            if (token != null && token != '') {
                return await this.authService.logout(req.user.email, token);
            }
            else {
                throw new common_1.BadRequestException('Please provide the token inside header, along with the request');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Change_password(req, new_Password_Object_DTO) {
        console.log('Request Headers:', req.headers);
        console.log('New Pass = ' + new_Password_Object_DTO.password);
        try {
            new_Password_Object_DTO.password = await bcrypt.hash(new_Password_Object_DTO.password, 12);
            const result = await this.authService.UpdatePassword(req, new_Password_Object_DTO.password);
            if (result) {
                return true;
            }
            else {
                return new common_1.InternalServerErrorException('Customer Service issue = ');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Change Password Auth Controller error = ' + e.message);
        }
        finally {
            return await this.authService.destroy_temporary_JWT(req);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('/index'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AuthController.prototype, "getIndex", null);
__decorate([
    (0, common_1.Post)('/signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Signup", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Login", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Logout", null);
__decorate([
    (0, common_1.Post)('/change_password'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.New_PasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Change_password", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/customer/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map