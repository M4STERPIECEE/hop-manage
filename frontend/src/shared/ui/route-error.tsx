import { useNavigate } from "react-router-dom";
import { Button } from "src/shared/ui/button";

type RouteErrorProps = {
  error: Error;
};

export function RouteError({ error }: RouteErrorProps) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-bold text-2xl">Une erreur est survenue</h1>
      <p className="max-w-md text-muted-foreground">
        Impossible de contacter le serveur. Vérifiez votre connexion, puis
        réessayez.
      </p>
      {error.message ? (
        <p className="max-w-md text-muted-foreground text-sm">
          {error.message}
        </p>
      ) : null}
      <Button onClick={() => navigate(0)}>Réessayer</Button>
    </div>
  );
}
