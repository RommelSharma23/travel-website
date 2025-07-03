// types/razorpay.d.ts
// Create this file to fix the Razorpay TypeScript error

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

declare class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
  close(): void;
}

declare global {
  interface Window {
    Razorpay: typeof Razorpay;
  }
}