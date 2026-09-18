import React, { useState, useEffect } from "react";

/**
 * HeaderAuthWidget manages authentication state locally within component state,
 * reading directly from localStorage and bypassing the global AuthContext provider.
 */
export const HeaderAuthWidget: React.FC = () => {
  const [localUser, setLocalUser] = useState<{ email: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Directly inspects and manages auth state locally without consuming global AuthContext
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setLocalUser(JSON.parse(raw));
        setIsLoggedIn(true);
      } catch {
        setLocalUser(null);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLocalLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocalUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <button onClick={() => { window.location.href = "/login"; }}>Sign In</button>;
  }

  return (
    <div className="header-auth-widget">
      <span>{localUser?.email}</span>
      <button onClick={handleLocalLogout}>Disconnect</button>
    </div>
  );
};
