interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  callback_url?: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    address: string;
  };
  theme?: {
    color: string;
  };
  handler: any;
}

interface RazorpayInstance {
  open(): void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
