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
exports.OtpEntity = exports.SessionEntity = exports.PaymentEntity = exports.CustomerEntity = exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentEntity, (billing) => billing.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SessionEntity, (session) => session.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OtpEntity, (otp) => otp.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "otp", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('user')
], UserEntity);
let CustomerEntity = class CustomerEntity {
};
exports.CustomerEntity = CustomerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CustomerEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CustomerEntity.prototype, "nid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "credit_amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CustomerEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", UserEntity)
], CustomerEntity.prototype, "user", void 0);
exports.CustomerEntity = CustomerEntity = __decorate([
    (0, typeorm_1.Entity)('customer')
], CustomerEntity);
let PaymentEntity = class PaymentEntity {
};
exports.PaymentEntity = PaymentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentEntity.prototype, "payment_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentEntity.prototype, "payment_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentEntity.prototype, "receiver_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "card_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "card_validity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "card_holder_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "card_cvv", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (user) => user.payment),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", UserEntity)
], PaymentEntity.prototype, "user", void 0);
exports.PaymentEntity = PaymentEntity = __decorate([
    (0, typeorm_1.Entity)('payment')
], PaymentEntity);
let SessionEntity = class SessionEntity {
};
exports.SessionEntity = SessionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SessionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SessionEntity.prototype, "jwt_token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SessionEntity.prototype, "expiration_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (user) => user.sessions),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", UserEntity)
], SessionEntity.prototype, "user", void 0);
exports.SessionEntity = SessionEntity = __decorate([
    (0, typeorm_1.Entity)('session')
], SessionEntity);
let OtpEntity = class OtpEntity {
};
exports.OtpEntity = OtpEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OtpEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OtpEntity.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OtpEntity.prototype, "expiration_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (user) => user.otp),
    __metadata("design:type", UserEntity)
], OtpEntity.prototype, "user", void 0);
exports.OtpEntity = OtpEntity = __decorate([
    (0, typeorm_1.Entity)('otp')
], OtpEntity);
//# sourceMappingURL=customer.entity.js.map