var user = 

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
})

.factory('Macronutrients', function() {
  return {
    forPhase: function(calendar, lbm, maintenanceCalories) {
      var protein = function() {
        switch (calendar.phase) {
          case 1:
            if (calendar.isWorkoutDay) {
              return 0.8 * lbm;
            } else {
              return 0.7 * lbm;
            }
          case 2:
            if (calendar.isWorkoutDay) {
              return lbm;
            } else {
              return 0.8 * lbm;
            }
          case 3:
            if (calendar.isWorkoutDay) {
              return 1.5 * lbm;
            } else {
              return 1.25 * lbm;
            }
          case 4:
            if (calendar.isWorkoutDay) {
              return 1.5 * lbm;
            } else {
              return lbm;
            }
        }
      };
      var carbs = function() {
        switch (calendar.phase) {
          case 1:
            if (calendar.weekInPhase === 1 || calendar.weekInPhase === 2) {
              if (calendar.isWorkoutDay) {
                return 30;
              } else {
                return 0;
              }
            } else if (calendar.weekInPhase === 3) {
              if (calendar.isWorkoutDay) {
                return 75;
              } else {
                return 0;
              }
            } else if (calendar.weekInPhase === 4) {
              if (calendar.isWorkoutDay) {
                return 100;
              } else {
                return 50;
              }
            }
          case 2:
           if (calendar.isWorkoutDay) {
              return 0.75 * lbm;
            } else {
              return 0.3 * lbm;
            }
          case 3:
           if (calendar.isWorkoutDay) {
              return lbm;
            } else {
              return 0.5 * lbm;
            }
          case 4:
           if (calendar.isWorkoutDay) {
              return lbm;
            } else {
              return 0.25 * lbm;
            }
        }
      };
      var fat = function() {
       switch (calendar.phase) {
          case 1:
            var goalCalories;
            if (calendar.isWorkoutDay) {
              goalCalories = maintenanceCalories - 300;
            } else {
              goalCalories = maintenanceCalories - 500;
            }
            return (goalCalories - (protein() * 4) - (carbs() * 4)) / 9;
          case 2:
            if (calendar.isWorkoutDay) {
              goalCalories = maintenanceCalories - 200;
            } else {
              goalCalories = maintenanceCalories - 600;
            }
            return (goalCalories - (protein() * 4) - (carbs() * 4)) / 9;
          case 3:
            if (calendar.isWorkoutDay) {
              goalCalories = maintenanceCalories + 400;
            } else {
              goalCalories = maintenanceCalories - 200;
            }
            return (goalCalories - (protein() * 4) - (carbs() * 4)) / 9;
          case 4:
            if (calendar.isWorkoutDay) {
              goalCalories = maintenanceCalories + 300;
            } else {
              goalCalories = maintenanceCalories - 400;
            }
            return (goalCalories - (protein() * 4) - (carbs() * 4)) / 9;
        }
      };
      return {
        protein: protein,
        fat: fat,
        carbs: carbs
      };
    }
  }
});

