import { TronWeb } from 'tronweb'

export const  verifySignMessage = async (address: string, message: string, signature: string, projectId?: string) => {
    if (!address || !message || !signature) {
      throw new Error("Invalid input")
    }

    const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io"
      })

    let isVerified = false
    const hexMessage = tronWeb.toHex(message)
    let formattedSignature = signature.replace(/^0x/, "")
    const vPart = formattedSignature.substring(128, 130)

    const VALID_V_VALUES = {
        "00": "1b",
        "01": "1c"
    } as const;
    
    const VALID_SIGNATURE_SUFFIXES = ["1b", "1c"] as const;
    
    if (vPart in VALID_V_VALUES) {
        formattedSignature = formattedSignature.substring(0, 128) + VALID_V_VALUES[vPart as keyof typeof VALID_V_VALUES];
    }

    const signatureSuffix = formattedSignature.slice(-2);
    if (!VALID_SIGNATURE_SUFFIXES.includes(signatureSuffix as "1b" | "1c")) {
        console.error("Invalid signature");
        return {
            isValid: isVerified,
            message,
            signature,
        };
    }

    try {
      isVerified = await tronWeb.trx.verifyMessage(
        hexMessage.replace(/^0x/, ""),
        formattedSignature,
        address,
      )
    } catch (e) {
      if (!isVerified) {
        try {
          const hexMessageWithoutPrefix = tronWeb.toHex(message).replace(/^0x/, "")
          const byteArrayMessage = tronWeb.utils.code.hexStr2byteArray(hexMessageWithoutPrefix)
          const hashedMessage = tronWeb.sha3(byteArrayMessage as unknown as string).replace(/^0x/, "")

          isVerified = await tronWeb.trx.verifyMessage(
            hashedMessage,
            formattedSignature,
            address,
          )
        } catch (e) {
          console.error("Error while verifying message:", e)
        }
      }
    }

    return {
        isValid: isVerified,
        message: message,
        signature: signature,
    }
  }