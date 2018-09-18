/**
 * Created by Dario Rubado on 29/05/18.
 */

var iscrizioneApp = angular.module('iscrizione',[]);

iscrizioneApp.service('iscrizioneService',function ($http) {
    // const client = new RemoteInstance({
    //     url: 'http://directus.karuweb.it/'
    //     // version: '1.1', // optional, only need to update if different from default
    //     // accessToken: [user-token] // optional, can be used without on public routes
    // });

    var categorie = [{
        name:"Pulcini",
        age_min:4,
        age_max:5,

    },{
        name:"bambini",
        age_min:6,
        age_max:7,

    },{
        name:"fanciulli",
        age_min:6,
        age_max:7,
        weight:[24,34,340]
    },{
        name:"ragazzi",
        age_min:10,
        age_max:11,
        weight:[30,42,420]
    },{
        name:"novizi",
        age_min:12,
        age_max:13,
        weight:["27","30","34","38","42","46","50","55","60","66","72","+72"]
    },
    {
        name:"esordienti",
        age_min:14,
        age_max:15,
        gender:"male",
        weight:["32","35","38","42","47","53","59","66","73","+73"]
    },
    {
        name:"esordienti",
        age_min:14,
        age_max:15,
        gender:"female",
        weight:["30","32","34","37","40","44","48","52","57","+57"]
    },{
        name:"cadetti",
        age_min:16,
        age_max:17,
        gender:"male",
        weight:["50","54","58","63","69","76+6"]
    },{
        name:"cadetti",
        age_min:16,
        age_max:17,
        gender:"female",
        weight:["36","40","46","52","56","60+6"]
    }];

    var exampleSubscriber = {
        active:1,
        name:"nome",
        surname:"cognome",
        mail:"pluto@pluto.it",
        società:"WAZA",
        figmma:15,
        age:15,
        categoria:"",
        peso_categoria:"",
        gender:"male",
        weight:65,
        idpagamento:"id"
    };
    // create table iscritti(active integer,name varchar(20),surname varchar(20),mail varchar(30),societa varchar(20), figmma integer, age integer, categoria varchar(30),peso_categoria varchar(30), gender varchar(20),weight integer, idpagamento varchar(50));

    var ServerUrl = "http://directus.karuweb.it/api/1.1/";
    var CockpitServerUrl = "http://directus.karuweb.it/api/1.1/";
    var customServerUrl ="http://backend.wazakids.it";

    function buildURL(url) {
        var ret = ServerUrl + url;
        return ret
    }

    function buildCockpitURL(url) {
        var ret = CockpitServerUrl + url;
        return ret
    }

    function buildCustomURL(url) {
        var ret = customServerUrl + url;
        return ret
    }

    return{

        categorie:function () {
          return categorie;
        },

        exampleOfIscritto:function () {
            return exampleSubscriber;
        },

        post:function (url,obj) {
            return $http
                .post(buildURL(url),obj)
                .then(function (res) {
                    return res.data;
                })
                .catch(function (res) {
                    return res.data;
                })
        },

        postToCockpit:function(url,obj){
            return $http
                .post(buildCockpitURL(url),obj)
                .then(function (res) {
                    return res.data;
                })
                .catch(function (res) {
                    return res.data;
                })
        },

        postToCustom:function(url,obj){
            return $http
                .post(buildCustomURL(url),obj)
                .then(function (res) {
                    return res.data;
                })
                .catch(function (res) {
                    return res.data;
                })
        },

        saveDirectus:function (arrayOfAthlete){

            if(arrayOfAthlete.length>1){
                var obj={};
                obj.rows = arrayOfAthlete;
                return this.post('tables/atleti/rows/bulk',obj);
            }else{
                return this.post('tables/atleti/rows',arrayOfAthlete[0]);
            }

            // {http://directus.karuweb.it/api/1.1/tables/atleti/rows
            //     "name":"dario",
            //     "surname":"ruba",
            //     "age":33,
            //     "active":"1",
            //     "status":1
            //
            // }


            // {"rows":[{http://directus.karuweb.it/api/1.1/tables/atleti/rows/bulk
            //     "name":"dario",
            //     "surname":"ruba",
            //     "age":33,
            //     "active":"1",
            //     "status":1
            //
            // },
            //     {
            //         "name":"pippo",
            //         "surname":"pluto",
            //         "age":33,
            //         "active":"1",
            //         "status":1
            //
            //     }]}

            // obj.active =1;

            // client.postApi('atleti', obj)
            //     .then(function (res) {
            //         console.log(res)
            //     })
            //     .catch(function (res) {
            //         console.log(res)
            //     });
        },

        saveCustom:function(arrayOfAthlete){
            if(arrayOfAthlete.length>1){
                var obj={};
                obj.rows = arrayOfAthlete;
                return this.postToCustom('?saveiscritti',obj);
            }else{
                return this.postToCustom('tables/atleti/rows',arrayOfAthlete[0]);
            }
        },
        saveCockpit:function (arrayOfAthlete) {
            if(arrayOfAthlete.length>1){
                var obj={};
                obj.rows = arrayOfAthlete;
                return this.postToCockpit('tables/atleti/rows/bulk',obj);
            }else{
                return this.postToCockpit('tables/atleti/rows',arrayOfAthlete[0]);
            }
        },

        save:function (arrayOfAthlete) {
            return this.saveDirectus(arrayOfAthlete);
        }

    }




});

