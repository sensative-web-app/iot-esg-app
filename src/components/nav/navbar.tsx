import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/sensativehd.png";

export async function NavBar() {
  return (
    <div
      className={`w-full  border-b-shadow flex h-16 items-center justify-between border-b px-4`}
      data-cy="navbar"
    >
      <div className="flex flex-initial flex-row items-center gap-2 ">
        <div className="rounded-xl bg-primary p-1">
          <Link
            className="flex cursor-pointer flex-row text-center"
            href="https://sensative.com"
          >
            <Image
              className=""
              src={Logo}
              alt="Sensative Logo"
              width={36}
              height={36}
            />
          </Link>
        </div>

        <Link className="flex cursor-pointer flex-row text-center" href="/">
          <h3 className="items-center pl-2 text-center text-2xl text-primary ">
            IoT ESG app
          </h3>
        </Link>
      </div>
    </div>
  );
}
