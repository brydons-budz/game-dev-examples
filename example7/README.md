# README

Now, it's time to add controls! Let's make both paddles controllable. For now, we'll just use the same keyboard for both. We'll make the left paddle via `W` (up) and `S` (down), and the right paddle via `↑` and `↓`. The way the web tends to work is via events. However, our structure is built data-first, not function-first, so we'll need the full set of pressed/unpressed controls as data. I'll be copying [the approach found on MDN](https://developer.mozilla.org/en-US/docs/Games/Techniques/Control_mechanisms/Desktop_with_mouse_and_keyboard#pure_javascript_approach) to some degree.

This example also merges the functions found in the `render.js` and `state.js` files into single top-level functions. The technique used to re-separate those functions and objects is called "destructuring", which is a simple way to break a single value into multiple. Since functions can only return one value, this is a great way to bypass that limitation. This is actually a common approach for some more modern frontend frameworks. For example:

```js
// React
const [count, setCount] = useState(0);
```

```js
// Solid.js
const [count, setCount] = createSignal(0);
```

These two examples are array destructuring. There's no name to extract, just a position/index in the array that we are assigning to a new variable name. In our code, we are using object destructuring.
```ts
const { fragment, context, render } = initializeRender(configuration.size);
```

Note, this could alternatively be written like this, but it introduces another variable name and it's longer...

```ts
const renderModule = initializeRender(configuration.size);
const fragment = renderModule.fragment;
const context = renderModule.context;
const render = renderModule.render;
```

## Yet Another Note on Maintainability - Inversion of Control

Now, I intentionally focused on `initializeRender` first. `initializeState` has a bit more going on. We've made functions return functions before but here we actually go the other way and pass a function into another function. The idea is to actually pretty simple (and really common, considering how event listeners work), it just takes some getting used to when writing your own code that does this. The goal here is to hook into a particular section of that function's logic and do something custom (that's often how "Inversion of Control" is defined). In our situation, we wanted to avoid putting side effects inside the function, so we do our side effect logic in `main()` as functions and pass them in.

Now, we've met our goal of keeping side effects located in the `main.js` file! "um...yay? why is that exciting?", you ask? Well, for one, it's black-box testable - no mocks or monkey-patching needed! Also, it's more reusable. By separating side effects - especially I/O - we can more easily re-write them to work with different technologies, platforms, etc. Finally, the most important one: even if you never write any unit tests or need to move to some other platform, it's pretty easy to understand what's going on and where to change something by just looking at the code in `main.js`. [There are no surprises](https://en.wikipedia.org/wiki/Principle_of_least_astonishment#:~:text=In%20user%20interface%20design%20and,not%20astonish%20or%20surprise%20users.)