iscrizioneApp.controller('iscrizioneController',['$scope','iscrizioneService',function ($scope,iscrizioneService) {

    var jsonCategorie = iscrizioneService.categorie();

    $scope.currentStep = 1;

    $scope.number =1;

    $scope.getNumber = function(num) {
        // if(num ==1)num+1
        return new Array(num);
    }

    var exampleSubscriber = iscrizioneService.exampleOfIscritto();

    // iscrizioneService.save(exampleSubscriber);

    $scope.arrayIscritti = [];
    $scope.arrayIscritti.push(angular.copy(exampleSubscriber));

    $scope.buildArrayIscritti = function () {
        $scope.arrayIscritti = [];
        for(var i = 0;i<= $scope.number;i++){
            $scope.arrayIscritti.push(angular.copy(exampleSubscriber));
        }
    };

    $scope.sum = function () {
        var toPay=0;
        $scope.arrayIscritti.forEach(function (t) {
            if(t.figmma){
                toPay= toPay+parseInt(t.figmma);
            }
        })
        return toPay;
    };

    $scope.translateFigmma = function (num) {
        return (parseInt(num) == 15)?"non iscritto Figmma":"Iscritto Figmma";
    };

    $scope.getCategory = function (iscritto) {
        jsonCategorie.forEach(function (categoria) {
            if(iscritto.age >= categoria.age_min && iscritto.age <= categoria.age_max && iscritto.gender == categoria.gender) iscritto.categoria = categoria.name;
        })
        $scope.getCategoryClass(iscritto);

    };

    $scope.getCategoryClass = function (iscritto) {
        jsonCategorie.forEach(function (categoria) {
            if (iscritto.categoria == categoria.name && iscritto.gender == categoria.gender){
                categoria.weight.forEach(function (t,index,array) {
                    if (t.indexOf("+")){
                        var weight = parseInt(t.split('+')[0])+parseInt(t.split('+')[1]);
                    }else{
                        var weight = parseInt(t.weight);
                    }
                    if(parseFloat(iscritto.weight)< weight) iscritto.weightClass = t;
                })
            }
        })
    };

    $scope.listOfAthlete = function () {
        var list="";
        $scope.arrayIscritti.forEach(function (t) {
            list += t.name+"_"+t.surname+";"
        })
        return list;
    };

    $scope.save= function () {
        iscrizioneService.save($scope.arrayIscritti)
            .then(function (data) {
                console.log(data);
            })
            .catch(function (data) {
                console.log(data);
            })
    }

    $scope.steps = [
        {
            step: 1,
            name: "inposta numero atleti",
            template: "number_athlete.html"
        },
        {
            step: 2,
            name: "inserisci i dati per ogni atleta",
            template: "basic_info.html"
        },
        {
            step: 3,
            name: "riepilogo dati",
            template: "riepilogo.html"
        },
        {
            step: 4,
            name: "Paga",
            template: "paga.html"
        },
        {
            step: 5,
            name: "Chart",
            template: "apps/webgis/js/component/laminazione/step/chart.html"
        },
    ];


    $scope.gotoStep = function(newStep) {
        $scope.currentStep = newStep;
    }

    $scope.getStepTemplate = function(){
        for (var i = 0; i < $scope.steps.length; i++) {
            if ($scope.currentStep == $scope.steps[i].step) {
                return $scope.steps[i].template;
            }
        }
    }

}]);

