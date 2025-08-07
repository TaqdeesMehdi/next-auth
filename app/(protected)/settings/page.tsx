import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit" size="lg">
          Sign Out
        </Button>
      </form>
      {JSON.stringify(session)}
    </div>
  );
};

export default SettingsPage;
