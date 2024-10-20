import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect } from "react";

export default function MaintenanceError() {
  const { token, setUserInformation } = useUserStore();

  const fetchUser = async () => {
    const response = await UserService.getUser();
    return response.data;
  };
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    console.log("Data do usuário:", data);
    if (data && token) {
      setUserInformation(data);
    }
  }, [data, setUserInformation, token]);
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">503</h1>
        <span className="font-medium">Website is under maintenance!</span>
        <p className="text-center text-muted-foreground">
          The site is not available at the moment. <br />
          We'll be back online shortly.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline">Learn more</Button>
        </div>
      </div>
    </div>
  );
}
