import { AuthService } from './auth.service';
import { LoginDTO, New_PasswordDTO } from '../customer.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getIndex(): any;
    Signup(signup_info: LoginDTO): Promise<any>;
    Login(login_info: LoginDTO): Promise<any>;
    Logout(req: any): Promise<any>;
    Change_password(req: any, new_Password_Object_DTO: New_PasswordDTO): Promise<any>;
}
