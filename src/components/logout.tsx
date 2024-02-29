import { logout } from "@/actions";
import { Button } from "./ui/button";

export const Logout = () => {
  return (
    <form action={logout}>
      <Button className="rounded-xl">log out</Button>
    </form>
  );
};
