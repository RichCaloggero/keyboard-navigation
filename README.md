# keyboard-navigation

Applies keyboard navigation to list, tree, and menu widgits.

## Required
- "jquery" from http://jquery.com/

## Usage

```
selectItem = keyboardNavigation ($container, options);
```

## Returns

a function which can be called to get or set the currently selected item

_Note: if applied to a native select element, the function returned only gets the currently selected item_. 

## Demo
http://www.mit.edu/~rjc/aria/keyboardNavigation/demo.html

## options:
- type: "tree", "list", or "menu"
- select: will track selection via aria-selected (not yet implemented)
- wrap: indicates that next / prev actions will cause wrap around (not yet implemented)
- keymap: object whose keys are actions, values are arrays of key specifiers
- actions: objects whose keys are action names, values are functions to call
+ defaults suitable for both lists and trees now implemented
