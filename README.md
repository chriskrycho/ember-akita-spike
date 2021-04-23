# ember-akita

A ***quickly hacked-together spike*** of what integrating [Akita](https://datorama.github.io/akita/) into an [Ember Octane](https://emberjs.com) app looks like. This is basically "TODO MVC" but with no styles (and only about 95% of the functionality implemented).

The files of interest are:

- [the `AkitaService`](./app/services/akita.ts), which also defines all the actual boilerplate for the `Todo` type, the Akita store and queries, etc.

- [the `todos.ts` component](./app/components/todos.ts), which connects the store to local reactive (tracked) state in the Ember app. This is comparable to setting up the state (with `setState` or a custom hook) in a React app.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd ember-akita`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).
