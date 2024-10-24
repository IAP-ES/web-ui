import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/services/Client/UserService";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const {
    token,
    givenName,
    familyName,
    logout: zustandLogout,
  } = useUserStore();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await UserService.logout();
    return response.data;
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log(data);
      zustandLogout(navigate);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout falhou:", error);
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-linear 
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-300 ease-linear pt-2">
          <div className="flex-1 flex items-center justify-end">
            {token && (
              <div className="flex items-center">
                <div className="hidden md:block text-black mr-2 text-lg font-bold">
                  Welcome {givenName} {familyName}
                </div>
                <Button onClick={handleLogout} variant="" className="mr-2 ml-6">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
