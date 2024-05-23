export interface HexaToken {
    token:string;
    refreshToken:string;
}

export interface TokenPayload {
    Id:string;
    aud:string;
    exp:number;
    iat:number;
    iss:string;
    jti:string;
    nbf:number;
    role:string;
    sub:string;
    ContactId:string;
    DisplayImage: string;
    CustomRole: string;
    AdminProductType: number[] | undefined;
}

export interface SubContact {
    doctors:DoctorToken[];
    clinics:ClinicToken[];
}

export interface DoctorToken{
    doctorId: number;
    name: string;
}

export interface ClinicToken{
    clinicId: number;
    name: string;
}
