"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finishing your login...");

  useEffect(() => {
    const finishLogin = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setMessage(error.message);
            return;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setMessage("Login could not be completed. Please return to login.");
          return;
        }

        router.replace("/app");
        router.refresh();
      } catch {
        setMessage("Something went wrong while completing login.");
      }
    };

    void finishLogin();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <p>{message}</p>
    </main>
  );
}