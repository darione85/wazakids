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
        age_min:8,
        age_max:9,
        weight:["24","34","+34"]
    },{
        name:"ragazzi",
        age_min:10,
        age_max:11,
        weight:["30","42","+42"]
    },{
        name:"novizi",
        age_min:12,
        age_max:13,
        weight:["38","42","46","50","55","60","66","+66"]
    },
    {
        name:"esordienti",
        age_min:14,
        age_max:15,
        gender:"male",
        weight:["38","42","47","53","59","66","73","+73"]
    },
    {
        name:"esordienti",
        age_min:14,
        age_max:15,
        gender:"female",
        weight:["34","40","44","48","52","57","+57"]
    },{
        name:"cadetti",
        age_min:16,
        age_max:17,
        gender:"male",
        weight:["50","54","58","63","69","76","85"]
    },{
        name:"cadetti",
        age_min:16,
        age_max:17,
        gender:"female",
        weight:["43","49","56","60","65","+65"]
    }
];

    var exampleSubscriber = {
        active:0,
        name:"Nome atleta",
        surname:"Cognome atleta",
        mail:"e-Mail",
        societa:"-",
        figmma:15,
        age:0,
        categoria:"",
        peso_categoria:"",
        gender:"",
        weight:0,
        idpagamento:"id"
    };
    // create table iscritti(active integer,name varchar(20),surname varchar(20),mail varchar(30),societa varchar(20), figmma integer, age integer, categoria varchar(30),peso_categoria varchar(30), gender varchar(20),weight integer, idpagamento varchar(50));

    var ServerUrl = "http://directus.karuweb.it/api/1.1/";
    var CockpitServerUrl = "http://directus.karuweb.it/api/1.1/";
    var customServerUrl ="http://backend.wazakids.it/api/";

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

    function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }

    var guid = guid();


    return{

        guid:function(){
            return guid;
        },

        categorie:function () {
          return categorie;
        },

        exampleOfIscritto:function () {
            return exampleSubscriber;
        },

        getIscritti:function(url){
            return $http
                .get(buildCustomURL(url))
                .then(function (res) {
                    console.log(res)
                    return res.data;
                })
                .catch(function (res) {
                    return res.data;
                })
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

        getCustom:function (url) {
            return $http
                .get(buildCustomURL(url))
                .then(function (res) {
                    console.log(res)
                    return res.data;
                })
                .catch(function (res) {
                    return res.data;
                })
        },

        postToCustom:function(url,obj){
            console.log(buildCustomURL(url));

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
            if(arrayOfAthlete.length>=1){
                var obj={};
                obj.rows = arrayOfAthlete;
                return this.postToCustom('saveiscritti.php',obj);
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
            console.log(arrayOfAthlete);
            arrayOfAthlete.forEach(function(item){
                item.idpagamento = guid;
            })
            return this.saveCustom(arrayOfAthlete);
        }

    }




});

