type ClubMarkProps = {
  className?: string;
};

export function ClubMark({ className = "h-9 w-9" }: ClubMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="4" fill="currentColor" />
      <path
        d="M12 22h40v6H12V22Zm0 14h40v6H12v-6Z"
        fill="#f7f5f2"
      />
      <circle cx="18" cy="25" r="5" fill="#f7f5f2" />
      <circle cx="46" cy="25" r="5" fill="#f7f5f2" />
      <circle cx="18" cy="39" r="5" fill="#f7f5f2" />
      <circle cx="46" cy="39" r="5" fill="#f7f5f2" />
      <path
        d="M28 18h8v28h-8V18Z"
        fill="#f7f5f2"
        opacity="0.92"
      />
    </svg>
  );
}
