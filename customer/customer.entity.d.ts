export declare class UserEntity {
    id: number;
    email: string;
    password: string;
    role: string;
    payment: PaymentEntity[];
    sessions: SessionEntity[];
    otp: OtpEntity[];
}
export declare class CustomerEntity {
    id: number;
    name: string;
    nid: string;
    phone: string;
    credit_amount: number;
    image: string;
    user: UserEntity;
}
export declare class PaymentEntity {
    id: number;
    amount: number;
    payment_date: string;
    payment_type: string;
    receiver_info: string;
    card_number: string;
    card_validity: string;
    card_holder_name: string;
    card_cvv: string;
    user: UserEntity;
}
export declare class SessionEntity {
    id: number;
    jwt_token: string;
    expiration_date: string;
    user: UserEntity;
}
export declare class OtpEntity {
    id: number;
    otp: string;
    expiration_date: string;
    user: UserEntity;
}
