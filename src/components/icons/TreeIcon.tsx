import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export const TreeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-6 h-6', props.className)}
    {...props}
  >
    <path d="M12 22v-8" />
    <path d="M20 12v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <path d="M4 14h16" />
    <path d="M12 14v8" />
    <path d="m8 14 1.5-1.5" />
    <path d="m16 14-1.5-1.5" />
    <path d="M8 18h8" />
  </svg>
);
