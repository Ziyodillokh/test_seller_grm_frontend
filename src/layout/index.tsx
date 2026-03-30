import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";

import BossHeader from "./boss-header";
import Header from "./header";

export default function Layout() {
  const { token, removeToken } = useAuthStore();
  const { meUser, removeUserMe } = useMeStore();
  const pathname = useLocation();
  const navigate = useNavigate();
  const parmitionsUser = [12, 2, 0];
  const notNeedHeaderPages = ["/re-report", "/basket/check"];

  // Draggable floating button
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPos({ x: window.innerWidth - 72, y: window.innerHeight - 160 });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      dragging: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    btnRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > 25 || Math.abs(dy) > 25) {
      dragState.current.dragging = true;
      const newX = Math.max(0, Math.min(window.innerWidth - 56, dragState.current.origX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 56, dragState.current.origY + dy));
      setPos({ x: newX, y: newY });
    }
  };

  const onPointerUp = () => {
    if (!dragState.current.dragging) {
      navigate("/chatGPT");
    }
    dragState.current.dragging = false;
  };

  useEffect(() => {
    if (!token) {
      window.location.replace(import.meta.env.BASE_URL + "login");
    } else if (pathname.pathname == "/" || pathname.pathname == import.meta.env.BASE_URL) {
      if (!meUser) {
        navigate("/");
      } else {
        if (!parmitionsUser?.includes(meUser?.position?.role)) {
          removeToken();
          removeUserMe();
          window.location.replace(import.meta.env.BASE_URL + "login");
        }
        if (meUser?.position?.role === 12) {
          navigate("/boss/home");
        } else {
          navigate("/home");
        }
      }
    }
  }, [token, meUser, pathname.pathname]);

  const hiddenRoutes = ["/chatGPT", "/voiceChat"];
  const showFloat = !hiddenRoutes.includes(location?.pathname);
  const hideHeader = hiddenRoutes.includes(location?.pathname);

  return (
    <div
      className={`${meUser?.position?.role == 12 ? "bg-[#F6F6F2]" : ""} w-full min-h-screen relative m-auto max-w-[500px]`}
    >
      {!hideHeader && (
        meUser?.position?.role === 12 ? (
          pathname.pathname != "/boss/home" ? <BossHeader /> : null
        ) : notNeedHeaderPages.includes(location?.pathname) ? null : (
          <Header />
        )
      )}

      <Outlet />

      {showFloat && pos.x >= 0 && (
        <div
          ref={btnRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer select-none touch-none"
          style={{
            left: pos.x,
            top: pos.y,
            background: "linear-gradient(135deg, #10a37f 0%, #0d8c6c 100%)",
            boxShadow: "0 4px 20px rgba(16,163,127,0.4)",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
