export type VerificationDetails = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  signature?: string;
  signedMessage?: string | null;
} 