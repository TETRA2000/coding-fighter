import type { LevelConfig } from '../types/game'

export const levels: ReadonlyArray<LevelConfig> = [
  {
    id: 'level-1',
    name: 'The Basics',
    difficulty: 'easy',
    challenges: [
      {
        id: 'l1-c1',
        type: 'algorithm',
        title: 'Sum Two Numbers',
        description: 'Write a function called `solution` that takes two numbers and returns their sum.',
        constraints: ['Both inputs are integers between -1000 and 1000'],
        examples: [
          { input: 'solution(2, 3)', output: '5', explanation: '2 + 3 = 5' },
          { input: 'solution(-1, 1)', output: '0', explanation: '-1 + 1 = 0' },
        ],
        template: {
          javascript: 'function solution(a, b) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(a: number, b: number): number {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l1c1-t1', input: [2, 3], expectedOutput: 5, description: 'Positive numbers' },
          { id: 'l1c1-t2', input: [-1, 1], expectedOutput: 0, description: 'Negative and positive' },
          { id: 'l1c1-t3', input: [0, 0], expectedOutput: 0, description: 'Zeros' },
          { id: 'l1c1-t4', input: [100, 200], expectedOutput: 300, description: 'Larger numbers' },
        ],
        timeLimitMs: 30000,
        maxScore: 100,
      },
      {
        id: 'l1-c2',
        type: 'string',
        title: 'Reverse a String',
        description: 'Write a function called `solution` that takes a string and returns it reversed.',
        constraints: ['Input string length is between 0 and 100'],
        examples: [
          { input: 'solution("hello")', output: '"olleh"', explanation: 'Reversed character by character' },
          { input: 'solution("a")', output: '"a"', explanation: 'Single character stays the same' },
        ],
        template: {
          javascript: 'function solution(str) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(str: string): string {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l1c2-t1', input: ['hello'], expectedOutput: 'olleh', description: 'Basic string' },
          { id: 'l1c2-t2', input: ['a'], expectedOutput: 'a', description: 'Single char' },
          { id: 'l1c2-t3', input: [''], expectedOutput: '', description: 'Empty string' },
          { id: 'l1c2-t4', input: ['racecar'], expectedOutput: 'racecar', description: 'Palindrome' },
        ],
        timeLimitMs: 30000,
        maxScore: 100,
      },
    ],
  },
  {
    id: 'level-2',
    name: 'Array Mastery',
    difficulty: 'medium',
    challenges: [
      {
        id: 'l2-c1',
        type: 'array',
        title: 'Find Maximum',
        description: 'Write a function called `solution` that takes an array of numbers and returns the largest one.',
        constraints: ['Array has at least 1 element', 'Elements are integers between -10000 and 10000'],
        examples: [
          { input: 'solution([1, 5, 3])', output: '5', explanation: '5 is the largest' },
          { input: 'solution([-1, -5, -3])', output: '-1', explanation: '-1 is the largest negative' },
        ],
        template: {
          javascript: 'function solution(arr) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(arr: number[]): number {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l2c1-t1', input: [[1, 5, 3]], expectedOutput: 5, description: 'Positive numbers' },
          { id: 'l2c1-t2', input: [[-1, -5, -3]], expectedOutput: -1, description: 'Negative numbers' },
          { id: 'l2c1-t3', input: [[42]], expectedOutput: 42, description: 'Single element' },
          { id: 'l2c1-t4', input: [[3, 3, 3]], expectedOutput: 3, description: 'All same' },
        ],
        timeLimitMs: 25000,
        maxScore: 150,
      },
      {
        id: 'l2-c2',
        type: 'array',
        title: 'Remove Duplicates',
        description: 'Write a function called `solution` that takes an array of numbers and returns a new array with duplicates removed, preserving order.',
        constraints: ['Array length is between 0 and 100'],
        examples: [
          { input: 'solution([1, 2, 2, 3])', output: '[1, 2, 3]', explanation: 'Second 2 removed' },
        ],
        template: {
          javascript: 'function solution(arr) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(arr: number[]): number[] {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l2c2-t1', input: [[1, 2, 2, 3]], expectedOutput: [1, 2, 3], description: 'Basic duplicates' },
          { id: 'l2c2-t2', input: [[1, 1, 1]], expectedOutput: [1], description: 'All same' },
          { id: 'l2c2-t3', input: [[]], expectedOutput: [], description: 'Empty array' },
          { id: 'l2c2-t4', input: [[5, 3, 5, 3, 1]], expectedOutput: [5, 3, 1], description: 'Mixed duplicates' },
        ],
        timeLimitMs: 25000,
        maxScore: 150,
      },
      {
        id: 'l2-c3',
        type: 'algorithm',
        title: 'FizzBuzz Value',
        description: 'Write a function called `solution` that takes a number n and returns "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, or the number as a string otherwise.',
        constraints: ['n is a positive integer between 1 and 1000'],
        examples: [
          { input: 'solution(3)', output: '"Fizz"', explanation: '3 is divisible by 3' },
          { input: 'solution(15)', output: '"FizzBuzz"', explanation: '15 is divisible by both 3 and 5' },
        ],
        template: {
          javascript: 'function solution(n) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(n: number): string {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l2c3-t1', input: [3], expectedOutput: 'Fizz', description: 'Divisible by 3' },
          { id: 'l2c3-t2', input: [5], expectedOutput: 'Buzz', description: 'Divisible by 5' },
          { id: 'l2c3-t3', input: [15], expectedOutput: 'FizzBuzz', description: 'Divisible by both' },
          { id: 'l2c3-t4', input: [7], expectedOutput: '7', description: 'Neither' },
        ],
        timeLimitMs: 20000,
        maxScore: 150,
      },
    ],
  },
  {
    id: 'level-3',
    name: 'Advanced Challenges',
    difficulty: 'hard',
    challenges: [
      {
        id: 'l3-c1',
        type: 'algorithm',
        title: 'Fibonacci',
        description: 'Write a function called `solution` that takes a number n and returns the nth Fibonacci number (0-indexed). F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
        constraints: ['0 <= n <= 30'],
        examples: [
          { input: 'solution(0)', output: '0', explanation: 'F(0) = 0' },
          { input: 'solution(6)', output: '8', explanation: '0,1,1,2,3,5,8' },
        ],
        template: {
          javascript: 'function solution(n) {\n  // Write your code here\n  \n}',
          typescript: 'function solution(n: number): number {\n  // Write your code here\n  \n}',
        },
        testCases: [
          { id: 'l3c1-t1', input: [0], expectedOutput: 0, description: 'F(0)' },
          { id: 'l3c1-t2', input: [1], expectedOutput: 1, description: 'F(1)' },
          { id: 'l3c1-t3', input: [6], expectedOutput: 8, description: 'F(6)' },
          { id: 'l3c1-t4', input: [10], expectedOutput: 55, description: 'F(10)' },
        ],
        timeLimitMs: 15000,
        maxScore: 200,
      },
      {
        id: 'l3-c2',
        type: 'debugging',
        title: 'Fix the Sort',
        description: 'The following function should sort an array of numbers in ascending order, but it has a bug. Fix it so `solution` returns the correctly sorted array.',
        constraints: ['Array length is between 0 and 100'],
        examples: [
          { input: 'solution([3, 1, 2])', output: '[1, 2, 3]', explanation: 'Sorted ascending' },
        ],
        template: {
          javascript: 'function solution(arr) {\n  // Bug: sort() sorts lexicographically by default!\n  return arr.sort();\n}',
          typescript: 'function solution(arr: number[]): number[] {\n  // Bug: sort() sorts lexicographically by default!\n  return arr.sort();\n}',
        },
        testCases: [
          { id: 'l3c2-t1', input: [[3, 1, 2]], expectedOutput: [1, 2, 3], description: 'Basic sort' },
          { id: 'l3c2-t2', input: [[10, 2, 1]], expectedOutput: [1, 2, 10], description: 'Numeric vs lexicographic' },
          { id: 'l3c2-t3', input: [[-1, 5, 0]], expectedOutput: [-1, 0, 5], description: 'Negatives' },
          { id: 'l3c2-t4', input: [[]], expectedOutput: [], description: 'Empty array' },
        ],
        timeLimitMs: 15000,
        maxScore: 200,
      },
    ],
  },
]

export function getLevelById(id: string): LevelConfig | undefined {
  return levels.find((l) => l.id === id)
}

export function getNextLevelId(currentId: string): string | null {
  const index = levels.findIndex((l) => l.id === currentId)
  if (index === -1 || index >= levels.length - 1) return null
  return levels[index + 1].id
}
