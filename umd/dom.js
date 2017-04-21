(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// DOM traversal

module.exports.nextSibling = nextSibling;
function nextSibling (node, selector = "*") {
selector = selector.trim();
while (node) {
node = node.nextSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // nextSibling

module.exports.previousSibling = previousSibling;
function previousSibling (node, selector = "*") {
selector = selector.trim();
//alert ("previousSibling: selector is " + selector);
while (node) {
node = node.previousSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // previousSibling

module.exports.firstChild = firstChild;
function firstChild (node) {
if (! node) return null;
node = node.firstChild;
if (! node) return null;
if (node.nodeType === 1) return node;
else return nextSibling(node);
} // firstChild

module.exports.lastChild = lastChild;
function lastChild (node) {
if (! node) return null;
node = node.lastChild;
if (! node) return null;
if (node && node.nodeType === 1) return node;
else return previousSibling(node);
} // firstChild

module.exports.nodeName = nodeName;
function nodeName (node) {
if (! node) return "";
if (! node.nodeName) {
throw Error ("bad node: " + JSON.stringify(node));
} // if
return node.nodeName.toLowerCase();
} // nodeName

module.exports.indexOf = indexOf;
function indexOf (node) {
var s, p = node.parentNode;
if (! node) return -1;
if (! p) return -1;
s = firstChild(p);
var i = 0;

while (s && s !== node) {
s = nextSibling(s);
i += 1;
} // while

return (s)? i : -1;
} // indexOf

module.exports.getAllNodes = getAllNodes;
function getAllNodes (nodes, selector = "*") {
selector = selector.trim();
return flatten (nodes)
.filter (node => node.matches(selector));

function flatten (node) {
if (length in node) {
node = Array.from(node);
return flatten(node[0]).concat(flatten(node.slice(1)));
} else {
if (! node || node.nodeType !== 1) return [];
return flatten(node.childNodes)
.concat(
nodeName(node) === "slot"? flatten(node.assignedNodes()) : [node]
);
} // if
} // flatten

} // getAllNodes

},{}]},{},[1])(1)
});