import { AuthModal } from "@/features/auth/components/auth-modal"
import { RegisterForm } from "@/features/auth/components/register-form"

export default function RegisterModal() {
  return (
    <AuthModal title="Đăng ký">
      <RegisterForm />
    </AuthModal>
  )
}
