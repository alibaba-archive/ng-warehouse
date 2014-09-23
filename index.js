// **Github:** https://github.com/teambition/ng-warehouse
//
// **License:** MIT

/* global angular, JSONKit */

;(function (root, factory) {
  'use strict';

  angular.module('data.warehouse', [])
    .constant('JSONKit', JSONKit)
    .factory('warehouse', ['JSONKit', function (JSONKit) {
      var cache = {};

      function wrapKey(key) {
        return ':' + key;
      }

      function unwrapKey(key) {
        return key.slice(1);
      }

      function clone(value) {
        return (JSONKit.isArray(value) || JSONKit.isObject(value)) ? JSONKit.union(value) : value;
      }

      // 构造类 store2 的内存缓存
      function MemStore() {
        this._data = {};
      }

      MemStore.prototype.get = function (key) {
        return this._data[wrapKey(key)];
      };

      MemStore.prototype.getAll = function () {
        return this._data;
      };

      MemStore.prototype.has = function (key) {
        return this._data.hasOwnProperty(wrapKey(key));
      };

      MemStore.prototype.set = function (key, value) {
        this._data[wrapKey(key)] = value;
      };

      MemStore.prototype.remove = function (key) {
        delete this._data[wrapKey(key)];
      };

      function Matrix(namespace, store2) {
        this.namespace = unwrapKey(namespace);
        this._events = {};
        // 当提供了 store2 时则用之，否则用 MemStore
        this._store = store2 ? store2.namespace(namespace) : new MemStore();
      }

      Matrix.prototype.has = function (key) {
        return this._store.has(key);
      };

      Matrix.prototype.get = function (key) {
        return clone(this._store.get(key));
      };

      Matrix.prototype.getAll = function () {
        var result = [];
        JSONKit.each(this._store.getAll(), function (item) {
          result.push(clone(item));
        }, null, false);
        return result;
      };

      Matrix.prototype.set = function (key, value, silent) {
        var data = this._store.get(key);
        if (JSONKit.isEqual(data, value)) return this;
        try {
          data = JSONKit.union(data, value);
        } catch (e) {
          data = value;
        }
        this._store.set(key, data);
        if (silent) return this;
        value = clone(data);
        this.emit('change:' + key, key, value);
        this.emit('change', key, value);
        return this;
      };

      Matrix.prototype.add = function (key, value, silent) {
        if (this._store.has(key)) return this.set(key, value, silent);
        this._store.set(key, value);
        if (!silent) this.emit('add', key, clone(value));
        return this;
      };

      Matrix.prototype.bind = function (scope, type, listener) {
        var events = this._events;
        events[scope.$id] = events[scope.$id] || {};
        var listeners = events[scope.$id];

        JSONKit.each(type.split(' '), function (type) {
          listeners[type] = listeners[type] || [];
          listeners[type].push(listener);
        }, null, true);
        scope.$on('$destroy', function() {
          delete events[scope.$id];
        });
        return this;
      };

      Matrix.prototype.emit = function (type, key, value) {
        var ctx = this;
        JSONKit.each(this._events, function (listeners) {
          JSONKit.each(listeners[type], function (listener) {
            listener.call(ctx, key, value);
          }, null, true);
        }, null, false);
      };

      Matrix.prototype.remove = function (key, silent) {
        if (this._store.has(key)) {
          var data = this._store.get(key);
          this._store.remove(key);
          if (!silent) this.emit('remove', key, data);
        }
        return this;
      };

      Matrix.prototype.destroy = function () {
        this._events = this._store = null;
        delete cache[wrapKey(this.namespace)];
      };

      function warehouse(namespace, store) {
        namespace = wrapKey(namespace);
        cache[namespace] = cache[namespace] || new Matrix(namespace, store);
        return cache[namespace];
      }

      warehouse.getAll = function () {
        var result = {};
        JSONKit.each(cache, function (subCache, namespace) {
          result[namespace] = subCache._store.getAll();
        });
        return result;
      };

      warehouse.NAME = 'ng-warehouse';
      warehouse.VERSION = 'v0.2.0';
      return warehouse;
  }]);

}());
