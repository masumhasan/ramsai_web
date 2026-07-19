import { Suspense } from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
