"use strict";

/**
 * @module pathlib
 * @param {JSON} spec - Спецификация узлов и атрибутов.
 * @returns {Factory} Возвращает функцию фабрику для создания объектов pathInArray.
 */
module.exports = function (spec) {

  return new Factory(spec);
};

/**
 * Фабрика объектов
 * @param {Object} spec - Спецификация пути. Содержимое файла spec.js
 * @returns {Function}
 * @constructor
 */
function Factory(spec) {

  let factory = function (path) {

    return new PathObject(spec, path);

  };

  factory.isValid = function (pathway) {
    return pathway in spec;
  };

  return factory;
}

function PathObject(spec, path) {
  this.spec = spec;
  this.path = path;

  Object.defineProperty(this, "length", {
    get: function () {
      return this.path.split(".").length;
    }
  });

  Object.defineProperty(this, "pathInArray", {
    get: function () {
      let value = "";
      //Проверка на тип пришедшего параметра
      if (Array.isArray(this.path)) {
        value = this.path;
      } else {
        value = [];
        let arr = this.path.split(".");

        // Запишет каждый узел в массив
        for (let i = 0; i < arr.length; i++) {
          let index = [];
          let name = [];

          // Парсит строку, отделяя имя узла и индекс по шаблону
          if (arr[i].match(/\[\d+\]/)) {
            index = arr[i].match(/\d+/);
            index = index[0];
            name = arr[i].replace(arr[i].match(/\[\d+\]/), "");
          } else {
            name = arr[i];
            index = null;
          }

          value.push({name: name, index: index});
        }
      }

      return value;
    }
  });

  this.toString = function () {
    return 'string';
  }
}


// /**
//  * Объект пути.
//  * @namespace
//  */
// let pathObject = {
//
//   /**
//    * @property {Array} pathInArray - Седержит массив узлов в виде объектов с
//    * именами и индексами множественности. Если множественность в спецификации
//    * не определена, то значение null.
//    */
//   get pathInArray() {
//     let value = "";
//
//     //Проверка на тип пришедшего параметра
//     if (Array.isArray(this.path)) {
//       value = this.path;
//     } else {
//       value = [];
//       let arr = this.path.split(".");
//
//       // Запишет каждый узел в массив
//       for (let i = 0; i < arr.length; i++) {
//         let index = [];
//         let name = [];
//
//         // Парсит строку, отделяя имя узла и индекс по шаблону
//         if (arr[i].match(/\[\d+\]/)) {
//           index = arr[i].match(/\d+/);
//           index = index[0];
//           name = arr[i].replace(arr[i].match(/\[\d+\]/), "");
//         } else {
//           name = arr[i];
//           index = null;
//         }
//
//         value.push({name: name, index: index});
//       }
//     }
//
//     // Инициализирует свойство объекта после обращения к нему
//     Object.defineProperty(this, "pathInArray", {
//       value: value,
//       writable: true, configurable: false
//     });
//
//     return value;
//   },
//
//   /**
//    * @property {Number} length - Сожержит количество элементов пути.
//    */
//   get length() {
//     let value = this.pathInArray.length;
//
//     // Инициализирует свойство объекта после обращения к нему
//     Object.defineProperty(this, "length", {
//       value: value,
//       writable: true, configurable: false
//     });
//
//     return value;
//   },
//
//   /**
//    * Строковое представление объекта pathInArray
//    * @returns {String} Возвращает путь в виде строки
//    */
//   toString: function () {
//     let arr = this.pathInArray.map(function (obj) {
//
//       return obj.name + (obj.index ? `[${obj.index}]` : "");
//     });
//
//     return arr.join(".");
//   },
//
//   /**
//    * Представление в виде массива.
//    * Выводит свойство pathInArray.
//    * @returns {Array}
//    */
//   toArray: function () {
//
//     return this.pathInArray;
//   },
//
//   /**
//    * Заполняет множественность в пути по данным спецификации.
//    * Не заполняет множественность если она уже указана в пути
//    * @param {String} value="0" Указывает символ заполнитель
//    * @returns {String} Возвращает строковое представление объекта
//    */
//   fillMultiple: function (value = "0") {
//     let arr = this.getMultiple();
//
//     for (let i = 0; i < arr.length; i++) {
//
//       if (!arr[i][1]) {
//         this.pathInArray[arr[i][0]].index = value;
//       }
//     }
//
//     return this.toString();
//   },
//
//   /**
//    * Удаляет множественность из пути по данным спецификации
//    * @param {Number|null} index|null Указывает из какого множественного элемента следует
//    * удалить множественность
//    * @returns {String} Возвращает строковое представление объекта
//    */
//   dropMultiple: function (index = null) {
//     let arr = this.getMultiple();
//
//     if (index === null) {
//       for (let i = 0; i < arr.length; i++) {
//         this.pathInArray[arr[i][0]].index = null;
//
//       }
//     } else if (index >= 0) {
//       this.pathInArray[arr[index][0]].index = null;
//
//     } else if (index < 0) {
//       for (let i = arr.length; i > 0; i--) {
//         this.pathInArray[arr[arr.length + index][0]].index = null;
//       }
//     }
//
//     return this.toString();
//   },
//
//   /**
//    * Возвращает массив индексов множественных узлов объекта и индексов узлов
//    * @returns {Array}
//    */
//   getMultiple: function () {
//     let arrNodes = [];
//     let arr = this.pathInArray;
//
//     /**
//      * Ищет совпадения имён объекта и спецификации.
//      */
//     for (let i = 0; i < arr.length; i++) {
//       for (let j = 0; j < Object.getOwnPropertyNames(this.spec).length; j++) {
//
//         let key = Object.getOwnPropertyNames(this.spec)[j];
//         let a = key.split(".").pop();
//         let b = arr[i].name;
//
//         if (a === b && this.spec[key].multiple) {
//           arrNodes.push([i, arr[i].index]);
//         }
//       }
//     }
//
//     return arrNodes;
//   },
//
//   /**
//    * Выполняет обход по пути от корневого элемента
//    * @param {Function} callback выполняется над каждым узлом или атрибутом
//    * Если функция callback возвращает false итерации останавливаются
//    * @returns {Number} Возвращает номер узла в объекте
//    */
//   each: function (callback) {
//     let count = 0;
//
//     for (let i = 0; i < this.pathInArray.length; i++) {
//       count += 1;
//       if (callback({name: this.pathInArray[i].name}) === false) break;
//     }
//
//     return count;
//   },
//
//   /**
//    * Выводит узлы пути с их индексами в столбик
//    * @returns {String}
//    */
//   inColumn: function () {
//     const arr = this.pathInArray;
//     let str = "";
//
//     for (let value of arr) {
//       str += !value.index ?  `${value.name}\n` : `${value.name}[${value.index}]\n`;
//     }
//
//     return str;
//   }
// };
