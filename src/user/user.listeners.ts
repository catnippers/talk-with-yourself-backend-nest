import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "@prisma/client";

import EmailSender from "src/config/email/email.sender";

@Injectable()
export default class UserListeners {
  private logger: Logger = new Logger(UserListeners.name);

  constructor(private emailSender: EmailSender) {}

  @OnEvent('user.registered')
  async handleUserRegistered(payload: User) {
    const { email, verification_code } = payload
    await this.emailSender.sendEmail(
      email,
      'TWY Email Verification',
      verification_code
    );
    this.logger.log(`Sent verification email for user ${payload.email}`);
  }
}