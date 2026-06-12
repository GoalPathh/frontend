import { apiRequest, clearAccessToken, setAccessToken } from "./api";

type AuthResult = {
  session: { access_token: string } | null;
  user: { id: string; email?: string } | null;
};

export const authService = {
  async login(email: string, password: string) {
    const result = await apiRequest<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (result.session?.access_token) setAccessToken(result.session.access_token);
    return result;
  },
  async register(name: string, email: string, password: string) {
    const result = await apiRequest<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (result.session?.access_token) setAccessToken(result.session.access_token);
    return result;
  },
  logout() {
    clearAccessToken();
  },
};
