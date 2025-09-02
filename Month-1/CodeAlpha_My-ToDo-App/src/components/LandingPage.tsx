import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description: "Organize, prioritize, and track your tasks with intelligent automation"
    },
    {
      icon: Calendar,
      title: "Real-time Sync",
      description: "Access your tasks anywhere with instant synchronization across devices"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Visualize your productivity with beautiful charts and insights"
    },
    {
      icon: Sparkles,
      title: "Premium Experience",
      description: "Enjoy a beautiful, modern interface designed for productivity"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Galaxy Background Effect */}
      <div className="absolute inset-0">
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-20 h-20 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My TO DO
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/auth')}
            className="text-foreground hover:text-primary"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            className="btn-hero"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section with Galaxy Background */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Supercharge Your
            <span className="block bg-gradient-primary bg-clip-text text-transparent animate-glow">
              Productivity
            </span>
          </h1>
          
          <p className="text-lg leading-8 text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience the future of task management with My TO DO. Beautiful design, 
            real-time sync, and powerful analytics to keep you focused and productive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="btn-hero text-lg px-8 py-6 w-full sm:w-auto"
            >
              Start Free Today
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth')}
              className="btn-glass text-lg px-8 py-6 w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bento-card text-center group animate-slide-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-20">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="btn-hero w-full text-lg py-6"
          >
            Get Started Free
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;