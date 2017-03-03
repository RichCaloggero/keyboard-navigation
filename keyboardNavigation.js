"use strict";
var xxx;

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
up: upLevel,
down: downLevel,
out: function () {}
} // actions
}; // defaultOptions

options = jQuery.extend ({}, defaultOptions, (options || {}));
options.keymap = processKeymap (options.keymap);
//debug ("keymap: ", options.keymap);
//debug ("applying to ", $containers.length, " containers");

$containers.each (function () {
var $container = $(this);
var name = $container[0].nodeName.toLowerCase();


if (name === "ul" || name === "div") {
if (name === "ul") $("ul", $container).addBack().css ("list-style-type", "none");
applyAria ($container, options.type);
current ($container, $container.children().first());

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

if (! actionName) {
alert ("no action for key " + key);
throw new Error ("no action for key " + key);
} // if

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
return $container.find ("[tabindex=0]");

} else {
$container.find("[tabindex=0]").removeAttr("tabindex");
$node.attr ({
tabindex: "0"
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

} // keyboardNavigation
