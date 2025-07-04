"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import { Warehouse, Store, Building2, ClipboardList } from "lucide-react";

interface DecodedToken {
  role: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <TableIcon />, name: "Point of Sale(POS)", path: "/pos" },
  {
    icon: <BoxCubeIcon />, name: "Product",
    subItems: [
      { name: "Product", path: "/product" },
      { name: "Product Varient", path: "/product-varient" },
    ],
  },
  {
    icon: <ListIcon />, name: "Categories",
    subItems: [
      { name: "Main Categories", path: "/main-categories" },
      { name: "Sub Categories", path: "/sub-categories" },
    ],
  },
  { icon: <Warehouse size={20} />, name: "Stock", path: "/stock" },
  { icon: <Store size={20} />, name: "Shops", path: "/shop" },
  { icon: <Building2 size={20} />, name: "Business", path: "/business" },  
  { icon: <ClipboardList size={20} />, name: "Orders", path: "/orders" },
  { icon: <UserCircleIcon />, name: "Employees", path: "/employee" },
];

const othersItems: NavItem[] = [
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Token decode failed", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let matched = false;
    ["main", "others"].forEach((type) => {
      const items = type === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        nav.subItems?.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ type: type as "main" | "others", index });
            matched = true;
          }
        });
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev?.type === type ? null : { type, index }
    );
  };

  const renderMenuItems = (items: NavItem[], type: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, type)}
              className={`menu-item group ${
                openSubmenu?.type === type && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`${
                openSubmenu?.type === type && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === type && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            <Link
              href={nav.path || "#"}
              className={`menu-item group ${
                isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span className={`${
                isActive(nav.path || "") ? "menu-item-icon-active" : "menu-item-icon-inactive"
              }`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${type}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === type && openSubmenu?.index === index
                    ? `${subMenuHeight[`${type}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading) return null;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/" className="flex items-center space-x-2">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="text-[24px] font-bold text-gray-900 dark:text-white">
              Plaza One - Jaffna
            </span>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
