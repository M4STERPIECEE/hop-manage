import { cn } from "src/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "src/shared/ui/avatar";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "[background-image:var(--avatar-1)]",
  "[background-image:var(--avatar-2)]",
  "[background-image:var(--avatar-3)]",
  "[background-image:var(--avatar-4)]",
  "[background-image:var(--avatar-5)]",
  "[background-image:var(--avatar-6)]",
  "[background-image:var(--avatar-7)]",
];

const avatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

type PersonAvatarProps = {
  name: string;
  avatar?: string;
  size?: "default" | "sm" | "lg";
};

export function PersonAvatar({
  name,
  avatar,
  size = "default",
}: PersonAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={avatar || undefined} alt={name} />
      <AvatarFallback
        className={cn(
          avatarColor(name),
          "font-medium text-primary-foreground",
          size === "sm" && "text-xs",
          size === "lg" && "text-lg",
        )}
      >
        {initials(name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
