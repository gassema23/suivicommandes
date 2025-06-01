import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsStrongPassword()
  confirmPassword: string;
}
