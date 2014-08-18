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

.controller('FoodCtrl', function($scope, $ionicModal, $ionicPopup, User, FoodEaten, FoodChoices, Macronutrients) {
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
    $scope.foodEaten = FoodEaten.clear();
    $scope.foodEatenTotals = FoodEaten.totals($scope.foodEaten, $scope.foodChoices);
  };

  var addFoodModal;
  $scope.showAddFoodModal = function() {
    $ionicModal.fromTemplateUrl('add-food-modal.html', {
      scope: $scope,
      focusFirstInput: true
    }).then(function(modal) {
      addFoodModal = modal;
      $scope.newFood = FoodChoices.newFoodChoice();
      addFoodModal.show();
    });
  }
  $scope.cancelAddFood = function() {
    addFoodModal.remove();
  }

  $scope.storeFood = function() {
    if (!$scope.newFood.name) {
      $ionicPopup.alert({
        title: 'Cannot add food',
        template: 'Please enter a name.'
      });
    } else {
      var foodName = $scope.newFood.name;

      // Remove the name property because that will be the key for our hash
      delete $scope.newFood.name;

      $scope.foodChoices[foodName] = $scope.newFood;
      FoodChoices.save($scope.foodChoices);

      addFoodModal.remove();
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
