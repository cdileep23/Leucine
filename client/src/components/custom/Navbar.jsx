import { Menu, LogOutIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "../ui/button";
import { BASE_URL } from "@/utils/url";
import { userLoggedOut } from "@/store/user";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleLogout = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(userLoggedOut());
      navigate("/auth");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="h-16 p-4 bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50 w-full flex justify-center">
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 sm:pl-4 md:pl-8">
          <h1 className="font-extrabold text-xl md:text-2xl">Leucine</h1>
        </Link>

        <div className="hidden md:flex items-center gap-8 pr-8">
          {user?.username && (
            <UserMenu HandleLogout={HandleLogout} user={user} />
          )}
        </div>

        <div className="flex md:hidden items-center gap-2 pr-4">
          <MobileMenu user={user} HandleLogout={HandleLogout} />
        </div>
      </div>
    </div>
  );
};

const UserMenu = ({ HandleLogout, user }) => {
  const [open, setOpen] = useState(false);

  const handleDropdownItemClick = (callback) => {
    setOpen(false);
    if (callback) callback();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`}
              alt={user?.username}
            />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="font-medium text-sm">{user?.username}</p>
            <Badge variant="outline" className="text-xs">
              Role: {user?.role}
            </Badge>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
       
        <DropdownMenuSeparator />
        <Link to="/my-conversions" onClick={() => setOpen(false)}>
          <DropdownMenuItem>My Conversions</DropdownMenuItem>
        </Link>
        <Link to="/profile" onClick={() => setOpen(false)}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => handleDropdownItemClick(HandleLogout)}
          className="flex items-center text-red-600"
        >
          <LogOutIcon size={14} className="mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const MobileMenu = ({ user, HandleLogout }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" className="rounded-full" variant="outline">
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="bg-gray-50 border-l">
      <SheetHeader className="mb-2">
        <SheetTitle>Leucine </SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-6 mx-10">
        {user?.username && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`}
                  alt={user?.username}
                />
                <AvatarFallback>
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{user?.username}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Role: {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/my-conversions"
                className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                My Conversions
              </Link>
              <Link
                to="/profile"
                className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={HandleLogout}
                className="text-left py-2 px-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-red-500"
              >
                <LogOutIcon size={14} />
                Log Out
              </button>
            </nav>
          </div>
        )}
      </div>
      <SheetFooter className="mt-auto">
        <SheetClose asChild>
          <Button variant="outline" className="w-full">
            Close Menu
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export default Navbar;
