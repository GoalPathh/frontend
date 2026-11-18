import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterPreview } from "@/components/auth/register-preview";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell aside={<RegisterPreview />} reverse>
      <RegisterForm />
    </AuthShell>
  );
}
