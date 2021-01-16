export interface Credentials {
    email: string;
    password: string;
}

export interface CredentialRegister {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CredentialReset {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface TokenPayload {
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    ufn: string;
    sub: string;
    rid: number;
    user_id: number;
    email: string;
    type: number;
}
