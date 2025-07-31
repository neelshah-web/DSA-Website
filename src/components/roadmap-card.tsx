import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  topicCount: number;
}

export function RoadmapCard({ 
  id, 
  title, 
  description, 
  estimatedTime, 
  level, 
  progress = 0,
  topicCount 
}: RoadmapCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <Link to={`/roadmaps/${id}`} className="block h-full">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={`
                  ${level === 'Beginner' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' : ''}
                  ${level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                  ${level === 'Advanced' ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : ''}
                `}
              >
                {level}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {estimatedTime}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3 mr-1" />
                {topicCount} topics
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t">
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}