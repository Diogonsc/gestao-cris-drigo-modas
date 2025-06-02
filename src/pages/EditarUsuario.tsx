import { FormUsuario } from "@/components/Usuarios/FormUsuario";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuarioStore, Usuario } from "@/store";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuarios, loading, error } = useUsuarioStore();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (id) {
      const usuarioEncontrado = usuarios.find((u) => u.id === id);
      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado);
      } else {
        navigate("/usuarios");
      }
    }
  }, [id, usuarios, navigate]);

  const handleSuccess = () => {
    navigate("/usuarios");
  };

  const handleBack = () => {
    navigate("/usuarios");
  };

  if (loading) {
    return <Loading text="Carregando usuário..." />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar usuário: {error}
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
          <p className="text-muted-foreground">
            Atualize as informações do usuário
          </p>
        </div>
      </div>

      <FormUsuario usuario={usuario} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditarUsuario;
