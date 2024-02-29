import { logout } from "@/actions";
import { Button } from "@/components/ui/button";

export const Logout = () => {
  return (
    <form action={logout}>
      <div className="mr-2 flex h-[40px] w-[174px] justify-end">
        <Button className="rounded-xl">log out</Button>
      </div>
    </form>
  );
};
