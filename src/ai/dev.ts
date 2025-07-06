import { config } from 'dotenv';
config();

import '@/ai/flows/generate-reflection.ts';
import '@/ai/flows/generate-symbolic-prompt.ts';
import '@/ai/flows/continue-chat.ts';
