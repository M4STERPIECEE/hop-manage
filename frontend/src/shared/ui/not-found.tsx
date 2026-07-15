import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Cette page est introuvable.</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Retour à l'accueil
      </Link>
    </div>
  );
}
