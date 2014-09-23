ng-warehouse v0.2.0 [![Build Status](https://travis-ci.org/teambition/ng-warehouse.svg)](https://travis-ci.org/teambition/ng-warehouse)
====
A data cache with events for AngularJS.

## DEMO

```js
angular.module('demoApp', ['data.warehouse'])
  .controller('DemoCtrl', ['$scope', 'warehouse', 'store2', function ($scope, warehouse, store2) {

    // use localStorage with [store2](http://github.com/nbubna/store)
    var articleCache = warehouse('users', store2);

    // or user memory cache
    var userCache = warehouse('users');

    $scope.userList = userCache.getAll();

    $scope.articleList = articleCache.getAll();

    userCache.bind($scope, 'add', function (userId, user) {
      $scope.userList.push(user);
    });

    articleCache.bind($scope, 'add', function (articleId, article) {
      $scope.articleList.push(article);
    });

    //...more

  }]);
```

## Installation

**Bower:**

    bower install ng-warehouse

```html
<script src="/pathTo/jsonkit/jsonkit.js"></script>
<script src="/pathTo/ng-warehouse/index.js"></script>
```

## API

```js
var cache = warehouse(namespace);
```

### warehouse(namespace)
### warehouse(namespace, store2)
### warehouse.getAll()
### cache.has(key)
### cache.get(key)
### cache.getAll()
### cache.set(key, value[, silent])
### cache.add(key, value[, silent])
### cache.remove(key[, silent])
### cache.bind(scope, type, listener)
### cache.destroy()
