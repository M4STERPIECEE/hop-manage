import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import { Button } from "src/shared/ui/button";

export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter();
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
      <Button onClick={() => router.invalidate()}>Réessayer</Button>
    </div>
  );
}
