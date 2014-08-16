angular.module('man20-macnuttrk.controllers', [])

.controller('DashCtrl', function($scope, $ionicPopover, Macronutrients, User) {
  $scope.calendar = {
    phase: parseInt(window.localStorage['phase']) || 1,
    weekInPhase: parseInt(window.localStorage['weekInPhase']) || 1,
    isWorkoutDay: function() {
      var isWorkoutDay = window.localStorage['isWorkoutDay'];
      if (isWorkoutDay === undefined) {
        return true;
      } else {
        return isWorkoutDay;
      }
    }()
  };
  $scope.phases = [ 1, 2, 3, 4];
  $scope.weeks = [1, 2, 3, 4];

  $scope.savePhase = function() {
    window.localStorage['phase'] = $scope.calendar.phase;
  };
  $scope.saveWeek = function() {
    window.localStorage['weekInPhase'] = $scope.calendar.weekInPhase;
  };
  $scope.saveIsWorkoutDay = function() {
    window.localStorage['isWorkoutDay'] = $scope.calendar.isWorkoutDay;
  };
  
  var stats = User.loadStats();
  var lbm = User.calculateLBM(stats);
  var maintenanceCalories = User.maintenanceCalories(stats);
  
  $scope.macnuts = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);

  $scope.macnutsRemaining = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);

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

.controller('FoodCtrl', function($scope, Food, FoodChoices) {
  $scope.foodChoices = FoodChoices.all();
})
.controller('NewFoodCtrl', function($scope, $ionicPopover, FoodChoices) {
  $scope.food = {
    "protein": 0,
    "fat": 0,
    "carbs": 0,
    "servingSize": 0,
    "servingSizeUnit": "grams"
  };
  $scope.storeFood = function() {
    FoodChoices.all().push($scope.food);
    window.localStorage['foodChoices'] = angular.toJson($scope.food);
  }

  $ionicPopover.fromTemplateUrl('change-serving-size-unit-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.servingSizeUnitPopover = popover;
  });

  $scope.servingSizeUnits = ['grams', 'mL', 'cup'];
})

.controller('StatsCtrl', function($scope, User) {

  $scope.stats = User.loadStats();

  $scope.storeStats = User.storeStats;
  $scope.calculateLBM = User.calculateLBM;
  $scope.maintenanceCalories = User.maintenanceCalories;
});
