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

/**
 * Initialize data for the user here
 */
.factory('User', function() {

  const defaultWeight = 170;
  const defaultPercentFat = 15.0;

  // Definine this outside the closure so maintenanceCalories() can access it
  var calculateLBM = function(stats) {
    return stats.weight * (100 - stats.percentBodyFat) / 100;
  };

  return {
    loadStats: function() {
      return {
        weight: parseInt(window.localStorage['weight']) || defaultWeight,
        percentBodyFat: parseFloat(window.localStorage['percentBodyFat']) || defaultPercentFat,
      }
    },
    storeStats: function(stats) {
      window.localStorage['weight'] = stats.weight;
      window.localStorage['percentBodyFat'] = stats.percentBodyFat;
    },
    calculateLBM: calculateLBM,
    maintenanceCalories: function(stats) {
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

      return calculateLBM(stats) * maintenanceCaloricIntake(stats);
    }
  }
});
