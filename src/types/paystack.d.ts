interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  channels?: string[];
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

interface PaystackHandler {
  openIframe(): void;
}

interface PaystackPop {
  setup(options: PaystackOptions): PaystackHandler;
}

interface Window {
  PaystackPop: PaystackPop;
}
