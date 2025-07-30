import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          await supabase
            .from("users")
            .upsert(
              {
                id: user.id,
                name: user.user_metadata.full_name,
                email: user.email,
              },
              { onConflict: "id" }
            );
        }

        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-64">
      <p className="text-lg text-gray-700 font-medium">Processing login...</p>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );
}