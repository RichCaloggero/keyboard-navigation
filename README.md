# keyboard-navigation

Applies keyboard navigation to list, tree, and menu widgits.

## Motovation

`Aria` does *not* provide any behavior "out of the box".
This means that all keyboard navigation must be provided by the author.
It is not, IMO, the lack of developer understanding of `aria` that contributes to the poor accessibility of many custom widgets,  but lack of or erroneous / not helpful keyboard navigation. 

We attempt to combat this issue with the keyboardNavigation.js plugin provided here.
It will work in both shadow  and light DOM.
It currently handles both standalone and embedded listbox and tree widgets, and will be upgraded to handle menus.
It is available in UMD and commonJS formats.


## Usage

```
selectItem = keyboardNavigation (container, options);
```

### Returns

a function which can be called to get or set the currently focused item

## Demo

http://RichCaloggero.github.io/keyboard-navigation/demo.html


## options:


- type: "list", // list, tree, or menu
- embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
- multiselect: false, // if set, `aria-multiselected` on list and `aria-selected` on each item, otherwise `aria-selected` follows focus
- applyAria: true, // set to false to add your own
- groupSelector: "ul", // ul / li by default
- nodeSelector: "li", // use divs and spans instead if you like
- activeNodeSelector: "", // use something like `":not(.hidden)"` if you want to make filterable lists
- wrap: false, // not yet implemented

- keymap: object whose keys are actions, values are arrays of key specifiers
- actions: objects whose keys are action names, values are functions to call
+ defaults suitable for both lists and trees now implemented

### Default keymap

Arrays specify multiple keys for same action

```
keymap: {
next: ["ArrowDown", "ArrowRight"],
prev: ["ArrowUp", "ArrowLeft"],
first: ["Home"],
last: ["End"]
}, // keymap
```

### Default actions

```
actions: {
next: nextItem,
prev: prevItem,
first: firstItem,
last: lastItem,

up: upLevel,
down: downLevel,

out: function () {} // not implemented
} // actions
```

You can also use strings instead of functions as action values, in which case an event with that name will be fired on the currently focused node.
For instance, we could add an action which fired an event named "cancel" when the escape key is pressed:

```
currentItem = keyboardNavigation (list, {
actions: [cancel: "cancel"],
keymap: [cancel: ["Escape"]
});
// somewhere else in caller
list.addEventListener ("cancel", (e) => alert ("canceled on node " + e.target));
```
