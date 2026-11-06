import { useId } from 'react';
import { Link } from 'react-router-dom';

export function Logo({ compact }: { compact?: boolean }) {
  const gid = useId().replace(/:/g, '');
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Fight Flow — página inicial">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgb(var(--primary))" />
            <stop offset="1" stopColor="rgb(var(--vivid))" />
          </linearGradient>
        </defs>
        <polygon points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20" fill={`url(#${gid})`} />
        <path d="M20 16h26v8H29v6h13v8H29v12h-9z" fill="white" />
        <path d="M38 42l9 9h-9z" fill="white" opacity=".75" />
      </svg>
      {!compact && (
        <span className="font-display text-[27px] leading-none tracking-wider">
          FIGHT<span className="text-accent">FLOW</span>
        </span>
      )}
    </Link>
  );
}
