import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';
import { EmailAttachment, EmailService } from './email.service';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { join } from 'path';

class SendEmailDto {
  @ApiProperty({
    example: 'Thomas Müller',
    description: 'The display name of the email sender',
  })
  @IsEmail()
  fromName: string;

  @ApiProperty({
    example: 'recipient@example.com',
    description: 'The email address of the recipient',
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    example: 'Hello from NestJS',
    description: 'The subject of the email',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    example: 'This is a test email',
    description: 'The body content of the email',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    example: '<p>This is the <strong>HTML</strong> version of the email.</p>',
    description: 'The HTML content of the email (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  html?: string;
}

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiBody({ type: SendEmailDto })
  async sendEmail(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<{ message: string }> {
    const { fromName, to, subject, text, html } = sendEmailDto;
    await this.emailService.sendEmail(fromName, to, subject, text, html);
    return { message: 'Email sent successfully!' };
  }

  @Post('sendWorkbook')
  @ApiBody({ type: SendEmailDto })
  async sendWorkbook(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<{ message: string }> {
    const { fromName, to, subject, text, html } = sendEmailDto;
    const attachment: EmailAttachment[] = [
      {
        filename: 'workbook.pdf',
        path: join(__dirname, '..', 'assets', 'workbook.pdf'),
        contentType: 'application/pdf',
      },
    ];
    await this.emailService.sendWorkbook(
      fromName,
      to,
      subject,
      text,
      html,
      attachment,
    );
    return { message: 'Email sent successfully!' };
  }
}
