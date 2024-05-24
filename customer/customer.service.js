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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./customer.entity");
const typeorm_2 = require("typeorm");
const customer_dto_1 = require("./customer.dto");
const mapper_service_1 = require("./mapper.service");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcrypt");
let CustomerService = class CustomerService {
    constructor(userRepository, customerRepository, paymentRepository, sessionRepository, otpRepository, mailerService, mapperService, jwtService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
        this.sessionRepository = sessionRepository;
        this.otpRepository = otpRepository;
        this.mailerService = mailerService;
        this.mapperService = mapperService;
        this.jwtService = jwtService;
    }
    get_service() {
        return 'CustomerService is working!';
    }
    async Create_Signup(signup_info) {
        const user = this.mapperService.dtoToEntity(signup_info, customer_entity_1.UserEntity);
        const previous_data = await this.userRepository.findOneBy({
            email: user.email,
        });
        if (previous_data === null) {
            const saved_user = await this.userRepository.save(user);
            return saved_user.id;
        }
        else {
            return -1;
        }
    }
    async Create_Customer(customer_info) {
        try {
            const customerEntity = this.mapperService.dtoToEntity(customer_info, customer_entity_1.CustomerEntity);
            const user = await this.userRepository.findOneBy({
                id: customer_info.user_id,
            });
            customerEntity.id = null;
            customerEntity.user = user;
            customerEntity.image = 'temp.svg';
            customerEntity.credit_amount = 0;
            const number_existancy = await this.customerRepository.findOneBy({
                phone: customerEntity.phone,
            });
            if (number_existancy == null) {
                const saved_customer = await this.customerRepository.save(customerEntity);
                return saved_customer ? saved_customer.id : -1;
            }
            else {
                throw new common_1.InternalServerErrorException('Phone Already exists');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Service, Create Customer Error = ' + e.message);
        }
    }
    async Find_Customer_By_Email(email) {
        const user = await this.userRepository.findOneBy({ email: email });
        const customer = await this.customerRepository.findOneBy({ user: user });
        const customer_Profile_DTO = this.mapperService.entityToDto(customer, customer_dto_1.Customer_ProfileDTO);
        customer_Profile_DTO.id = user.id;
        customer_Profile_DTO.email = user.email;
        return customer_Profile_DTO;
    }
    async Update_Own_Profile_Details(email, updated_data) {
        try {
            const previous_data = await this.Find_Customer_By_Email(email);
            const previous_user = await this.userRepository.findOneBy({
                email: email,
            });
            const previous_customer = await this.customerRepository.findOneBy({
                user: previous_user,
            });
            if (previous_data.email != updated_data.email &&
                updated_data.email != null &&
                updated_data.email != '') {
                await this.userRepository.update(previous_data.id, {
                    email: updated_data.email,
                });
            }
            if (previous_data.name != updated_data.name &&
                updated_data.name != null &&
                updated_data.name != '') {
                await this.customerRepository.update(previous_customer.id, {
                    name: updated_data.name,
                });
            }
            if (previous_data.nid != updated_data.nid &&
                updated_data.nid != null &&
                updated_data.nid != '') {
                await this.customerRepository.update(previous_customer.id, {
                    nid: updated_data.nid,
                });
            }
            if (previous_data.phone != updated_data.phone &&
                updated_data.phone != null &&
                updated_data.phone != '') {
                await this.customerRepository.update(previous_customer.id, {
                    phone: updated_data.phone,
                });
            }
            if (previous_data.image != updated_data.image &&
                updated_data.image != null &&
                updated_data.image != '') {
                await this.customerRepository.update(previous_customer.id, {
                    image: updated_data.image,
                });
            }
            return updated_data;
        }
        catch (e) {
            return new common_1.InternalServerErrorException(e.message);
        }
    }
    async Add_Credits_Amount(email, paymentDTO) {
        try {
            const amount = parseFloat(paymentDTO.amount);
            const user = await this.userRepository.findOneBy({ email: email });
            const customer = await this.customerRepository.findOneBy({ user: user });
            const final_amount = customer.credit_amount + amount;
            const payment_decision = await this.Create_Payment(email, paymentDTO);
            console.log('Payment decision = ' + payment_decision);
            await this.customerRepository.update(customer.id, {
                credit_amount: final_amount,
            });
            return 1;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Add Credit Error = ' + e.message);
        }
    }
    async Subtract_Credits_Amount(email, paymentDTO) {
        try {
            const amount = parseFloat(paymentDTO.amount);
            const user = await this.userRepository.findOneBy({ email: email });
            const customer = await this.customerRepository.findOneBy({ user: user });
            console.log('Current amount = ' + customer.credit_amount);
            if (customer.credit_amount > 0) {
                const final_amount = customer.credit_amount -
                    (amount + (await this.calculate_charge(amount)));
                const payment_decision = await this.Create_Payment(email, paymentDTO);
                console.log('Payment decision = ' + payment_decision);
                await this.customerRepository.update(customer.id, {
                    credit_amount: final_amount,
                });
                return 1;
            }
            else {
                throw new common_1.BadRequestException('Your Credit is already 0');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Subtract Credit Error = ' + e.message);
        }
    }
    async Wallet_to_Bank(email, paymentDTO) {
        try {
            const amount = parseFloat(paymentDTO.amount);
            const user = await this.userRepository.findOneBy({ email: email });
            const customer = await this.customerRepository.findOneBy({ user: user });
            console.log('Current amount = ' + customer.credit_amount);
            if (customer.credit_amount > 0) {
                const final_amount = customer.credit_amount -
                    (amount + (await this.calculate_charge(amount)));
                const payment_decision = await this.Create_Payment(email, paymentDTO);
                console.log('Payment decision = ' + payment_decision);
                await this.customerRepository.update(customer.id, {
                    credit_amount: final_amount,
                });
                return 1;
            }
            else {
                throw new common_1.BadRequestException('Your Credit is already 0');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Subtract Credit Error = ' + e.message);
        }
    }
    async Update_Profile_Picture(email, image) {
        const current_user = await this.userRepository.findOneBy({ email: email });
        const current_customer = await this.customerRepository.findOneBy({
            user: current_user,
        });
        if (current_customer) {
            (await current_customer).image = image;
            await this.customerRepository.update((await current_customer).id, {
                image: image,
            });
        }
        return await this.Find_Customer_By_Email(email);
    }
    async Get_Profile_Picture(email, res) {
        const current_user = await this.userRepository.findOneBy({ email: email });
        const current_customer = await this.customerRepository.findOneBy({
            user: current_user,
        });
        if (current_customer) {
            res.sendFile((await current_customer).image, {
                root: './assets/profile_images',
            });
        }
        else {
            throw new common_1.NotFoundException('customer data not found');
        }
    }
    async Create_Payment(email, payment) {
        try {
            const user = await this.userRepository.findOneBy({ email: email });
            const payEntity = await this.mapperService.dtoToEntity(payment, customer_entity_1.PaymentEntity);
            payEntity.user = user;
            payEntity.payment_date = await this.get_current_timestamp();
            payEntity.amount = parseFloat(payment.amount);
            const saved_data = await this.paymentRepository.save(payEntity);
            return saved_data ? saved_data.id : -1;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Service, Create Payment Error = ' + e.message);
        }
    }
    async Get_All_Billing_Payment(email) {
        const user = await this.userRepository.findOneBy({ email: email });
        return this.paymentRepository.findBy({ user: user });
    }
    async Get_All_Billing_Payments_By_Payment_Type(email, paymentType) {
        const user = await this.userRepository.findOneBy({ email: email });
        const paymentList = await this.paymentRepository.findBy({
            user: user,
            payment_type: paymentType,
        });
        console.log('Payment Cash in List:');
        paymentList.forEach((paymentList) => {
            console.log('Sender ID = ' + user.id);
            console.log('Amount = ' + paymentList.amount);
            console.log('Amount = ' + paymentList.payment_type);
            console.log('Amount = ' + paymentList.receiver_info);
        });
        return paymentList;
    }
    async Update_Password(req, password) {
        try {
            const user = await this.get_user_from_Request(req);
            console.log('Update Password header Request  user email = ' + user.email);
            const update = await this.userRepository.update(user.id, {
                password: password,
            });
            return update.affected;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Update Password customer Service error = ' + e.message);
        }
    }
    async Login(login_info) {
        try {
            const user = await this.userRepository.findOneBy({
                email: login_info.email,
            });
            if (user != null) {
                return user;
            }
            else {
                throw new common_1.NotFoundException('There is no user using this email');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async ForgetPassword(email) {
        try {
            const user = await this.userRepository.findOneBy({ email: email });
            if (user != null) {
                const OTP = await this.Generate_OTP();
                const user_has_pin = await this.otpRepository.findOneBy({ user: user });
                if (user_has_pin) {
                    console.log('Okay, Already have OTP. Needs to be updated');
                    await this.otpRepository.update(user_has_pin.id, { otp: OTP });
                    const user_has_pin_updated = await this.otpRepository.findOneBy({
                        user: user,
                    });
                    console.log('Updated OTP = ' + user_has_pin_updated.otp);
                }
                else {
                    const new_otp = new customer_entity_1.OtpEntity();
                    new_otp.id = -1;
                    new_otp.otp = OTP;
                    new_otp.user = user;
                    const saved_data = await this.otpRepository.save(new_otp);
                    console.log('New OTP = ' + saved_data.otp);
                }
                const body = (await process.env.EMAIL_BODY_P1) + OTP + process.env.EMAIL_BODY_P2;
                await this.Send_Email(email, process.env.EMAIL_SUBJECT, body);
                const new_token = await new customer_dto_1.LoginDTO();
                new_token.email = email;
                new_token.password = 'temp';
                console.log('Email Sending Done');
                return await this.create_token(new_token);
            }
            else {
                return false;
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Forget Password Service Error = ' + e.message);
        }
    }
    async otp_verification(req, otp) {
        try {
            const user = await this.get_user_from_Request(req);
            console.log('Got the user = ' + user.email);
            const saved_otp_row_for_user = await this.otpRepository.findOneBy({
                user: user,
            });
            console.log('User provided otp = ' + otp);
            console.log('Saved otp = ' + saved_otp_row_for_user.otp);
            if (saved_otp_row_for_user.otp === otp) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('OTP verification service error = ' + e.message);
        }
    }
    async navbar(email) {
        const user = await this.userRepository.findOneBy({ email: email });
        const customer = await this.customerRepository.findOneBy({ user: user });
        const navbarInfo = {
            name: customer.name,
            credit_amount: customer.credit_amount,
        };
        return navbarInfo;
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findOneBy({ email: email });
        return user !== null ? user : null;
    }
    async addToBlacklist(token, date_time, email) {
        try {
            const user = await this.userRepository.findOneBy({ email: email });
            const session = new customer_entity_1.SessionEntity();
            session.jwt_token = token;
            session.expiration_date = date_time;
            session.user = user;
            const saved_data = await this.sessionRepository.save(session);
            return saved_data.id > 0;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async get_token_by_token(token) {
        try {
            return await this.sessionRepository.findOneBy({ jwt_token: token });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async create_token(payload) {
        try {
            const payloadObject = (0, class_transformer_1.instanceToPlain)(payload);
            return {
                access_token: await this.jwtService.signAsync(payloadObject, {
                    secret: process.env.JWT_CUSTOM_SECRET,
                }),
            };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Create Token Service Error = ' + e.message);
        }
    }
    async decode_token(token) {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_CUSTOM_SECRET,
            });
            return decoded;
        }
        catch (error) {
            throw new Error('Failed to decode token');
        }
    }
    async Send_Email(emailTo, emailSubject, emailBody) {
        try {
            return await this.mailerService.sendMail({
                to: emailTo,
                subject: emailSubject,
                text: emailBody,
            });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async Generate_OTP() {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }
    extractTokenFromHeader(request) {
        try {
            const [type, token] = request.headers.authorization?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('extract Token From Header customer service error = ' + e.message);
        }
    }
    async get_user_from_Request(req) {
        try {
            const token = await this.extractTokenFromHeader(req);
            const decoded_object_login_dto = await this.decode_token(token);
            return await this.userRepository.findOneBy({
                email: decoded_object_login_dto.email,
            });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Get user from request customer service error = ' + e.message);
        }
    }
    async calculate_charge(amount) {
        try {
            return amount * 0.02;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Charge Calculation error = ' + e.message);
        }
    }
    async updateCustomer_SingleInfo(id, column, data) {
        const updateData = {};
        updateData[column] = data;
        await this.customerRepository.update(id, updateData);
    }
    async get_current_timestamp() {
        return new Date().toISOString();
    }
    async user_validity(email, password) {
        try {
            const saved_user = await this.userRepository.findOneBy({ email: email });
            if (!saved_user) {
                return false;
            }
            return await bcrypt.compare(password, saved_user.password);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Customer Service, user validity Error = ' + e.message);
        }
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.CustomerEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.PaymentEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.SessionEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_entity_1.OtpEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailer_1.MailerService,
        mapper_service_1.MapperService,
        jwt_1.JwtService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map