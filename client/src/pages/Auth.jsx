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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { BASE_URL } from "@/utils/url";
import { userLoggedIn } from "@/store/user";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("signup");

  const [loginInput, setLoginInput] = useState({
    username: "",
    password: "",
  });

  const [signupInput, setSignUpInput] = useState({
    username: "",
    password: "",
    role: "Employee", 
  });

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignUpInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const HandleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const endpoint = type === "signup" ? "sign-in" : "login";

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/${endpoint}`, inputData, {
        withCredentials: true,
      });
      setLoading(false);

      if (res.data.success) {
        toast.success(res.data.message);
        if (type === "signup") {
          setLoginInput({
            username: inputData.username,
            password: inputData.password,
          });
          setSignUpInput({
            username: "",
            password: "",
            role: "Employee",
          });
          setTabValue("login");
        } else {
          dispatch(userLoggedIn(res.data.user));
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        className="sm:w-[350px] md:w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">SignUp</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* SIGNUP */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">SignUp</CardTitle>
              <CardDescription className="text-center">
                Create an account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="john_doe"
                  value={signupInput.username}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <select
                  name="role"
                  id="role"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={signupInput.role}
                  onChange={(e) => changeInputHandler(e, "signup")}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => HandleRegistration("signup")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* LOGIN */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="john_doe"
                  value={loginInput.username}
                  onChange={(e) => changeInputHandler(e, "login")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => HandleRegistration("login")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
