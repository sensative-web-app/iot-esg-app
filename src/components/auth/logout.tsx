import { logout } from "@/actions";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export const Logout = () => {
  revalidatePath("/")
  revalidatePath("")
  return (
    <form action={logout} className="">
      <div className=" flex h-[40px] p-2 pt-0">
        <Button className="rounded-xl text-base w-full">log out</Button>
      </div>
    </form>
  );
};
