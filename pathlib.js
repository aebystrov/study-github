"use strict";

module.exports = function () {
  var factory = function Path(path, name) {
    this.name = name;
    this.path = path;
  };
  
  return factory;
};