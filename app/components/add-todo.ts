import { assert } from '@ember/debug';
import Component from '@glimmer/component';

interface AddTodoArgs {
  add: (text: string) => void;
}

export default class AddTodo extends Component<AddTodoArgs> {
  submit = (event: Event): void => {
    assert('must bind to form', event.target instanceof HTMLFormElement);
    event.preventDefault();

    const input = event.target.elements.namedItem('new-todo');
    assert('missing input!', input instanceof HTMLInputElement);

    this.args.add(input.value);
    input.value = '';
  };
}
