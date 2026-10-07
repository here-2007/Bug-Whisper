import { useState, useCallback } from 'react';

export interface ConvexTodo {
  id: string;
  shortId: string;
  text: string;
  category: 'Other' | 'Work' | 'Chores';
  completed: boolean;
  creationTime: string;
}

const INITIAL_TODOS: ConvexTodo[] = [
  {
    id: '24svfualb9824n',
    shortId: '24svfualb...',
    text: 'Play basketball',
    category: 'Other',
    completed: false,
    creationTime: '4/30/2024, 4:51:30 PM',
  },
  {
    id: '24vhbkoeg1942m',
    shortId: '24vhbkoeg...',
    text: 'Talk to my boss',
    category: 'Work',
    completed: false,
    creationTime: '4/30/2024, 4:49:12 PM',
  },
  {
    id: '24oajmofc8311k',
    shortId: '24oajmofc...',
    text: 'Buy groceries',
    category: 'Chores',
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
    const rawId = Math.random().toString(36).substring(2, 12);
    const newTodo: ConvexTodo = {
      id: rawId,
      shortId: `${rawId.substring(0, 9)}...`,
      text: text.trim(),
      category: 'Other',
      completed: false,
      creationTime: '4/30/2024, 4:55:00 PM',
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
