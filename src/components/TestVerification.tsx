import { VerificationResult } from './VerificationResult';

type TestVerificationProps = {
  messageInput: string;
}

export const TestVerification = ({ messageInput }: TestVerificationProps) => {
  const successExample = {
    status: 'success' as const,
    message: "Message was successfully signed and verified",
    signature: "0x8b7934e589b21d142d2deb8fa63c83fb8f336dc9d5cbe5dfe28a84e015cd5c00486003f5edac1d448b7934e589b21d142d2deb8fa63c83fb8f336dc9d5cbe5dfe",
    signedMessage: messageInput
  };

  const errorExample = {
    status: 'error' as const,
    message: "Invalid signature for the provided message",
    signature: "0x9c7934e589b21d142d2deb8fa63c83fb8f336dc9d5cbe5dfe28a84e015cd5c00486003f5edac1d448b7934e589b21d142d2deb8fa63c83fb8f336dc9d5cbe5daa",
    signedMessage: messageInput
  };

  return (
    <div className="test-results">
      <p className="test-label">Test Results Preview:</p>
      <VerificationResult result={successExample} />
      <VerificationResult result={errorExample} />
    </div>
  );
}; 