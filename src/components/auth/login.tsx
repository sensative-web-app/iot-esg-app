// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getIronSession } from "iron-session";
// import { SessionData, sessionOptions } from "@/lib/session";
// import { cookies } from "next/headers";
// import { getRole } from "@/actions";
// import { useRouter } from "next/navigation";

// export const Login = async () => {
//   const router = useRouter();

//   const login = async (formData: FormData) => {
//     const username = formData.get("username") as string;
//     const password = formData.get("password") as string;

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/auth/local`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ username, password }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Invalid credentials");
//       }

//       const data = await response.json();
//       console.log("data efter login", data);

//       const session = await getIronSession<SessionData>(
//         cookies(),
//         sessionOptions,
//       );

//       const { token } = data;

//       session.accessToken = token;

//       const role = await getRole(token);

//       if (role) session.role = role;

//       await session.save();

//       router.refresh();
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <form action={login} className="w-full flex justify-center">
//       <div className="border-primary/40 flex h-auto w-96 flex-col items-center justify-center rounded-xl border-2 p-8">
//         <div className="text-xl mb-8">Log in with your Yggio account</div>
//         <div className="w-full mb-4">
//           <Label htmlFor="username">Username</Label>
//           <Input
//             type="text"
//             id="username"
//             name="username"
//             required
//             className="w-full"
//           />
//         </div>
//         <div className="w-full mb-8">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             type="password"
//             id="password"
//             name="password"
//             required
//             className="w-full"
//           />
//         </div>
//         <Button type="submit" className="mt-4 h-12 w-48 rounded-2xl text-lg">
//           Log in
//         </Button>
//       </div>
//     </form>
//   );
// };

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.status === 200) {
      router.refresh();
    } else {
      setErrorMessage(data.error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">
          Login with your Yggio account
        </CardTitle>
        <CardDescription className="text-red-400">
          {errorMessage ? errorMessage : <>&nbsp;</>}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
