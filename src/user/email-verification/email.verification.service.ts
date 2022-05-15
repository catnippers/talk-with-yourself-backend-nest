import EmailSender from "src/config/email/email.sender";
import EmailVerificationModel from "./email.verification";

import { EmailVerification  } from "@prisma/client";
import PrismaService from "src/config/prisma/prisma.service";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { EmailVerificationRecordNotFound, InvalidVerificationCodeException } from "src/exception/email.verification.exceptions";


interface EmailVerificationService {
    sendVerificationEmail(email: string): Promise<string>;
    verificationRecordExists(email: string): Promise<boolean>;
    loadVerificationRecord(email: string): Promise<EmailVerification>;
    verifyCode(email: string, code: number): Promise<EmailVerification>;
}

@Injectable()
export default class EmailVerificationServiceImpl implements EmailVerificationService {

    private logger: Logger = new Logger(EmailVerificationServiceImpl.name);

    constructor(
        private emailSender: EmailSender,
        private prisma: PrismaService
    ){}

    async verifyCode(email: string, code: number): Promise<EmailVerification> {
        const verificationRecord = await this.loadVerificationRecord(email);

        if(!verificationRecord) {
            throw new EmailVerificationRecordNotFound("Email not verified")
        }
        if ( verificationRecord.code !== code) {
            throw new InvalidVerificationCodeException("You have the wrong verification record");
        }
        
        return await this.prisma.emailVerification.update({
            where: {email: email},
            data: {
                verified: true
            }
        });
    }
    
    async loadVerificationRecord(email: string): Promise<EmailVerification> {
        return await this.prisma.emailVerification.findUnique({
            where: {email: email},
        });
    }

    async verificationRecordExists(email: string): Promise<boolean> {
        return await this.loadVerificationRecord(email) ? true : false;
    }

    async sendVerificationEmail(email: string): Promise<string> {
        const emailVerification = new EmailVerificationModel(email);
        let regeneration = false;


        if (await this.verificationRecordExists(email)) {
            regeneration = true;
            await this.prisma.emailVerification.update({
                where: {email: email},
                data: {
                    code: emailVerification.verificationCode,
                    generatedAt: new Date()
                }
            });
        }

        try {
            if(regeneration) {
                this.logger.log(`email verification code generated for {email: ${email}}`)
            }

            await this.emailSender.sendEmail(
                email,
                'Talk With Yourself Email Verification',
                emailVerification.verificationCode.toString()
            );

            await this.prisma.emailVerification.create({
                data:{
                    email: email,
                    code: emailVerification.verificationCode
                }
            })

            return emailVerification.email;
        }
        catch {
            this.logger.error(
                `Email Verification mail not sent for email: ${email}`
            );
            await this.prisma.emailVerification.delete({
                where: {email: email}
            }).catch(error => this.logger.error(
                `Email verification clean up failed for email`,
                email
            ));
            throw new HttpException("Email sending failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}