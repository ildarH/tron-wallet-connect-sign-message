import { VerificationDetails } from '../types';
import { CopyButton } from './CopyButton';

type VerificationResultProps = {
  result: VerificationDetails;
}

export const VerificationResult = ({ result }: VerificationResultProps) => {
  if (result.status === 'idle') return null;

  return (
    <div className={`verification-result ${result.status}`}>
      <div className="verification-status">
        <span className={`status ${result.status}`}>
          {result.status === 'success' ? 'Verification Successful' : 'Verification Failed'}
        </span>
      </div>
      <div className="verification-message">
        {result.message}
      </div>
      <div className="verification-details">
        <div className="detail-item">
          <span>{result.status === 'success' ? 'Signed Message:' : 'Failed Message:'}</span>
          <div className="code-container">
            <code>{result.signedMessage || 'Message signing failed'}</code>
            <CopyButton text={result.signedMessage || ''} />
          </div>
        </div>
        {result.signature && (
          <div className="detail-item">
            <span>Signature:</span>
            <div className="code-container">
              <code>{result.signature}</code>
              <CopyButton text={result.signature} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 