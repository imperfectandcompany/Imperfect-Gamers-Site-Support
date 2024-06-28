import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";

export const AdminError: FunctionalComponent<{ message: string }> = ({ message }) => {
  return (
    <div className="container mx-auto relative px-8 py-16 max-w-7xl md:px-12 lg:px-18 lg:py-22">
      <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
        {message}
      </h1>
      <Link href="/admin/dashboard" className="text-indigo-500 hover:underline mt-8 inline-block">
        Return to Admin Dashboard
      </Link>
    </div>
  );
};
