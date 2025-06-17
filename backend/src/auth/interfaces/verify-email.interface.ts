export interface VerifyEmailInterface {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  fullName: string;
  emailVerifiedAt: Date | null;
}
