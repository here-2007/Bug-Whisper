import { useState, useCallback } from 'react';

export interface ConvexTodo {
  id: string;
  text: string;
  category: 'Chores' | 'Work' | 'Personal';
  completed: boolean;
  creationTime: string;
}

const INITIAL_TODOS: ConvexTodo[] = [
  {
    id: 'k5707e78',
    text: 'Play basketball',
    category: 'Work',
    completed: false,
    creationTime: '4/30/2024, 4:51:30 PM',
  },
  {
    id: '2bs54k89',
    text: 'Talk to Vlad',
    category: 'Chores',
    completed: true,
    creationTime: '4/30/2024, 4:49:12 PM',
  },
  {
    id: '3km91p42',
    text: 'Buy groceries',
    category: 'Personal',
    completed: false,
    creationTime: '4/30/2024, 4:32:05 PM',
  },
];

export function useConvexDemo() {
  const [isPatched, setIsPatched] = useState(false);
  const [todos, setTodos] = useState<ConvexTodo[]>(INITIAL_TODOS);
  const [showBlockedHint, setShowBlockedHint] = useState(false);

  const togglePatched = useCallback(() => {
    setIsPatched((prev) => !prev);
    setShowBlockedHint(false);
  }, []);

  const toggleTodo = useCallback(
    (id: string) => {
      if (!isPatched) {
        setShowBlockedHint(true);
        setTimeout(() => setShowBlockedHint(false), 2400);
        return;
      }
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [isPatched]
  );

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;
    const newTodo: ConvexTodo = {
      id: Math.random().toString(36).substring(2, 10),
      text: text.trim(),
      category: 'Work',
      completed: false,
      creationTime: new Date().toLocaleString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  return {
    isPatched,
    togglePatched,
    todos,
    toggleTodo,
    addTodo,
    showBlockedHint,
  };
}
