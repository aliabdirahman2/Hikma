import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export const EarthIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M2 12h20" />
    <path d="M12 2v20" />
    <path d="M18 6a6 6 0 0 0-12 0" />
    <path d="M6 18a6 6 0 0 0 12 0" />
  </svg>
);
