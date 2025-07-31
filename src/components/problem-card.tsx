import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  isSolved?: boolean;
  isDaily?: boolean;
  day?: number;
}

export function ProblemCard({ id, title, difficulty, tags, isSolved = false, isDaily = false, day }: ProblemCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isSolved ? 'border-green-500 dark:border-green-700' : ''}`}>
      <Link to={`/problems/${id}`} className="block h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {isSolved && (
                <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              )}
              {title}
            </CardTitle>
            {isDaily && (
              <Badge variant="secondary" className="ml-2">Day {day}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge 
              className={`
                ${difficulty === 'Easy' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' : ''}
                ${difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                ${difficulty === 'Hard' ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : ''}
              `}
            >
              {difficulty}
            </Badge>
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline">+{tags.length - 2}</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          {isSolved ? 'Completed' : 'Not attempted yet'}
        </CardFooter>
      </Link>
    </Card>
  );
}