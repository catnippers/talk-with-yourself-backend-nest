import { Injectable, Logger } from "@nestjs/common";
import { User, Prisma } from "@prisma/client"
import EmailSender from "src/config/email/email.sender";

import PrismaService from "src/config/prisma/prisma.service";
import { UnverifiedEmailException } from "src/exception/email.verification.exceptions";
import { SignUpRequest } from "src/security/auth/auth.dto";
import SecurityUtil from "src/security/security.util";
import EmailVerification from "./email-verification/email.verification";
import EmailVerificationService from "./email-verification/email.verification.service";

interface UserService {
    findUserByEmail(email: string): Promise<User>;
    findUserById(id: number): Promise<User>;
    signUpUser(signUpRequest: SignUpRequest): Promise<User>;
    userExists(email: string): Promise<boolean>;
}

@Injectable()
export default class UserServiceImpl implements UserService {

    private logger: Logger = new Logger();

    constructor(
        private prisma: PrismaService,
        private securityUtil: SecurityUtil,
    ) {}

    async userExists(email: string): Promise<boolean> {
        return await this.findUserByEmail(email) ? true : false;
    }

    async signUpUser(signUpRequest: SignUpRequest): Promise<User> {
        const { email, password, firstName, lastName } = signUpRequest;

        // await this.prisma.emailVerification.delete({
        //     where: {
        //         email: email
        //     }
        // });
        return await this.prisma.user.create({
            data: {
                email: email,
                password: await this.securityUtil.passwordEncoder().encode(password),
                first_name: firstName,
                last_name: lastName,
                refresh_token_id: null
            }
        });
    }

    async findUserById(id: number): Promise<User> {
        return await this.prisma.user.findUnique({
            where: {
                id: id
            },
        });
    }

    async findUserByEmail(email: string): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {email: email},
        });
    }
}