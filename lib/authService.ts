import { apiRequest, clearAccessToken, setAccessToken, setRefreshToken } from "./api";

type AuthResult = {
  session: { access_token: string; refresh_token: string } | null;
  user: { id: string; email?: string } | null;
};

export const authService = {
  async login(email: string, password: string) {
    const result = await apiRequest<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (result.session) {
      setAccessToken(result.session.access_token);
      setRefreshToken(result.session.refresh_token);
    }
    return result;
  },
  async register(name: string, email: string, password: string) {
    const result = await apiRequest<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (result.session) {
      setAccessToken(result.session.access_token);
      setRefreshToken(result.session.refresh_token);
    }
    return result;
  },
  async loginWithGoogle(next = "/today") {
    const result = await apiRequest<{ url: string }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ next }),
    });
    window.location.assign(result.url);
  },
  forgotPassword(email: string) {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  updatePassword(password: string) {
    return apiRequest<{ user: { id: string; email?: string } | null }>("/auth/password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
  logout() {
    clearAccessToken();
  },
};
