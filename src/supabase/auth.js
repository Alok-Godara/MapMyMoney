import { supabase } from "./supabaseClient";

export class AuthService {
  async createAccountService({ email, password, name }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) return { user: null, error };
      await supabase
        .from("users")
        .insert([{ id: data.user.id, name, email: data.user.email }]);
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  async loginService({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { user: null, error };
      return { user: data.user, error: null };
    } catch (error) {
      // console.error("Supabase service :: login :: error", error);
      return { user: null, error };
    }
  }

  async getCurrentUserService() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) return { user: null, error };
      return { user: data.user, error: null };
    } catch (error) {
      // console.error("Supabase service :: getCurrentUser :: error", error);
      return { user: null, error };
    }
  }

  async logoutService() {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error("Supabase service :: logout :: error", error);
    }
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: String("https://finsync-iitj.netlify.app/auth/callback"),
      },
    });
    if (error) throw error;

    return data;
  }
}

const authService = new AuthService();

export default authService;
