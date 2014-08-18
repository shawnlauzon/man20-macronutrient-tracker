// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'man20-macnuttrk' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'man20-macnuttrk.services' is found in services.js
// 'man20-macnuttrk.controllers' is found in controllers.js
angular.module('man20-macnuttrk', ['ionic', 'man20-macnuttrk.controllers', 'man20-macnuttrk.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var ad_units = {
      ios : {
          banner: 'ca-app-pub-2360299152800609/4898689976',
          interstitial: 'ca-app-pub-2360299152800609/7572954779'
      },
      android : {
          banner: 'ca-app-pub-2360299152800609/9468490376',
          interstitial: 'ca-app-pub-2360299152800609/1945223578'
      }
    };

    // select the right Ad Id according to platform
    var admobId = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
    
    /** To dispable ads, comment this off, plus remove .has-ad class in style.css */
    if (AdMob) {
      var defaultOptions = {
        // publisherId: admobid.banner,
        // interstitialAdId: admobid.interstitial,
        // adSize: 'SMART_BANNER',
        // width: integer, // valid when set adSize 'CUSTOM'
        // height: integer, // valid when set adSize 'CUSTOM'
        position: AdMob.AD_POSITION.POS_XY,
        x: 0,    // valid when set position to AdMob.AD_POSITION.POS_XY
        y: 20,    // valid when set position to AdMob.AD_POSITION.POS_XY
        isTesting: false, // false by default, set to true, to receiving test ad for testing purpose
        // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
      };
      AdMob.setOptions(defaultOptions);
      // registerAdEvents();
    
      // display the banner at startup
      AdMob.createBanner(admobId.banner);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.food', {
      url: '/food',
      views: {
        'tab-food': {
          templateUrl: 'templates/tab-food.html',
          controller: 'FoodCtrl'
        }
      }
    })
    .state('tab.new-food', {
      url: '/food/new',
      views: {
        'tab-food': {
          templateUrl: 'templates/new-food.html',
          controller: 'NewFoodCtrl'
        }
      }
    })

    .state('tab.stats', {
      url: '/stats',
      views: {
        'tab-stats': {
          templateUrl: 'templates/tab-stats.html',
          controller: 'StatsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

