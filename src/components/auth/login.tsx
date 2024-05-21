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
import { login } from "@/actions";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    let result = await login(username, password);
    if (result?.error) {
      setIsLoading(false);
      setErrorMessage(result.error);
    }
    else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card className="w-full mt-24 max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl">
          Login with your Yggio account
        </CardTitle>
        <CardDescription className="text-red-400">
          {errorMessage ? errorMessage : <>&nbsp;</>}
        </CardDescription>
      </CardHeader>
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
        <Button data-testid="login-button" className="w-full" onClick={handleClick}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
