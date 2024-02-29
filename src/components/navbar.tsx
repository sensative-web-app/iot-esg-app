import { getSession } from "@/actions";
import Link from "next/link";
import { Logout } from "@/components/logout";

export async function NavBar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const session = await getSession();
  console.log(session);

  return (
    <div
      className={` border-b-primary/30 flex h-16 items-center justify-between border-b px-4`}
      {...props}
    >
      <div className="flex-initial pr-1">
        <Link className="flex cursor-pointer flex-row text-center" href="/">
          <h3 className="text-primary items-center pl-2 text-center text-2xl ">
            app name
          </h3>
        </Link>
      </div>

      <div>{session.isLoggedIn && <Logout />}</div>
    </div>
  );
}
