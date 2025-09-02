import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Todo } from '@/types/todo';
import { 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  Plus, 
  User,
  LogOut,
  Calendar,
  TrendingUp
} from 'lucide-react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ProfileModal from './ProfileModal';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTodos();
  }, [user, navigate]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos((data || []) as Todo[]);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTodoCreated = () => {
    fetchTodos();
    setShowTodoForm(false);
  };

  const handleTodoUpdated = () => {
    fetchTodos();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingTodos = todos.filter(todo => todo.status === 'pending');
  const ongoingTodos = todos.filter(todo => todo.status === 'ongoing');
  const completedTodos = todos.filter(todo => todo.status === 'completed');

  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? (completedTodos.length / totalTodos) * 100 : 0;

  // Calculate weekly activity (mock data for now)
  const weeklyProgress = Math.min(completedTodos.length * 15, 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                My TO DO
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="btn-glass"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your productivity overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Tasks */}
          <Card className="bento-card animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTodos.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks waiting to start
              </p>
            </CardContent>
          </Card>

          {/* Ongoing Tasks */}
          <Card className="bento-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing Tasks</CardTitle>
              <PlayCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingTodos.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="bento-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTodos.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks finished
              </p>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card className="bento-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo List */}
          <div className="lg:col-span-2">
            <Card className="bento-card animate-slide-up">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Manage and track your daily tasks</CardDescription>
                </div>
                <Button
                  onClick={() => setShowTodoForm(true)}
                  className="btn-hero"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                <TodoList 
                  todos={todos} 
                  onTodoUpdated={handleTodoUpdated}
                />
              </CardContent>
            </Card>
          </div>

          {/* Activity Panel */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="bento-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>This Week</span>
                      <span>{weeklyProgress}%</span>
                    </div>
                    <Progress value={weeklyProgress} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Great progress! Keep up the momentum.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Priority Overview */}
            <Card className="bento-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Priority Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['high', 'medium', 'low'].map((priority) => {
                    const count = todos.filter(todo => 
                      todo.priority === priority && todo.status !== 'completed'
                    ).length;
                    const colorMap = {
                      high: 'destructive',
                      medium: 'warning',
                      low: 'secondary'
                    };
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <Badge variant={colorMap[priority as keyof typeof colorMap] as any}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTodoForm && (
        <TodoForm
          onClose={() => setShowTodoForm(false)}
          onTodoCreated={handleTodoCreated}
        />
      )}

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;