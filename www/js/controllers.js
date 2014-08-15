angular.module('man20-macnuttrk.controllers', [])

.controller('DashCtrl', function($scope, Macronutrients, User) {
  $scope.currentPhase = 1;
  $scope.currentWeekInPhase = 3;
  $scope.isWorkoutDay = true;
  
  var stats = User.loadStats();
  var lbm = User.calculateLBM(stats);
  var maintenanceCalories = User.maintenanceCalories(stats);
  
  $scope.macnuts = Macronutrients.forPhase($scope.currentPhase, lbm, maintenanceCalories, 
    $scope.currentWeekInPhase, $scope.isWorkoutDay);

  $scope.macnutsRemaining = Macronutrients.forPhase($scope.currentPhase, lbm, maintenanceCalories, 
    $scope.currentWeekInPhase, $scope.isWorkoutDay);
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
