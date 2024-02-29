import { login } from "@/actions";
import { Button } from "@/components/ui/button";

export const Login = () => {
  return (
    <form action={login}>
      <div className="border-primary/40 mt-32 flex h-64 w-96 flex-col items-center justify-center rounded-xl  border-2">
        <div className="text-xl">Log in with your Yggio account</div>

        <Button className="mt-12 h-12 w-48 rounded-2xl text-lg">Log in</Button>
      </div>
    </form>
  );
};
