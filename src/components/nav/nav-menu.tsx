import Link from "next/link";

export const NavMenu = () => {
  return (
    <div className="text-primary flex w-48 flex-row justify-between">
      <Link
        className="hover:text-primary/80 duration-250 transition-colors"
        href={"/"}
      >
        home
      </Link>
      <Link
        className="hover:text-primary/80 duration-250 transition-colors"
        href={"/nodes"}
      >
        nodes
      </Link>
      <Link
        className=" hover:text-primary/80 duration-250 transition-colors"
        href={"/settings"}
      >
        settings
      </Link>
    </div>
  );
};
