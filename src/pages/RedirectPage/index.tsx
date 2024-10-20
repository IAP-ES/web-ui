import { Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";

//login/register imports
import { UserService } from "@/services/Client/UserService";
import { useUserStore } from "@/stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function RedirectPage() {
  const navigate = useNavigate();

  // Função para extrair o código da URL
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code"); // Obtem o código da URL
  };

  const signin = async (code: string) => {
    const response = (await UserService.signin(code)).data;
    return response;
  };

  const loginMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      useUserStore.getState().login(data.token.token);
      navigate("/maintenance"); // Redireciona após sucesso no login
      // useUserStore.getState().setUserInformation(data.user);
    },
    onError: (error) => {
      console.error("Login falhou:", error);
    },
  });

  useEffect(() => {
    const code = getCodeFromUrl(); // Extrai o código da URL

    if (code) {
      loginMutation.mutate(code.toString()); // Inicia o processo de login
    } else {
      console.error("Nenhum código encontrado na URL");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900">
      <div className="text-center">
        <div className="mb-4">
          <LogIn className="w-16 h-16 mx-auto text-primary animate-pulse" />
        </div>
        <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Bem-vindo!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Estamos a redirecionar-te para a página inicial...
          <br />
          Por favor, aguarde.
        </p>
        <div className="flex justify-center items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
