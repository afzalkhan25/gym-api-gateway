export class SignUpDTO {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    password: string;
    role: USER_ROLE

}

export enum USER_ROLE {
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    ADMIN = 'ADMIN'
}