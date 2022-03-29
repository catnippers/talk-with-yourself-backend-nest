import { Injectable, Logger } from "@nestjs/common";
import { Cipher, createCipheriv, randomBytes, createDecipheriv, scryptSync, Decipher } from "crypto";

interface EncryptionService {
    encrypt(text: string, userSecret: string): string;
    decrypt(hash: string, userSecret: string): string;
}

const iv: Buffer = randomBytes(16);


@Injectable()
export default class EncryptionServiceImpl implements EncryptionService {

    private readonly logger: Logger = new Logger(EncryptionServiceImpl.name);

    private algorithm: string =  process.env.encryptionAlgorithm;


    encrypt(text: string, userSecret: string): string {
        console.log(iv);
        const cipher = createCipheriv('aes-256-cbc', userSecret, iv);
        return cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
    }

    decrypt(hash: string, secretKey: string): string {
        const decipher = createDecipheriv('aes-256-cbc', secretKey , iv);
        return decipher.update(hash, 'base64', 'utf-8') + decipher.final('utf-8');
    }
    
}