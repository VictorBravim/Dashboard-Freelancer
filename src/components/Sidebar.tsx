'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiOutlineDashboard,
  AiOutlineLogout,
} from "react-icons/ai";
import { LuFolderTree } from "react-icons/lu";
import { LuChartColumn } from "react-icons/lu";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Sidebar() {
  const currentPath = usePathname();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.photoURL) {
          setUserPhoto(user.photoURL);
        } else {
          setUserPhoto('/LogoBank.png'); 
        }
      } else {
        setUserPhoto(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <AiOutlineDashboard /> },
    { label: "Metas", path: "/metas", icon: <LuChartColumn /> },
    { label: "Projetos", path: "/projetos", icon: <LuFolderTree /> },
  ];

  const handleLogout = () => {
    console.log("Logout realizado!"); 
  };

  return (
    <div className="w-40 h-100% bg-[#081E33] text-white rounded-lg shadow-lg m-4 flex flex-col justify-between">

      <div className="flex items-center justify-center py-5 border-b border-[#3E5063]">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt="Foto de perfil"
            className="w-16 h-16"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-400 border-2 border-[#3E5063]" />
        )}
      </div>

      <nav className="flex-1 px-2 py-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 text-base font-medium py-3 px-3 rounded-lg transition-all duration-300
                  ${
                    currentPath === item.path
                      ? "bg-[#3E5063] shadow-md"
                      : "hover:bg-[#3E5063] hover:shadow-sm"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-[#3E5063]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-base font-medium py-3 px-4 rounded-lg bg-[#3E5063] hover:bg-[#081E33] transition duration-300"
        >
          <AiOutlineLogout className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}