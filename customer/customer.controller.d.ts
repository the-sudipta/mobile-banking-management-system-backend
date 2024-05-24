/// <reference types="multer" />
import { CustomerService } from './customer.service';
import { ForgetPasswordDTO, OTP_ReceiverDTO, Customer_ProfileDTO, CustomerDto, Payment_ReceiverDTO } from './customer.dto';
import { JwtService } from '@nestjs/jwt';
export declare class CustomerController {
    private readonly customerService;
    private readonly jwtService;
    constructor(customerService: CustomerService, jwtService: JwtService);
    getIndex(): any;
    getService(): any;
    customer_Details_Create(customer_info: CustomerDto): Promise<any>;
    View_own_Profile(req: any): Promise<any>;
    Update_own_Profile(req: any, updated_data: Customer_ProfileDTO): Promise<any>;
    UploadProfileImage(req: any, myfileobj: Express.Multer.File): Promise<any>;
    getSellerImages(req: any, res: any): Promise<any>;
    Create_Billing(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Cash_Out(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Bill_Payment(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Cash_In(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Wallet_to_Bank(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Wallet_to_Card(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Bank_to_Wallet(req: any, bill: Payment_ReceiverDTO): Promise<any>;
    Get_All_Billing(req: any): Promise<any>;
    Get_All_Cash_in(req: any): Promise<any>;
    Forget_Password(forgetPassword_DTO: ForgetPasswordDTO): Promise<any>;
    OTP_Verification(req: any, OTP_Object: OTP_ReceiverDTO): Promise<any>;
    Navbar(req: any): Promise<any>;
}
