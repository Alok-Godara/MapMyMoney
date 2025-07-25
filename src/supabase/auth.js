import { supabase } from "./supabaseClient";

export class AuthService {

  async createAccount({ email, password, name }) {
    try {
      const { user, error } = await supabase.auth.signUp({ email, password, data: { name } });
      if (error) throw error;
      return user;
    } catch (error) {
      console.log("Supabase service :: createAccount :: error", error);
    }
    
  }

  async login({ email, password }) {
    try {
      const { user, error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Supabase service :: login :: error", error);
    }
  }

  async getCurrentUser() {
    try {
      const { user, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Supabase service :: getCurrentUser :: error", error);
    }

    return null;
  }

  async logout() {
    try {
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error("Supabase service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
