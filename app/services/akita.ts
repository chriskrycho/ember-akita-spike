import Service from '@ember/service';
import {
  EntityState,
  EntityStore,
  QueryEntity,
  StoreConfig,
  ID,
  guid,
} from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export enum VISIBILITY_FILTER {
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
  SHOW_ALL = 'SHOW_ALL',
}

export const isVisibilityFilter = (value: string): value is VISIBILITY_FILTER =>
  (Object.values(VISIBILITY_FILTER) as string[]).includes(value);

interface TodosState extends EntityState<Todo> {
  ui: {
    filter: VISIBILITY_FILTER;
  };
}

const initialState = {
  ui: { filter: VISIBILITY_FILTER.SHOW_ALL },
};

@StoreConfig({ name: 'todos' })
class TodosStore extends EntityStore<TodosState, Todo> {
  constructor() {
    super(initialState);
  }
}

export type Todo = {
  id: ID;
  text: string;
  completed: boolean;
};

export function createTodo(text: string): Todo {
  return {
    id: guid(),
    text,
    completed: false,
  };
}

class TodosQuery extends QueryEntity<TodosState, Todo> {
  selectVisibilityFilter$ = this.select((state) => state.ui.filter);

  selectVisibleTodos$ = combineLatest([
    this.selectVisibilityFilter$,
    this.selectAll(),
  ]).pipe(map(([filter, todos]) => this.getVisibleTodos(filter, todos)));

  constructor(protected store: TodosStore) {
    super(store);
  }

  private getVisibleTodos(filter: string, todos: Todo[]): Todo[] {
    switch (filter) {
      case VISIBILITY_FILTER.SHOW_COMPLETED:
        return todos.filter((t) => t.completed);
      case VISIBILITY_FILTER.SHOW_ACTIVE:
        return todos.filter((t) => !t.completed);
      default:
        return todos;
    }
  }
}

export default class AkitaService extends Service {
  readonly store: TodosStore;
  readonly query: TodosQuery;

  constructor() {
    super();
    this.store = new TodosStore();
    this.query = new TodosQuery(this.store);
  }

  updateFilter = (filter: VISIBILITY_FILTER): void => {
    this.store.update({
      ui: {
        filter,
      },
    });
  };

  complete = (id: ID): void => {
    this.store.update(id, (entity) => ({ completed: !entity.completed }));
  };

  add = (text: string): void => {
    const todo = createTodo(text);
    this.store.add(todo);
  };

  delete = (id: ID): void => {
    this.store.remove(id);
  };
}
