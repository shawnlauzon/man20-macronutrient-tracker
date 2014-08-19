angular.module('man20-macnuttrk.controllers', [])

.controller('DashCtrl', function($scope, $ionicPopover, Macronutrients, User, FoodEaten, FoodChoices) {
  $scope.calendar = {
    phase: parseInt(window.localStorage['phase']) || 1,
    weekInPhase: parseInt(window.localStorage['weekInPhase']) || 1,
    isWorkoutDay: (window.localStorage['isWorkoutDay'] === 'true' ? true : false)
  };

  var stats = User.loadStats();
  var lbm = User.calculateLBM(stats);
  var maintenanceCalories = User.maintenanceCalories(stats);

  var foodEaten = FoodEaten.all();
  var foodChoices = FoodChoices.all();

  $scope.macnuts = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);
  $scope.totals = FoodEaten.totals(foodEaten, foodChoices);

  $scope.savePhase = function() {
    window.localStorage['phase'] = $scope.calendar.phase;
    $scope.phasePopover.hide();
  };
  $scope.saveWeek = function() {
    window.localStorage['weekInPhase'] = $scope.calendar.weekInPhase;
    $scope.weekPopover.hide();
  };
  $scope.saveIsWorkoutDay = function() {
    window.localStorage['isWorkoutDay'] = $scope.calendar.isWorkoutDay;
  };

  $scope.phases = [ 1, 2, 3, 4];
  $scope.weeks = [1, 2, 3, 4];

  $ionicPopover.fromTemplateUrl('change-phase-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.phasePopover = popover;
  });

 $ionicPopover.fromTemplateUrl('change-week-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.weekPopover = popover;
  });
})

.controller('FoodCtrl', function($scope, $ionicGesture, $ionicModal, $ionicPopup, User, FoodEaten, FoodChoices, Macronutrients) {
  $scope.foodChoices = FoodChoices.all();
  $scope.foodEaten = FoodEaten.all();
  $scope.foodEatenTotals = FoodEaten.totals($scope.foodEaten, $scope.foodChoices);

  $scope.calendar = {
    phase: parseInt(window.localStorage['phase']) || 1,
    weekInPhase: parseInt(window.localStorage['weekInPhase']) || 1,
    isWorkoutDay: (window.localStorage['isWorkoutDay'] === 'true' ? true : false)
  };
  var stats = User.loadStats();
  var lbm = User.calculateLBM(stats);
  var maintenanceCalories = User.maintenanceCalories(stats);
  $scope.target = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);

  $scope.scaleval = (document.documentElement.clientWidth - 20 - 60) /
      Math.max($scope.target.protein(), $scope.target.fat(), $scope.target.carbs())

  $scope.eatFood = function(name) {
    var value = $scope.foodEaten[name];
    if (!value) {
      value = {
        "servings": 0
      };
      $scope.foodEaten[name] = value;
    }
    value.servings = value.servings + 1;
    FoodEaten.save($scope.foodEaten);
  };

  $scope.addServing = function(name) {
    var food = $scope.foodEaten[name];
    food.servings = food.servings + 0.5;
    FoodEaten.save($scope.foodEaten);
  };
  $scope.removeServing = function(name) {
    var food = $scope.foodEaten[name];
    if (food.servings <= 0.5) {
      delete $scope.foodEaten[name];
    } else {
      food.servings = food.servings - 0.5;
    }
    FoodEaten.save($scope.foodEaten);
  };
  $scope.clearFood = function() {
    var confirm = $ionicPopup.confirm({
      title: 'Clear food',
      template: 'Are you sure you want to clear all food for today?'
    });
    confirm.then(function(okPressed) {
      if (okPressed) {
        $scope.foodEaten = FoodEaten.clear();
        $scope.foodEatenTotals = FoodEaten.totals($scope.foodEaten, $scope.foodChoices);
      }
    });
  };

  var foodModal;
  $scope.addFood = function() {
    $ionicModal.fromTemplateUrl('food-modal.html', {
      scope: $scope,
      focusFirstInput: true
    }).then(function(modal) {
      foodModal = modal;
      $scope.food = FoodChoices.newFoodChoice();
      $scope.modalFunction = 'Add';
      foodModal.show();
    });
  };

  var originalName;
  $scope.editFood = function(name) {
    originalName = name;
    $ionicModal.fromTemplateUrl('food-modal.html', {
      scope: $scope
    }).then(function(modal) {
      foodModal = modal;
      $scope.food = $scope.foodChoices[name];
      $scope.food.name = name;
      $scope.modalFunction = 'Update';
      foodModal.show();
    });
  };
  $scope.deleteFood = function(name) {
    var confirm = $ionicPopup.confirm({
      title: 'Delete food',
      template: 'Are you sure you want to delete ' + name + '?'
    });
    confirm.then(function(okPressed) {
      if (okPressed) {
        delete $scope.foodChoices[name];
        FoodChoices.save($scope.foodChoices);

        if ($scope.foodEaten[name]) {
          delete $scope.foodEaten[name];
          FoodEaten.save($scope.foodEaten);
        };
        foodModal.remove();
      }
    });
  }
  $scope.cancelFood = function() {
    foodModal.remove();
  }

  $scope.storeFood = function() {
    if (!$scope.food.name) {
      $ionicPopup.alert({
        title: 'Cannot add food',
        template: 'Please enter a name.'
      });
    } else {
      var foodName = $scope.food.name;

      // Remove the name property because that will be the key for our hash
      delete $scope.food.name;

      if (originalName != foodName) {
        // Name was changed; delete old references and replace with new
        delete $scope.foodChoices[originalName];

        var ateChanged = $scope.foodEaten[originalName];
        if (ateChanged) {
          delete $scope.foodEaten[originalName];
          $scope.foodEaten[foodName] = ateChanged;
          FoodEaten.save($scope.foodEaten);
        }
      }

      $scope.foodChoices[foodName] = $scope.food;
      FoodChoices.save($scope.foodChoices);

      foodModal.remove();
    }
  }
})

.controller('NewFoodCtrl', function($scope, $ionicPopover, $ionicPopup, FoodChoices) {
  $scope.food = FoodChoices.newFoodChoice();
  $scope.storeFood = function() {
    if ($scope.food.name) {
      // Only save if a name was entered
      var foodName = $scope.food.name;

      // Remove the name property because that will be the key for our hash
      delete $scope.food.name;

      var foodChoices = FoodChoices.all();
      foodChoices[foodName] = $scope.food;
      FoodChoices.save(foodChoices);

      var newFoodPopup = $ionicPopup.alert({
        title: "New food added",
        template: foodName
      });
      newFoodPopup.then(function(res) {
        // Reset for a new food entry
        $scope.food = FoodChoices.newFoodChoice();
      });
    }
  }
})

.controller('StatsCtrl', function($scope, User) {

  $scope.stats = User.loadStats();

  $scope.saveWeight = function() {
    window.localStorage['weight'] = $scope.stats.weight;
  };
  $scope.saveBodyFat = function() {
    window.localStorage['bodyFat'] = $scope.stats.bodyFat;
  };

  $scope.calculateLBM = User.calculateLBM;
  $scope.maintenanceCalories = User.maintenanceCalories;
});
