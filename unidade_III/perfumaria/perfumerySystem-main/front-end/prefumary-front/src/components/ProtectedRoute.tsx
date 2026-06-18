import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR" | "CLIENTE";

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  nivel: NivelAcesso;
};

type ProtectedRouteProps = {
  children: ReactNode;
  allowed: NivelAcesso[];
};

export default function ProtectedRoute({
  children,
  allowed,
}: ProtectedRouteProps) {
  const usuarioLogado: UsuarioLogado | null = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(usuarioLogado.nivel)) {
    if (usuarioLogado.nivel === "CLIENTE") {
      return <Navigate to="/catalogo" replace />;
    }

    if (usuarioLogado.nivel === "VENDEDOR") {
      return <Navigate to="/vendedores" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}