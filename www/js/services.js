angular.module('man20-macnuttrk.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' },
    { id: 4, name: 'Shawn Lauzon' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('User', function() {
  var stats = {
    weight:         100,
    percentBodyFat: 6.0,

    lbm: function() {
      return stats.weight * (100 - stats.percentBodyFat) / 100;
    }
  };

   return {
    stats: stats,
    maintenanceCalories: function() {
      var maintenanceCaloricIntake = function() {
        if (stats.percentBodyFat <= 12) {
          return 17;
        } else if (stats.percentBodyFat <= 15) {
          return 16;
        } else if (stats.percentBodyFat <= 19) {
          return 15;
        } else if (stats.percentBodyFat <= 22) {
          return 14;
        } else {
          return 13;
        }
      }

      return stats.lbm() * maintenanceCaloricIntake();
    }
  }
});
