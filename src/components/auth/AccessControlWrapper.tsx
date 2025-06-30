"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

interface DecodedToken {
  role: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export default function AccessControlWrapper({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const role = decoded.role;

        const restrictedRoutes: Record<string, string[]> = {
          cashier: [
            "/product", "/product-varient", "/main-categories",
            "/sub-categories", "/stock", "/shop", "/business", "/employee"
          ],
          shop: ["/pos", "/business"],
        };

        const blockList = restrictedRoutes[role] || [];
        if (blockList.includes(pathname)) {
          setAllowed(false);
          router.replace("/");
        } else {
          setAllowed(true);
          setLoading(false);
        }
      } catch (e) {
        console.error("Invalid token", e);
        setAllowed(false);
        router.replace("/");
      }
    } else {
      setAllowed(false);
      router.replace("/");
    }
  }, [pathname, router]);

  if (loading || !allowed) return null;

  return <>{children}</>;
}
