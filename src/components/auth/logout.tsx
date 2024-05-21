import { logout } from "@/actions";
import { Button } from "@/components/ui/button";

export const Logout = () => {
  return (
    <form action={logout} className="">
      <div className=" flex h-[40px] p-2 pt-0">
        <Button className="rounded-xl text-base w-full">log out</Button>
      </div>
    </form>
  );
};
