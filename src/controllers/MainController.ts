class MainController{
    static $inject = ["$scope", "LanguageService"];
    
    public constructor(private $scope:any, private languageService:ILanguageService){
        let me = this;
        
        $scope.$watch( function () { return languageService.currentCulture; }, function (data:Culture) {
             console.log('culture changed to: ' + data.description);
             me.readLabels();
        }, true);
        
        this.readLabels();
    }
    
    private readLabels(){
        const labelKeys = [
                         'MAIN_TITLE', 'MAIN_DESCRIPTION'
                        ];
        let me = this;
         
        this.languageService.getLabels(labelKeys).then(function(results){
            me._title = results[0];
            me._description = results[1];
        });
    }
    
    private _title:String = '';
    public get title():String{ return this._title; }
    
    private _description:String = '';
    public get description():String{ return this._description; }
}
app.controller("MainController", MainController);