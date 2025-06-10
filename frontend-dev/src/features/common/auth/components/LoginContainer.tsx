import { useState } from "react";
import LoginForm from "./LoginForm";
import TwoFactorForm from "./TwoFactorForm";

export default function LoginContainer() {
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLoginSuccess = (token: string, email: string) => {
    setSessionToken(token);
    setUserEmail(email);
    setStep("2fa");
  };

  const handleBackToLogin = () => {
    setStep("login");
    setSessionToken("");
    setUserEmail("");
  };
  return (
    <>
      {step === "login" ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <TwoFactorForm
          sessionToken={sessionToken}
          userEmail={userEmail}
          onBack={handleBackToLogin}
        />
      )}
    </>
  );
}
