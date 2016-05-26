class LanguageController{
    
    static $inject = ["$scope", "LanguageService"];
    public constructor(private languageService:ILanguageService){
        this._cultures = languageService.registeredCultures;
    }
    
    private _cultures:Array<Culture> = null;
    public get cultures():Array<Culture> { return this._cultures; }
    
    public get currentCulture():Culture{
        return this.languageService.currentCulture;
    }
    public set currentCulture(val:Culture){
        console.log('setting culture to: ' + val.description);
        this.languageService.setCurrent(val);
    }
}
app.controller("LanguageController", LanguageController);