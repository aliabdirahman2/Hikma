import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export const WaterIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M3 12h.5a2.5 2.5 0 0 1 0 5H3" />
    <path d="M21 12h-.5a2.5 2.5 0 0 0 0 5H21" />
    <path d="M7 7h.5a2.5 2.5 0 0 1 0 5H7" />
    <path d="M17 7h-.5a2.5 2.5 0 0 0 0 5H17" />
  </svg>
);
