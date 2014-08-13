angular.module('man20-macnuttrk.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('StatsCtrl', function($scope, User) {
  $scope.stats = User.stats;
  $scope.user = User;
});
