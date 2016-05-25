import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Locations } from '../../api/locations.js';
//import buttons from '../buttons/buttons.js';

import template from './dist.html';

class DistCtrl {
    constructor($scope) {
        //'ngInject';
        
        //$reactive(this).attach($scope);
        $scope.viewModel(this);
        var vm = this;
        
        this.name = "David";
        this.error = "";
        
        this.on = false;
        this.distSettings = {
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge: 0
        };
        
        this.compassOff = function() {
            
            navigator.geolocation.clearWatch(vm.watchID);
            vm.on = false;

        };
        this.compassOn = function() {
            if (navigator.geolocation) {
                    
                //watchPosition returns an ID for clearing it later
                vm.watchID = navigator.geolocation.watchPosition(
                        
                    //anonymous callback function to trigger a view change
                    function(locObj) {
                        Locations.insert({
                            name: vm.name,
                            geo: {
                                lat: locObj.coords.latitude,
                                long: locObj.coords.longitude
                            },
                            updated: new Date()
                        });
                              
                    }, function(err) { //Do the same if there's an error
                        vm.error = err.code + ": " + err.message;
                    }, vm.distSettings
                );            
            } else {
                return "Error!";
            }
            
            vm.on = true;
        };

        
        this.helpers({
            me() {
                if (Locations.findOne({name: vm.name}) && vm.on) {
                    return Locations.findOne({name: vm.name});
                } else {
                    return {
                        'name': vm.name, 
                        'geo': {
                            'lat': '...', 
                            'long': '...'
                        }
                    };
                }
            },
            locations() {
                return Locations.find({
                    'name': {
                        $ne: vm.name
                    }
                });
            }
            
            
        });

        /*this.computeDist = function(locObj) {
            //enclosed function to accept the geolocation object and update the display accordingly
            const EARTHRADIUS = 6371000; //Meters
            const HOMELAT = 44.940601, HOMELONG = -93.156662;
            var dist, lat0, long0;  
                     
            //Get the location coordinates
            lat0 = locObj.coords.latitude;
            long0 = locObj.coords.longitude;
        
            //Get the differences in lat and long and convert to radians
            var deltaLat = (HOMELAT - lat0) * Math.PI / 180;
            var deltaLong = (HOMELONG - long0) * Math.PI / 180;
        
            var a = 
                0.5 - Math.cos(deltaLat)/2 + 
                Math.cos(lat0 * Math.PI / 180) * Math.cos(HOMELAT * Math.PI / 180) * 
                (1 - Math.cos(deltaLong))/2;
            //Round the distance to 1 decimal point
            var dist = 
                (EARTHRADIUS * 2 * Math.asin( Math.sqrt(a) ) ).toFixed(1);
            //Add the units
            return dist + " m";
        };
        
        this.onError = (err) => {
            return "Error(" + err.code + "): " + err.message;
        };*/
    }
}

export default angular.module('dist', [
    angularMeteor
]).component('dist', {
    templateUrl: 'imports/components/dist/dist.html',
    controller: ['$scope', DistCtrl]
});