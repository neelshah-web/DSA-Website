import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link to="/problems">Explore Problems</Link>
        </Button>
      </div>
    </div>
  );
}