# TRON Wallet Connect Sign Message

A React application demonstrating message signing and verification with TRON blockchain using WalletConnect protocol.

## Features

- Connect TRON wallet using WalletConnect v2
- Sign messages with connected wallet
- Verify signed messages
- Copy wallet address and signatures
- Test mode for previewing verification states

## Getting Started

1. Clone the repository
2. Install dependencies:
```

3. Create `.env` file with required variables (see `.env.example`):
```bash
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_TEST_MODE=false
```

4. Run development server:
```bash
npm run dev
```

## Message Verification

The message verification process is implemented in `src/utils/messageHandler.ts`. It handles:
- Message formatting
- Signature validation
- TRON-specific verification logic

## Environment Variables

- `VITE_PROJECT_ID`: Your WalletConnect Project ID (get it from [WalletConnect Cloud](https://cloud.walletconnect.com/))
- `VITE_TEST_MODE`: Enable/disable test mode for previewing verification states

## Build

To build for production:
```bash
npm run build
```

## Deploy

To deploy to GitHub Pages:
```bash
npm run deploy
```

## Tech Stack

- React
- TypeScript
- Vite
- WalletConnect v2
- TRON Web
- GitHub Pages

## License

MIT