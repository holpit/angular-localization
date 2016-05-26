interface ILanguageService{
    currentCulture:Culture;
    setCurrent(culture:Culture);
    
    registeredCultures:Array<Culture>;
    
    getLabel(key:string):ng.IPromise<string>;
    getLabels(keys:Array<string>):ng.IPromise<Array<string>>;
}