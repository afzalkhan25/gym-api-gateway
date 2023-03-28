export class SignUpDTO {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    password: string;
    roles: USER_ROLE[];

}

export enum USER_ROLE {
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    ADMIN = 'ADMIN'
}