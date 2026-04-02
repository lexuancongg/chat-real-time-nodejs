import React from "react";

export type Status = "ONLINE" | "OFFLINE";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function avatarColor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  id: number;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  status?: Status | null;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  id,
  size = "md",
  showStatus,
  status,
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-12 h-12 text-sm",
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} ${avatarColor(
          id
        )} rounded-full flex items-center justify-center font-semibold text-white`}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0f1117] ${
            status === "ONLINE" ? "bg-emerald-400" : "bg-slate-500"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;