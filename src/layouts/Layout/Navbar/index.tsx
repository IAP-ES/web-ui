import { useUserStore } from "@/stores/useUserStore";

export default function Navbar() {
  const { token, givenName, familyName } = useUserStore();

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-linear 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-300 ease-linear h-28">
          <div className="flex-1 flex items-center justify-end">
            {token && (
              <div className="flex items-center">
                <div className="hidden md:block text-primary mr-2 text-lg font-bold">
                  Welcome {givenName} {familyName}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
