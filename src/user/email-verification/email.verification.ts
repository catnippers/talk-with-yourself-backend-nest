
import { generateVerificationcode } from './email.verification.util';

export type EmailverificationDocument = EmailVerification & Document;


export default class EmailVerification {
    email: string;

    verificationCode: number;


    verified: boolean;

    constructor(email: string) {
        this.email = email;
        this.verificationCode = generateVerificationcode();
        this.verified = false;
    }
}