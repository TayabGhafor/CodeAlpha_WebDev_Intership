export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'ongoing' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  user_id: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}