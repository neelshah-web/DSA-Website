import { Problem, DailyPuzzle, Roadmap } from './types';

// Sample problems data
export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
    
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`
    },
    solution: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
        return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
    
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Your code here
        pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        
    }
}`
    },
    solution: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    const stack = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(' || s[i] === '[' || s[i] === '{') {
            stack.push(s[i]);
        } else {
            const last = stack.pop();
            if (map[last] !== s[i]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        
        for char in s:
            if char in mapping:  # closing bracket
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:  # opening bracket
                stack.append(char)
                
        return not stack`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) {
                    return false;
                }
                char top = stack.pop();
                if ((c == ')' && top != '(') || 
                    (c == ']' && top != '[') || 
                    (c == '}' && top != '{')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      },
      {
        input: 'head = []',
        output: '[]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000]',
      '-5000 <= Node.val <= 5000'
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Your code here
    
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        # Your code here
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
        
    }
}`
    },
    solution: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    let prev = null;
    let current = head;
    while (current !== null) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    return prev;
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev = None
        current = head
        
        while current:
            next_temp = current.next
            current.next = prev
            prev = current
            current = next_temp
            
        return prev`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;
        
        while (current != null) {
            ListNode nextTemp = current.next;
            current.next = prev;
            prev = current;
            current = nextTemp;
        }
        
        return prev;
    }
}`
    }
  }
];

// Daily puzzles data - representing a week of array problems from basic to advanced
export const dailyPuzzles: DailyPuzzle[] = [
  {
    id: 'dp-1',
    day: 1,
    problemId: 'two-sum',
    date: '2023-07-24'
  },
  {
    id: 'dp-2',
    day: 2,
    problemId: 'valid-parentheses',
    date: '2023-07-25'
  },
  {
    id: 'dp-3',
    day: 3,
    problemId: 'reverse-linked-list',
    date: '2023-07-26'
  },
  {
    id: 'dp-4',
    day: 4,
    problemId: 'two-sum',
    date: '2023-07-27'
  },
  {
    id: 'dp-5',
    day: 5,
    problemId: 'valid-parentheses',
    date: '2023-07-28'
  },
  {
    id: 'dp-6',
    day: 6,
    problemId: 'reverse-linked-list',
    date: '2023-07-29'
  },
  {
    id: 'dp-7',
    day: 7,
    problemId: 'two-sum',
    date: '2023-07-30'
  }
];

// Roadmaps data
export const roadmaps: Roadmap[] = [
  {
    id: 'javascript-basics',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language, from variables to functions to advanced concepts.',
    estimatedTime: '4 weeks',
    level: 'Beginner',
    topics: [
      {
        id: 'js-intro',
        title: 'Introduction to JavaScript',
        description: 'Learn about JavaScript, its history, and how it works in the browser.',
        resources: [
          {
            id: 'js-intro-1',
            title: 'Introduction to JavaScript',
            type: 'Article',
            link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
            estimatedTime: '30 mins'
          },
          {
            id: 'js-intro-2',
            title: 'JavaScript Basics',
            type: 'Video',
            link: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            estimatedTime: '1 hour'
          }
        ],
        problems: ['two-sum']
      },
      {
        id: 'js-variables',
        title: 'Variables and Data Types',
        description: 'Learn about variables, data types, and operators in JavaScript.',
        resources: [
          {
            id: 'js-var-1',
            title: 'JavaScript Variables',
            type: 'Article',
            link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types',
            estimatedTime: '45 mins'
          },
          {
            id: 'js-var-2',
            title: 'JavaScript Data Types',
            type: 'Video',
            link: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
            estimatedTime: '1 hour'
          }
        ],
        problems: ['valid-parentheses']
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python Fundamentals',
    description: 'Learn the basics of Python programming language, perfect for beginners in programming.',
    estimatedTime: '3 weeks',
    level: 'Beginner',
    topics: [
      {
        id: 'py-intro',
        title: 'Introduction to Python',
        description: 'Learn about Python, its history, and why it is so popular.',
        resources: [
          {
            id: 'py-intro-1',
            title: 'Python for Beginners',
            type: 'Article',
            link: 'https://www.python.org/about/gettingstarted/',
            estimatedTime: '30 mins'
          },
          {
            id: 'py-intro-2',
            title: 'Python Crash Course',
            type: 'Video',
            link: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            estimatedTime: '1.5 hours'
          }
        ],
        problems: ['two-sum']
      },
      {
        id: 'py-data-structures',
        title: 'Python Data Structures',
        description: 'Learn about lists, dictionaries, tuples, and sets in Python.',
        resources: [
          {
            id: 'py-ds-1',
            title: 'Python Data Structures',
            type: 'Article',
            link: 'https://docs.python.org/3/tutorial/datastructures.html',
            estimatedTime: '1 hour'
          },
          {
            id: 'py-ds-2',
            title: 'Python Data Structures Tutorial',
            type: 'Video',
            link: 'https://www.youtube.com/watch?v=R-HLU9Fl5ug',
            estimatedTime: '1 hour'
          }
        ],
        problems: ['valid-parentheses', 'reverse-linked-list']
      }
    ]
  }
];

// Function to get a problem by ID
export function getProblemById(id: string): Problem | undefined {
  return problems.find(problem => problem.id === id);
}

// Function to get a roadmap by ID
export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmaps.find(roadmap => roadmap.id === id);
}

// Function to get daily puzzle for a specific day
export function getDailyPuzzleByDay(day: number): DailyPuzzle | undefined {
  return dailyPuzzles.find(puzzle => puzzle.day === day);
}

// Mock user data
export const mockUser = {
  id: 'user-1',
  username: 'johndoe',
  email: 'john@example.com',
  name: 'John Doe', 
  bio: 'Passionate programmer learning DSA',
  avatar: `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4ECDC4"/>
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            text-anchor="middle" dominant-baseline="central" fill="white">
        JD
      </text>
    </svg>
  `)}`,
  joinedAt: new Date('2023-01-15'),
  solvedProblems: ['two-sum'],
  streak: 5,
  lastActive: new Date()
};