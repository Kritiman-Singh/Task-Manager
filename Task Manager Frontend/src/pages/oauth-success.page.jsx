import { refreshToken } from "@/services/auth.service";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/utils/auth";
function OAuthSuccessPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchNewToken() {
      try {
        const tokens = await refreshToken();
        console.log("New tokens:", tokens);
        setSession({
          accessToken: tokens.accessToken,
          user: tokens.user,
        });
        toast.success("Successfully authenticated!");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Error fetching new tokens:", err);
        toast.error("Failed to authenticate. Please log in again.");
        navigate("/login", { replace: true });
      }
    }

    fetchNewToken();
  }, [navigate, setSession]);

  return (
    <div>
      <h1 className="text-2xl text-center m-10">Authenticating...</h1>
    </div>
  );
}

export default OAuthSuccessPage;
