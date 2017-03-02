"use strict";

function keyboardNavigation ($containers, options) {
var defaultOptions = {
type: "list", // list, tree, or menu

keymap: {
next: ["ArrowDown", "ArrowRight"],
prev: ["ArrowUp", "ArrowLeft"],
first: ["Home"],
last: ["End"]
}, // keymap

actions: {
next: nextItem,
prev: prevItem,
first: function () {},
last: function () {},
up: function () {},
down: function () {},
out: function () {}
} // actions
}; // defaultOptions
options = jQuery.extend (defaultOptions, (options || {}));
options.keymap = processKeymap (options.keymap);
//debug ("keymap: ", options.keymap);

$containers.each (function () {
var $container = $(this);
var name = $container[0].nodeName.toLowerCase();


if (name === "ul" || name === "div") {
$container.children().attr ({
tabindex: "-1"
});
applyAria ($container, options.type);
current ($container, $container.children().first());

$container.on ("keydown", "[role=option], li, span", function (e) {
var action = options.actions[
options.keymap[e.key]
]; // action
//debug ("key: ", e.key);
if (! action) return true;

if (action instanceof Function) {
//debug ("- call function");
performAction (action, e);
} else if (typeof(action) === "string") {
//debug ("- fire event ", action);
$(e.target).trigger (action);
} else {
alert ("invalid type: " + action);
return true;
} // if

return false;
}); // on
} // if

function performAction (action, e) {
var $newNode = action.call (e.target, e);
//debug ("new: ", $newNode.text());

if (!$newNode || !$newNode.length || $newNode[0] === e.target) return null;

current($container, $newNode);
$newNode.focus ();
return $newNode;
} // performAction

function current ($container, $node) {
if (!$node || !$node.length) {
return $container.find ("[aria-selected=true], [tabindex=0]");

} else {
$container.find("[aria-selected=true], [tabindex=0]").attr("tabindex", "-1").removeAttr ("aria-selected");
$node.attr ({
"aria-selected": "true", tabindex: "0"
});
return $node;
} // if
} // current

}); // each $containers

function processKeymap (_keymap) {
var keymap = {};
for (var action in _keymap) {
//debug ("- action: ", action);

for (var key of _keymap[action]) {
//debug ("- key: ", key);
keymap[key] = action;
} // for
} // for

return keymap;
} // processKeymap

function applyAria ($container, type) {
var name;

if (type === "list") {
$container.attr ("role", "listbox")
.children ().attr ({role: "option", tabindex: "-1"});

} else if (type === "tree") {
name = $container[0].nodeName.toLowerCase();
$container.find (name).attr ("role", "group");
name = $container.children().first()[0].nodeName.toLowerCase();
$container.find (name).attr ("role", "treeitem");
$container.find ("[role=treeitem] > [role=group]").attr ("aria-expanded", "false");
$container.attr ("role", "tree");

} // if

} // applyAria

/// default actions
function nextItem () {
return $(this).next();
} // nextItem

function prevItem () {
return $(this).prev();
} // prevItem

} // keyboardNavigation
