import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-questions.ts';
import '@/ai/flows/suggest-content-tags.ts';
import '@/ai/flows/summarize-content.ts';