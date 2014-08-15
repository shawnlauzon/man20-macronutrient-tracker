angular.module('man20-macnuttrk.controllers', [])

.controller('DashCtrl', function($scope, $ionicPopover, Macronutrients, User) {
  $scope.calendar = {
    phase: 1,
    weekInPhase: 3,
    isWorkoutDay: true
  };
  $scope.phases = [ 1, 2, 3, 4];
  $scope.weeks = [1, 2, 3, 4];
  
  var stats = User.loadStats();
  var lbm = User.calculateLBM(stats);
  var maintenanceCalories = User.maintenanceCalories(stats);
  
  $scope.macnuts = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);

  $scope.macnutsRemaining = Macronutrients.forPhase($scope.calendar, lbm, maintenanceCalories);

  $ionicPopover.fromTemplateUrl('change-phase-popover.html', {
    scope: $scope,
  }).then(function(phasePopover) {
    $scope.phasePopover = phasePopover;
  });
  $scope.openPhasePopover = function($event) {
    $scope.phasePopover.show($event);
  };
  $scope.closePopover = function() {
    $scope.phasePopover.hide();
  };
  // Execute action on hide popover
  $scope.$on('phasePopover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('weekPopover.removed', function() {
    $scope.phasePopover.remove();
  });

 $ionicPopover.fromTemplateUrl('change-week-popover.html', {
    scope: $scope,
  }).then(function(weekPopover) {
    $scope.weekPopover = weekPopover;
  });
  $scope.openWeekPopover = function($event) {
    $scope.weekPopover.show($event);
  };
  $scope.closePopover = function() {
    $scope.weekPopover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.phasePopover.remove();
    $scope.weekPopover.remove();
  });
  // Execute action on hide popover
  $scope.$on('weekPopover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('weekPopover.removed', function() {
    $scope.weekPopover.remove();
  });
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('StatsCtrl', function($scope, User) {

  $scope.stats = User.loadStats();

  $scope.storeStats = User.storeStats;
  $scope.calculateLBM = User.calculateLBM;
  $scope.maintenanceCalories = User.maintenanceCalories;
});
