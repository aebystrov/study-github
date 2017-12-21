"use strict";

module.exports = function (spec) {

  return new Factory(spec);
};

function Factory(spec) {
  let factory = function (path) {
    return true;
  };

  factory.isValid =  function (path) {
    return path in spec;
  };
  return factory;
}