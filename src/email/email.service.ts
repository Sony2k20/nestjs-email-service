import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { FirestoreService } from 'src/firestore/firestore.service';

export type EmailAttachment = {
  filename: string; // Name of the file (e.g., "document.pdf")
  path?: string; // Path to the file (if stored locally)
  content?: Buffer | string; // File content (Buffer for binary files, base64 string for images)
  contentType?: string; // MIME type (optional, e.g., "application/pdf")
  encoding?: string; // Encoding type (optional, e.g., "base64")
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(
    private configService: ConfigService,
    private fireStoreService: FirestoreService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(
    fromName: string,
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"${fromName}" <${this.configService.get<string>('SMTP_USER')}>`,
        to,
        subject,
        text,
        html,
      };

      this.logger.log(`Sending email to ${to} with subject "${subject}"`);
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendWorkbook(
    fromName: string,
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachments?: EmailAttachment[],
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"${fromName}" <${this.configService.get<string>('SMTP_USER')}>`,
        to,
        subject,
        text,
        html,
        attachments,
      };

      this.logger.log(`Sending workbook to ${to} with subject "${subject}"`);
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Workbook sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send workbook to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    try {
      const documentExists = await this.fireStoreService.documentExists(
        'contacts',
        to,
      );
      if (!documentExists) {
        const documentData = {
          timestamp: new Date(),
          status: 0,
        };
        await this.fireStoreService.addDocument('contacts', to, documentData);
        this.logger.log(`Add firestore document: ${to}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to add firestore document: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
