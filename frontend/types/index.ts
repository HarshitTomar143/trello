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
}
