import { Injectable, Logger } from "@nestjs/common";
import { Cipher, createCipheriv, randomBytes, createDecipheriv, scryptSync, Decipher } from "crypto";

interface EncryptionService {
    encrypt(text: string, userSecret: string): string;
    decrypt(hash: string, userSecret: string): string;
}

const iv: Buffer = randomBytes(16);
const key = randomBytes(32);


@Injectable()
export default class EncryptionServiceImpl implements EncryptionService {

    private readonly logger: Logger = new Logger(EncryptionServiceImpl.name);

    private algorithm: string =  'aes-256-ctr';


    encrypt(text: string, userSecret: string): any {
        const cipher = createCipheriv(this.algorithm, userSecret, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        }
    }

    decrypt(hash: any, secretKey: string): string {
        const decipher = createDecipheriv(this.algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
    }
    
}