import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Todo } from '@/types/todo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Trash2, 
  MoreVertical,
  Edit
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TodoListProps {
  todos: Todo[];
  onTodoUpdated: () => void;
}

const TodoList = ({ todos, onTodoUpdated }: TodoListProps) => {
  const [updatingTodos, setUpdatingTodos] = useState<Set<string>>(new Set());

  const updateTodoStatus = async (todoId: string, newStatus: Todo['status']) => {
    setUpdatingTodos(prev => new Set(prev).add(todoId));
    
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('todos')
        .update(updateData)
        .eq('id', todoId);

      if (error) throw error;

      toast.success(`Task marked as ${newStatus}!`);
      onTodoUpdated();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdatingTodos(prev => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;

      toast.success('Task deleted successfully!');
      onTodoUpdated();
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  const getStatusIcon = (status: Todo['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'ongoing': return <Play className="w-4 h-4 text-primary" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => (
        <Card 
          key={todo.id} 
          className={`glass-hover transition-all duration-200 ${
            todo.status === 'completed' ? 'opacity-75' : ''
          }`}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(todo.status)}
                  <h3 className={`font-medium ${
                    todo.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {todo.title}
                  </h3>
                  <Badge variant={getPriorityColor(todo.priority) as any} className="text-xs">
                    {todo.priority}
                  </Badge>
                </div>
                
                {todo.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {todo.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {todo.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {formatDate(todo.due_date)}</span>
                    </div>
                  )}
                  <span>Created: {formatDate(todo.created_at)}</span>
                  {todo.completed_at && (
                    <span>Completed: {formatDate(todo.completed_at)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={todo.status}
                  onValueChange={(value: Todo['status']) => updateTodoStatus(todo.id, value)}
                  disabled={updatingTodos.has(todo.id)}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => deleteTodo(todo.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TodoList;