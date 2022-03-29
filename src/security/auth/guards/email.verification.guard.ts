import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from 'express';

import UserServiceImpl from "src/user/user.service";
import { EmailVerificationRequest } from "src/user/email-verification/email.verification.dto";

@Injectable()
export class EmailVerificationGuard implements CanActivate {

    constructor(private userService: UserServiceImpl) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.getArgByIndex(0);

        const verificationPayload: EmailVerificationRequest = request.body;

        return new Promise<boolean>((resolve, reject) => {
            this.userService.userExists(verificationPayload.email).then(result => {
                if(result) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }).catch(error => reject(error.message));
        })
    }
    
}