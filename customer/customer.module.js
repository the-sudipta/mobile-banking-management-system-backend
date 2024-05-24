"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const customer_controller_1 = require("./customer.controller");
const customer_service_1 = require("./customer.service");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./customer.entity");
const mapper_service_1 = require("./mapper.service");
const jwt_1 = require("@nestjs/jwt");
const token_blacklist_service_1 = require("./auth/token_blacklist.service");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                customer_entity_1.UserEntity,
                customer_entity_1.CustomerEntity,
                customer_entity_1.PaymentEntity,
                customer_entity_1.SessionEntity,
                customer_entity_1.OtpEntity,
            ]),
            jwt_1.JwtModule.register({
                global: true,
                secret: 'mySecretKey123!@#',
                signOptions: { expiresIn: '30m' },
            }),
        ],
        controllers: [customer_controller_1.CustomerController],
        providers: [
            customer_service_1.CustomerService,
            mapper_service_1.MapperService,
            jwt_1.JwtService,
            token_blacklist_service_1.TokenBlacklistService,
        ],
        exports: [customer_service_1.CustomerService],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map