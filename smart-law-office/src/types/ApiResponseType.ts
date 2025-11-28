// 2. API Response Type
interface ApiResponse {
  success: boolean;
  userEmail?: string;
}

// 3. Component Props Types
interface SignUpFormProps {
  onNext: () => void;
  setUserEmail: (email: string) => void;
}

interface VerifyCodeFormProps {
  onNext: () => void;
  userEmail: string;
  onBack: () => void;
}

interface CreatingAccountProps {
  onFinish: () => void;
}

interface DotProps {
  delay: string;
}

export type {
  ApiResponse,
  SignUpFormProps,
  VerifyCodeFormProps,
  CreatingAccountProps,
  DotProps
};
