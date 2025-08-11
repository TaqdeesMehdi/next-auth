import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col h-full items-center justify-center bg-[url(/bg.svg)] lg:bg-contain bg-cover">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-black drop-shadow-md">
          Auth👹
        </h1>
        <p className="text-black text-lg">
          Most secured and powerful Auth service
        </p>
        <div>
          <LoginButton>
            <Button variant="reverse" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
