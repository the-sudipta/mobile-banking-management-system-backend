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
exports.NavbarDTO = exports.Payment_ReceiverDTO = exports.New_PasswordDTO = exports.OTP_ReceiverDTO = exports.ForgetPasswordDTO = exports.PaymentDTO = exports.Customer_ProfileDTO = exports.LoginDTO = exports.CustomerDto = void 0;
const class_validator_1 = require("class-validator");
class CustomerDto {
}
exports.CustomerDto = CustomerDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Id cannot be empty or null' }),
    __metadata("design:type", Number)
], CustomerDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name cannot be empty or null' }),
    (0, class_validator_1.IsString)({ message: 'Name should be a string' }),
    (0, class_validator_1.MinLength)(3, { message: 'Name should be at least 3 characters long' }),
    (0, class_validator_1.MaxLength)(50, {
        message: 'Name should not be more than 50 characters long',
    }),
    __metadata("design:type", String)
], CustomerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'NID cannot be empty or null' }),
    __metadata("design:type", String)
], CustomerDto.prototype, "nid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number cannot be empty or null' }),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Profile Image Name should be a string' }),
    __metadata("design:type", String)
], CustomerDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'User id cannot be empty or null' }),
    __metadata("design:type", Number)
], CustomerDto.prototype, "user_id", void 0);
class LoginDTO {
}
exports.LoginDTO = LoginDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email cannot be empty or null' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'Email should not be more than 100 characters long',
    }),
    __metadata("design:type", String)
], LoginDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty or null' }),
    (0, class_validator_1.IsString)({ message: 'Password should be a string' }),
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/, {
        message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    }),
    __metadata("design:type", String)
], LoginDTO.prototype, "password", void 0);
class Customer_ProfileDTO {
}
exports.Customer_ProfileDTO = Customer_ProfileDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Id cannot be empty or null' }),
    __metadata("design:type", Number)
], Customer_ProfileDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name cannot be empty or null' }),
    (0, class_validator_1.IsString)({ message: 'Name should be a string' }),
    __metadata("design:type", String)
], Customer_ProfileDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email cannot be empty or null' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], Customer_ProfileDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Gender cannot be empty or null' }),
    __metadata("design:type", String)
], Customer_ProfileDTO.prototype, "nid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number cannot be empty or null' }),
    __metadata("design:type", String)
], Customer_ProfileDTO.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Profile Image Name should be a string' }),
    __metadata("design:type", String)
], Customer_ProfileDTO.prototype, "image", void 0);
class PaymentDTO {
}
exports.PaymentDTO = PaymentDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'ID cannot be empty or null' }),
    __metadata("design:type", Number)
], PaymentDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment Amount cannot be empty or null' }),
    __metadata("design:type", String)
], PaymentDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment Date cannot be empty or null' }),
    __metadata("design:type", String)
], PaymentDTO.prototype, "payment_date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment To cannot be empty or null' }),
    __metadata("design:type", String)
], PaymentDTO.prototype, "payment_to", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'user id cannot be empty or null' }),
    __metadata("design:type", Number)
], PaymentDTO.prototype, "user_id", void 0);
class ForgetPasswordDTO {
}
exports.ForgetPasswordDTO = ForgetPasswordDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email cannot be empty or null' }),
    __metadata("design:type", String)
], ForgetPasswordDTO.prototype, "email", void 0);
class OTP_ReceiverDTO {
}
exports.OTP_ReceiverDTO = OTP_ReceiverDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'OTP cannot be empty or null' }),
    __metadata("design:type", String)
], OTP_ReceiverDTO.prototype, "otp", void 0);
class New_PasswordDTO {
}
exports.New_PasswordDTO = New_PasswordDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty or null' }),
    (0, class_validator_1.IsString)({ message: 'Password should be a string' }),
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/, {
        message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    }),
    __metadata("design:type", String)
], New_PasswordDTO.prototype, "password", void 0);
class Payment_ReceiverDTO {
}
exports.Payment_ReceiverDTO = Payment_ReceiverDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Amount cannot be empty or null' }),
    __metadata("design:type", String)
], Payment_ReceiverDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Payment Type cannot be empty or null' }),
    __metadata("design:type", String)
], Payment_ReceiverDTO.prototype, "payment_type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Receiver Email cannot be empty or null' }),
    __metadata("design:type", String)
], Payment_ReceiverDTO.prototype, "receiver_info", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty or null' }),
    (0, class_validator_1.IsString)({ message: 'Password should be a string' }),
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/, {
        message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character, and is at least 8 characters long.',
    }),
    __metadata("design:type", String)
], Payment_ReceiverDTO.prototype, "password", void 0);
class NavbarDTO {
}
exports.NavbarDTO = NavbarDTO;
//# sourceMappingURL=customer.dto.js.map