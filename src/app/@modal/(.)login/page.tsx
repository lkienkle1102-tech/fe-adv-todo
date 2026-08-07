import { AuthModal } from "@/features/auth/components/auth-modal"
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginModal() {
  return (
    <AuthModal title="Đăng nhập">
      <LoginForm />
    </AuthModal>
  )
}
