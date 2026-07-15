function format(msg: string): string {
  return msg.startsWith("i18n:") ? msg.replace("i18n:", "") : msg;
}

export function useFormatError() {
  return (issues: unknown): string => {
    if (!issues) return "Unknown error";
    if (Array.isArray(issues))
      return issues
        .map((i) =>
          typeof i === "string"
            ? format(i)
            : i && typeof i === "object" && "message" in i
              ? format((i as { message: string }).message)
              : "Unknown error",
        )
        .join(", ");
    if (typeof issues === "object" && issues && "message" in issues)
      return format((issues as { message: string }).message);
    return format(issues as string);
  };
}
