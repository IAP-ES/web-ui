"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
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
    <div>
      <div className="relative flex flex-col min-h-screen">
        <div
          className="absolute bg-cover bg-center filter blur-sm h-full w-full"
          style={{ backgroundImage: "url('/src/assets/bg-landing_page.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative flex-grow bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Welcome to the To-Do List App
          </h1>
          <div className="space-x-4 my-10">
            <Link to="https://703671939478-iap-es.auth.eu-north-1.amazoncognito.com/login?client_id=2skfogn5co7ahodrti6ndqf7kt&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=https%3A%2F%2Falb-568018721.eu-north-1.elb.amazonaws.com%2Foauth2%2Fidpresponse">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
