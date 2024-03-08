import { getSession } from "@/actions";
import Link from "next/link";
import { Logout } from "@/components/auth/logout";
import { NavMenu } from "./nav-menu";
import Image from "next/image";

export async function NavBar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const session = await getSession();

  return (
    <div
      className={` border-b-primary/30 flex h-16 items-center justify-between border-b px-4`}
      {...props}
    >
      <div className="flex flex-initial flex-row items-center gap-2 ">
        <Link
          className="flex cursor-pointer flex-row text-center"
          href="https://sensative.com"
        >
          <div className="bg-primary rounded-xl p-1">
            <Image
              priority={true}
              className=""
              src={"/sensativehd.png"}
              alt="Sensative Logo"
              width={36}
              height={36}
            />
          </div>
        </Link>
        <Link className="flex cursor-pointer flex-row text-center" href="/">
          <h3 className="text-primary items-center pl-2 text-center text-2xl ">
            app name
          </h3>
        </Link>
      </div>

      <NavMenu />

      <div>
        {session ? <Logout /> : <div className="mr-2 h-[40px] w-[174px]"></div>}
      </div>
    </div>
  );
}
