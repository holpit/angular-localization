interface ILanguageService{
    currentCulture:Culture;
    registeredCultures:Array<Culture>;
    setCurrent(culture:Culture);
    getLabel(key:string):ng.IPromise<string>;
    getLabels(keys:Array<string>):ng.IPromise<Array<string>>;
}