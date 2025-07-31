export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: Record<string, string>;
  solution: Record<string, string>;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  joinedAt: Date;
  solvedProblems: string[];
  streak: number;
  lastActive: Date;
}

export interface DailyPuzzle {
  id: string;
  day: number;
  problemId: string;
  date: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  topics: RoadmapTopic[];
  estimatedTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
  problems?: string[];
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Book' | 'Practice';
  link: string;
  estimatedTime?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime: number;
  memory: number;
  timestamp: Date;
}