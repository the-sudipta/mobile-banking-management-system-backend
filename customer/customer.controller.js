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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer.service");
const customer_dto_1 = require("./customer.dto");
const jwt_1 = require("@nestjs/jwt");
const auth_guard_1 = require("./auth/auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let CustomerController = class CustomerController {
    constructor(customerService, jwtService) {
        this.customerService = customerService;
        this.jwtService = jwtService;
    }
    getIndex() {
        return 'Relax! Customer is Alive.';
    }
    getService() {
        return this.customerService.get_service();
    }
    async customer_Details_Create(customer_info) {
        try {
            const saved_customer = await this.customerService.Create_Customer(customer_info);
            if (saved_customer > 0) {
                return saved_customer;
            }
            else {
                throw new common_1.InternalServerErrorException('customer data could not be saved');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.message,
            });
        }
    }
    async View_own_Profile(req) {
        try {
            return await this.customerService.Find_Customer_By_Email(req.user.email);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Update_own_Profile(req, updated_data) {
        try {
            return await this.customerService.Update_Own_Profile_Details(req.user.email, updated_data);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async UploadProfileImage(req, myfileobj) {
        console.log(myfileobj);
        if (myfileobj == null) {
            throw new common_1.BadRequestException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Please Upload Image',
            });
        }
        const seller = await this.customerService.Update_Profile_Picture(req.user.email, myfileobj.filename);
        if (seller != null) {
            return seller;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'No Seller Found to Upload Seller Image',
            });
        }
    }
    async getSellerImages(req, res) {
        try {
            return this.customerService.Get_Profile_Picture(req.user.email, res);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Create_Billing(req, bill) {
        try {
            console.log('User Email from req = ' + req.user.email);
            console.log('User Password from bill = ' + req.user.email);
            console.log('Receiver Email from bill = ' + bill.receiver_info);
            console.log('Payment amount from bill = ' + bill.amount);
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            const bill_copy = bill;
            if (user_validity_decision) {
                const receiver = await this.customerService.getUserByEmail(bill.receiver_info);
                if (receiver != null) {
                    bill.payment_type = 'Send Money';
                    const decision = await this.customerService.Subtract_Credits_Amount(req.user.email, bill);
                    bill_copy.payment_type = 'Cash in';
                    console.log('Payment Type' + bill_copy.payment_type);
                    const decision_add = await this.customerService.Add_Credits_Amount(await receiver.email, bill_copy);
                    if (decision > 0 && decision_add > 0) {
                        return {
                            success: true,
                            message: 'Money has been transferred successfully',
                        };
                    }
                    else {
                        throw new common_1.InternalServerErrorException('Payment Could not be completed');
                    }
                }
                else {
                    throw new common_1.InternalServerErrorException('Payment Could not be completed because Receiver email did not matched');
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Cash_Out(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            const bill_copy = bill;
            if (user_validity_decision) {
                const receiver = await this.customerService.getUserByEmail(bill.receiver_info);
                if (receiver != null) {
                    bill.payment_type = 'Cash Out';
                    const decision = await this.customerService.Subtract_Credits_Amount(req.user.email, bill);
                    bill_copy.payment_type = 'Cash in';
                    const decision_add = await this.customerService.Add_Credits_Amount(await receiver.email, bill_copy);
                    if (decision > 0 && decision_add > 0) {
                        return {
                            success: true,
                            message: 'Money has been transferred successfully',
                        };
                    }
                    else {
                        throw new common_1.InternalServerErrorException('Payment Could not be completed  because of Credit Subtraction or Wrong Receiver Email');
                    }
                }
                else {
                    throw new common_1.InternalServerErrorException('Payment Could not be completed because Receiver email did not matched');
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Bill_Payment(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            const bill_copy = bill;
            if (user_validity_decision) {
                const receiver = await this.customerService.getUserByEmail(bill.receiver_info);
                if (receiver != null) {
                    bill.payment_type = 'Bill Payment';
                    const decision = await this.customerService.Subtract_Credits_Amount(req.user.email, bill);
                    bill_copy.payment_type = 'Bill Received';
                    const decision_add = await this.customerService.Add_Credits_Amount(await receiver.email, bill_copy);
                    if (decision > 0 && decision_add > 0) {
                        return {
                            success: true,
                            message: 'Money has been transferred successfully',
                        };
                    }
                    else {
                        throw new common_1.InternalServerErrorException('Payment Could not be completed');
                    }
                }
                else {
                    throw new common_1.InternalServerErrorException('Payment Could not be completed because Receiver email did not matched');
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Cash_In(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            if (user_validity_decision) {
                bill.payment_type = 'Cash In';
                const decision = await this.customerService.Add_Credits_Amount(req.user.email, bill);
                if (decision > 0) {
                    return {
                        success: true,
                        message: 'Money has been transferred successfully',
                    };
                }
                else {
                    throw new common_1.InternalServerErrorException('Payment Could not be completed');
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Wallet_to_Bank(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            const bill_copy = bill;
            if (user_validity_decision) {
                const receiver = await this.customerService.getUserByEmail(bill.receiver_info);
                if (receiver != null) {
                    bill.payment_type = 'Wallet to Bank';
                    const decision = await this.customerService.Subtract_Credits_Amount(req.user.email, bill);
                    bill_copy.payment_type = 'Received From Wallet';
                    const decision_add = await this.customerService.Add_Credits_Amount(await receiver.email, bill_copy);
                    if (decision > 0 && decision_add > 0) {
                        return {
                            success: true,
                            message: 'Money has been transferred successfully',
                        };
                    }
                    else {
                        throw new common_1.InternalServerErrorException('Payment Could not be completed due to Receiver Not found or Sender Password issue');
                    }
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Wallet_to_Card(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            if (user_validity_decision) {
                bill.payment_type = 'Wallet to Card';
                const decision = await this.customerService.Subtract_Credits_Amount(req.user.email, bill);
                if (decision > 0) {
                    return {
                        success: true,
                        message: 'Money has been transferred successfully',
                    };
                }
                else {
                    throw new common_1.InternalServerErrorException('Payment Could not be completed');
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Bank_to_Wallet(req, bill) {
        try {
            const user_validity_decision = await this.customerService.user_validity(req.user.email, bill.password);
            const bill_copy = bill;
            if (user_validity_decision) {
                const receiver = await this.customerService.getUserByEmail(bill.receiver_info);
                if (receiver != null) {
                    bill.payment_type = 'Bank to Bank';
                    const decision = await this.customerService.Subtract_Credits_Amount(bill.receiver_info, bill);
                    bill_copy.payment_type = 'Bank to Wallet';
                    const decision_add = await this.customerService.Add_Credits_Amount(req.user.email, bill_copy);
                    if (decision > 0 && decision_add > 0) {
                        return {
                            success: true,
                            message: 'Money has been transferred successfully',
                        };
                    }
                    else {
                        throw new common_1.InternalServerErrorException('Payment Could not be completed');
                    }
                }
            }
            else {
                throw new common_1.BadRequestException('Password did not matched!');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Controller Create Billing Error = ' + e.message);
        }
    }
    async Get_All_Billing(req) {
        try {
            const payment_list = this.customerService.Get_All_Billing_Payment(req.user.email);
            if (payment_list != null) {
                return payment_list;
            }
            else {
                throw new common_1.NotFoundException('Data not found');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Get_All_Cash_in(req) {
        try {
            const payment_list = await this.customerService.Get_All_Billing_Payments_By_Payment_Type(req.user.email, 'Cash in');
            if (payment_list != null) {
                return payment_list;
            }
            else {
                throw new common_1.NotFoundException('Data not found');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Forget_Password(forgetPassword_DTO) {
        try {
            const decision = await this.customerService.ForgetPassword(forgetPassword_DTO.email);
            if (decision != false) {
                return decision;
            }
            else {
                throw new common_1.NotFoundException('Data not found');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async OTP_Verification(req, OTP_Object) {
        try {
            const decision = await this.customerService.otp_verification(req, OTP_Object.otp);
            if (decision) {
                console.log('Returning True');
                return {
                    success: true,
                    message: 'OTP verification successful',
                };
            }
            else {
                console.log('Returning Error');
                throw new common_1.BadRequestException('OTP did not matched!');
            }
        }
        catch (e) {
            throw e;
        }
    }
    async Navbar(req) {
        console.log('Got email = ' + req.user.email);
        try {
            const navbar_data = await this.customerService.navbar(req.user.email);
            console.log('customer_name = ' + navbar_data.name);
            console.log('customer money = ' + navbar_data.credit_amount);
            if (navbar_data.name !== null && navbar_data.credit_amount != null) {
                return navbar_data;
            }
            else {
                throw new common_1.NotFoundException('Data not found');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)('/index'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], CustomerController.prototype, "getIndex", null);
__decorate([
    (0, common_1.Get)('/customer_service'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], CustomerController.prototype, "getService", null);
__decorate([
    (0, common_1.Post)('/signup/customer_details'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CustomerDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "customer_Details_Create", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "View_own_Profile", null);
__decorate([
    (0, common_1.Put)('/profile/update'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Customer_ProfileDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Update_own_Profile", null);
__decorate([
    (0, common_1.Put)('/profile/upload'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('myfile', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                cb(null, true);
            else {
                cb(new multer_1.MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 5000000 },
        storage: (0, multer_1.diskStorage)({
            destination: './assets/profile_images',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "UploadProfileImage", null);
__decorate([
    (0, common_1.Get)('/profile/view_profile_image'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getSellerImages", null);
__decorate([
    (0, common_1.Post)('/send_money'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Create_Billing", null);
__decorate([
    (0, common_1.Post)('/cash_out'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Cash_Out", null);
__decorate([
    (0, common_1.Post)('/bill_payment'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Bill_Payment", null);
__decorate([
    (0, common_1.Post)('/cash_in'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Cash_In", null);
__decorate([
    (0, common_1.Post)('/add_money/wallet_to_bank'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Wallet_to_Bank", null);
__decorate([
    (0, common_1.Post)('/add_money/wallet_to_card'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Wallet_to_Card", null);
__decorate([
    (0, common_1.Post)('/add_money/bank_to_wallet'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.Payment_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Bank_to_Wallet", null);
__decorate([
    (0, common_1.Get)('/payment/list'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Get_All_Billing", null);
__decorate([
    (0, common_1.Get)('/payment/list/cash_in'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Get_All_Cash_in", null);
__decorate([
    (0, common_1.Post)('/forget_password'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.ForgetPasswordDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Forget_Password", null);
__decorate([
    (0, common_1.Post)('/otp'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.OTP_ReceiverDTO]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "OTP_Verification", null);
__decorate([
    (0, common_1.Get)('/navbar_info'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "Navbar", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('api/customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        jwt_1.JwtService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map