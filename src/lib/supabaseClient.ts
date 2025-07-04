import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://felxuyufjlakzayjbqyi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHh1eXVmamxha3pheWpicXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzk3NzYsImV4cCI6MjA1ODcxNTc3Nn0.6ackQlLUnhxO2fA3KV7EUOHp_lsdHzwR9MGNuBD3zSM'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
