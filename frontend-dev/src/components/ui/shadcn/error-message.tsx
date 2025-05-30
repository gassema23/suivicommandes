interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

const ErrorMessage = ({ message, className = "" }: ErrorMessageProps) => {
  if (!message) return null;

  return <p className={`text-destructive text-sm ${className}`}>{message}</p>;
};

export default ErrorMessage;
