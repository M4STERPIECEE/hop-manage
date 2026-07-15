export function LoadingScreen() {
  return (
    <output
      data-slot="loading-screen"
      aria-live="polite"
      aria-label="Chargement"
      className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background"
    >
      <img src="/logo.png" alt="SIRH" className="size-16 object-contain" />
      <div
        aria-hidden
        className="relative h-0.75 w-44 overflow-hidden rounded-full bg-muted"
      >
        <div className="absolute top-0 left-0 h-full w-[38%] rounded-full bg-primary motion-safe:animate-bar-slide motion-reduce:w-full motion-reduce:animate-pulse" />
      </div>
      <p className="text-muted-foreground text-xs">
        Chargement de votre espace…
      </p>
    </output>
  );
}
