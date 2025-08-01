"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { createContext, useContext } from "react";

interface UserContextType {
  userName: string | null;
  userRole: string | null;
  useremail: string | null;
}

interface Props {
  children: React.ReactNode;
}

interface DecodedToken {
  role: string;
  email:string
  name?: string;
  exp: number;
  iat: number;
  [key: string]: string | number | boolean | undefined;
}

const UserContext = createContext<UserContextType>({ userName: null, userRole: null, useremail: null });
export const useUser = () => useContext(UserContext);

export default function AccessControlWrapper({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [useremail, setUserEmail] = useState<string | null>(null);


  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (!token) {
      router.replace("/signin");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const role = decoded.role;
      const name = decoded.name ?? "User";
      const email = decoded.email;

      setUserRole(role);
      setUserName(name);
      setUserEmail(email);

      const restrictedRoutes: Record<string, string[]> = {
        cashier: [
          "/product", "/product-varient", "/main-categories",
          "/sub-categories", "/stock", "/shop", "/business", "/employee", "/profile"
        ],
        shop: ["/pos", "/business", "/shop", "/employee", "/profile"],
      };

      const blockList = restrictedRoutes[role] || [];

      if (blockList.includes(pathname)) {
        router.replace("/");
        return;
      }

      setAllowed(true);
    } catch (error) {
      console.error("Token decode error:", error);
      router.replace("/signin");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading || !allowed) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ userName, userRole, useremail }}>
    {children}
  </UserContext.Provider>
  );
}
