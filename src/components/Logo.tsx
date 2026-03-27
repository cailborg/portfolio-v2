interface Props {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Logo({ className, style, onClick }: Props) {
  return (
    <svg
      width="72" height="72" viewBox="0 0 72 72"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      onClick={onClick}
    >
      <path d="M33.0576 72C14.5469 70.4701 0 54.9378 0 36C0.000199885 17.0623 14.547 1.52984 33.0576 0V72ZM72 39.0107C70.5546 56.561 56.5881 70.5519 39.0684 72V39.0107H72ZM39.0684 0C56.5878 1.44803 70.5543 15.4393 72 32.9893H39.0684V0Z" />
    </svg>
  );
}
