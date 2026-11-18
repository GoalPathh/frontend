import { AuthShell } from "@/components/auth/auth-shell";
import { LoginPreview } from "@/components/auth/login-preview";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell aside={<LoginPreview />}>
      <LoginForm />
    </AuthShell>
  );
}
