import { Login } from "@/components/auth/login";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function Page() {
  return (
    <div className="flex w-full h-full justify-center items-center text-primary">
      <Login />
    </div>
  );
}
