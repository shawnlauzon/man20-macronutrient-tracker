angular.module('man20-macnuttrk.directives', [])
.directive('mntHold', function($ionicGesture) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $ionicGesture.on('hold', function(event) {
        // Call the function specified with mnt-hold
        scope.$eval(attrs.mntHold);
      }, element);
    }
  }
});
