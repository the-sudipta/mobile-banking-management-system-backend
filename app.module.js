"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const customer_module_1 = require("./customer/customer.module");
const mailer_1 = require("@nestjs-modules/mailer");
const auth_module_1 = require("./customer/auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            customer_module_1.CustomerModule,
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                url: process.env.DATABASE_URL,
                host: process.env.PGHOST,
                port: parseInt(process.env.PGPORT, 10),
                username: process.env.PGUSER,
                password: process.env.PGPASSWORD,
                database: process.env.PGDATABASE,
                autoLoadEntities: true,
                synchronize: true,
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.MAILER_HOST,
                    port: parseInt(process.env.MAILER_PORT, 10),
                    ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: process.env.MAILER_USER,
                        pass: process.env.MAILER_PASSWORD,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map