import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import AkitaService, {
  isVisibilityFilter,
  Todo,
  VISIBILITY_FILTER,
} from 'ember-akita/services/akita';
import { takeWhile } from 'rxjs/operators';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

export default class Todos extends Component {
  @service declare akita: AkitaService;
  @tracked _todos: Todo[] = [];
  @tracked filter: VISIBILITY_FILTER | null = null;

  get todos(): Todo[] {
    switch (this.filter) {
      case null:
      case VISIBILITY_FILTER.SHOW_ALL:
        return this._todos;
      case VISIBILITY_FILTER.SHOW_ACTIVE:
        return this._todos.filter(({ completed }) => !completed);
      case VISIBILITY_FILTER.SHOW_COMPLETED:
        return this._todos.filter(({ completed }) => completed);
    }
  }

  changeFilter = ({ target }: Event): void => {
    assert(
      'filter must be an HTMLSelectElement',
      target instanceof HTMLSelectElement
    );
    assert(`invalid value ${target.value}`, isVisibilityFilter(target.value));
    this.akita.updateFilter(target.value);
  };

  constructor(owner: unknown, args: Record<string, never>) {
    super(owner, args);

    this.akita.query.selectVisibleTodos$
      .pipe(takeWhile(() => !this.isDestroying))
      .subscribe((todos) => {
        this._todos = todos;
      });

    this.akita.query.selectVisibilityFilter$
      .pipe(takeWhile(() => !this.isDestroying))
      .subscribe((filter) => {
        this.filter = filter;
      });
  }
}