iscrizioneApp.controller('iscrizioneController',['$scope','iscrizioneService','$document','$element',function ($scope,iscrizioneService, $document,$element) {

    var jsonCategorie = iscrizioneService.categorie();
    $scope.jsonCategorie = iscrizioneService.categorie();

    $scope.currentStep = 1;

    $scope.variable={number:1};

    $scope.getNumber = function(num) {
        // if(num ==1)num+1
        return new Array(num);
    }

    $scope.getIscrittiByGuid = function(confirmGuid){
        iscrizioneService.getCustom("getiscritti.php?guid="+confirmGuid)
        .then(function(data){
            $scope.gotoStep(5);
            console.log(data);

            $scope.confirmedAthlete = data.iscritti;
        })
    }

    if(window.location.href.indexOf('guid')>-1){
        var url_string = window.location.href;
        var url = new URL(url_string);
        var confirmGuid = url.searchParams.get("guid");
        console.log(confirmGuid);
        console.log("vai a pagata o a controllare");
        $scope.getIscrittiByGuid(confirmGuid);

    }

    
    var exampleSubscriber = iscrizioneService.exampleOfIscritto();

    // iscrizioneService.save(exampleSubscriber);

    $scope.arrayIscritti = [];
    $scope.arrayIscritti.push(angular.copy(exampleSubscriber));

    $scope.buildArrayIscritti = function () {
        console.log("build array of iscritti: "+$scope.variable.number);
        $scope.arrayIscritti = [];
        for(var i = 0;i< $scope.variable.number;i++){
            $scope.arrayIscritti.push(angular.copy(exampleSubscriber));
        }
    };

    $scope.guid = iscrizioneService.guid();

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
        var categoriaSelected;
        $scope.arrayIscritti.forEach(function(iscritto){
        if(iscritto.age<= 11){
            
                jsonCategorie.forEach(function (categoria) {
                    if(iscritto.age >= categoria.age_min && iscritto.age <= categoria.age_max ){
                        iscritto.categoria = categoria.name;
                        categoriaSelected = categoria;
                    }
                })
                
                $scope.getCategoryClass(iscritto,categoriaSelected);
            
        }else{
            
                jsonCategorie.forEach(function (categoria) {
                    if(iscritto.age >= categoria.age_min && iscritto.age <= categoria.age_max && iscritto.gender == categoria.gender){
                        iscritto.categoria = categoria.name;
                        categoriaSelected = categoria;
                    }
                })
                
                $scope.getCategoryClass(iscritto,categoriaSelected);
            
        }
    })
        
        

        

    };

    $scope.getCategoryClass = function (iscritto,categoria) {

                var fPesoIscritto = parseFloat(iscritto.weight);
                categoria.weight.forEach(function (t,index,array) {
                    
                    var weight = parseFloat(t);

                    console.log(fPesoIscritto+":"+weight)
                    
                    
                    if( fPesoIscritto > weight && array[index+1]) {
                        iscritto.peso_categoria = array[index+1];
                    }else{
                        //iscritto.peso_categoria = t;
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
                console.log(data)
            })
            .catch(function (data) {
                console.log(data);
            })
    }

    $scope.filterCategoryByGender = function(iscritto){
        
        var array = [];

        for(cat in jsonCategorie){
            if(!jsonCategorie[cat].hasOwnProperty('gender')){
                array.push(jsonCategorie[cat])
            }else{
                if(jsonCategorie[cat].gender == iscritto.gender){
                    array.push(jsonCategorie[cat])
                }
            }
        }

        return array;
    }

    

    $scope.getCategoryListByGender = function(iscritto){
        console.log(iscritto)
        for(cat in jsonCategorie){
            if (jsonCategorie[cat].name == iscritto.categoria && jsonCategorie[cat].gender==iscritto.gender){
                console.log(jsonCategorie[cat])
                return jsonCategorie[cat].weight
                
            }
        }
    };

    $scope.getCategoryWeightList = function(iscritto){
        var array = $scope.filterCategoryByGender(iscritto)
        for(cat in array){
            if (array[cat].name == iscritto.categoria ){
                console.log("load weight")
                console.log(array[cat].weight)

                return array[cat].weight
                
            }
        }
    };

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
            name: "Conferma",
            template: "conferma.html"
        },
    ];


    // $scope.$on('$includeContentLoaded', function() {
    //     if($scope.currentStep == 4){
    //         var childFormController = $element.find('#paypalForm').eq(0).controller('form');
    //         console.log(childFormController);
    //         childFormController.$setPristine();
    //     }
    //
    //
    // });
    $scope.validateForms= function(){
        if($scope.arrayIscritti.length > 0){
            $scope.arrayIscritti.forEach(function(iscritto){

            })
        }
    };

    $scope.gotoStep = function(newStep) {
        if (newStep == 2)$scope.buildArrayIscritti();
        if (newStep == 3){
            //$scope.getCategory(); hard coded category
        }
        if (newStep == 4){
            console.log($scope.arrayIscritti);
        }
        

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

iscrizioneApp.component('paypalForm', {
    templateUrl: 'paypalForm.html',
    controller: function(iscrizioneService) {

        this.guid = iscrizioneService.guid();
    },
    bindings:{
        arrayIscritti:'<'
    }
});

iscrizioneApp.controller('admController',['$scope','iscrizioneService','$document','$element',function ($scope,iscrizioneService, $document,$element) {
    iscrizioneService.getIscritti('getiscritti.php').then(function(data){
        console.log(data);
        $scope.iscritti = data.iscritti;
    });
}]);