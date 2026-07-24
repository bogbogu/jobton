import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
