export interface Board {
  id: string;
  title: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  position: number;
  boardId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  listId: string;
  createdAt: string;
  assignments?: {
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: string;
  metadata?: any;
  createdAt: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}
