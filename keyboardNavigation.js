"use strict";

function keyboardNavigation ($container, options) {
var name = $container[0].nodeName.toLowerCase();
var defaultOptions = {
type: "list", // list, tree, or menu
selected: true,
wrap: false,

keymap: {
next: ["ArrowDown", "ArrowRight"],
prev: ["ArrowUp", "ArrowLeft"],
first: ["Home"],
last: ["End"]
}, // keymap

actions: {
next: nextItem,
prev: prevItem,
first: firstItem,
last: lastItem,

up: upLevel,
down: downLevel,
out: function () {}
} // actions
}; // defaultOptions

options = jQuery.extend ({}, defaultOptions, (options || {}));
options.keymap = processKeymap (options.keymap);
//debug ("keymap: ", options.keymap);
//debug ("applying to ", $containers.length, " containers");


if ($container.is ("ul, div")) {
if ($container.is ("ul")) $("ul", $container).addBack().css ("list-style-type", "none");
applyAria ($container, options.type);
current ();

//debug ("applying keyboard event handlers to ", $container.attr("role"));
$container.on ("keydown",
 "[role=option], [role=treeitem], [role=menuitem]",
function (e) {
var key = e.key || e.which || e.keyCode;
var actionName = options.keymap[key];
var action = options.actions[actionName]; // action

if (! key) {
alert ("invalid key: " + key);
throw new Error ("invalid key: " + key);
} // if

if (! action) return true;

e.stopImmediatePropagation();
e.stopPropagation();
e.preventDefault();
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
});
} // if

function performAction (action, e) {
var $newNode = action.call (e.target, e);
//debug ("new: ", $newNode.text());

if (!$newNode || !$newNode.length || $newNode[0] === e.target) return null;

current($newNode);
$newNode.focus ();
return $newNode;
} // performAction

function defineSelection ($node) {
if ($container.is ("select")) return;
if ($container.children().length === 0) $node = $container;
else if (! $node) $node = $container.children().first();
else if (!jQuery.contains ($container[0], $node[0])) $node = null;

current ($node);
} // defineSelection

function current ($node) {
//debug ("current: ", $container[0].nodeName, $container[0].id, $container.children().length, $node? $node[0].nodeName : null);
if ($container.is ("select")) return $container.find(":selected");

if (!$node) {
$node = $container.find ("[tabindex=0]");
if ($node.length === 0) $node = $container.children().first().attr("tabindex", "0");
return $node

} else {
$container.removeAttr("tabindex");
$container.children().removeAttr ("tabindex");
$node.attr ({tabindex: "0"});
$container.trigger ("change");
return $node;
} // if
} // current

/// changes


// create an observer instance
var observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
applyAria ($container, options.type);
current ();
}); // forEach Mutations

}); // new Observer

// pass in the target node, as well as the observer options
observer.observe($container[0], {childList: true});

// later, you can stop observing
//observer.disconnect();

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
var name, $groups, $branches, $hasChildren;

if (type === "list") {
$container.attr ("role", "listbox")
.children ().attr ({role: "option"});

} else if (type === "tree") {
name = $container[0].nodeName.toLowerCase();
$groups = $container.find (name).attr ("role", "group");
name = $container.children().first()[0].nodeName.toLowerCase();
$branches = $container.find (name).attr ("role", "treeitem");
$container.attr ("role", "tree");

// add aria-expanded to nodes only if they are not leaf nodes
$hasChildren = $branches.has("[role=group]");
$hasChildren.attr ("aria-expanded", "false");

} // if

} // applyAria

/// default actions
function nextItem () {
return $(this).next();
} // nextItem

function prevItem () {
return $(this).prev();
} // prevItem

function firstItem () {
return $(this).parent().children().first();
} // firstItem 

function lastItem () {
return $(this).parent().children().last();
} // lastItem 

function upLevel () {
var $root = $(this).parent().closest ("[role=tree]");
var $up = $(this).parent().closest("[role=treeitem]");
if (!$up || !$up.length || !jQuery.contains($root[0], $up[0])) return $(this);
return $up;
} // upLevel

function downLevel () {
var $down = $(this).find("[role=group]:first > [role=treeitem]:first");
if (!$down || !$down.length) return $(this);
return $down;
} // downLevel


/// API
return current;
} // keyboardNavigation

//alert ("keyboardNavigation.js loaded");
