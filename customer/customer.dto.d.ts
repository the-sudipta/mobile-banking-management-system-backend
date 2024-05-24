export declare class CustomerDto {
    id: number;
    name: string;
    nid: string;
    phone: string;
    image: string;
    user_id: number;
}
export declare class LoginDTO {
    email: string;
    password: string;
}
export declare class Customer_ProfileDTO {
    id: number;
    name: string;
    email: string;
    nid: string;
    phone: string;
    image: string;
}
export declare class PaymentDTO {
    id: number;
    amount: string;
    payment_date: string;
    payment_to: string;
    user_id: number;
}
export declare class ForgetPasswordDTO {
    email: string;
}
export declare class OTP_ReceiverDTO {
    otp: string;
}
export declare class New_PasswordDTO {
    password: string;
}
export declare class Payment_ReceiverDTO {
    amount: string;
    payment_type: string;
    receiver_info: string;
    card_number: string;
    card_validity: string;
    card_holder_name: string;
    card_cvv: string;
    password: string;
}
export declare class NavbarDTO {
    name: string;
    credit_amount: number;
}
