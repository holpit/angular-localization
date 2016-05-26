class LanguageService implements ILanguageService{
    private _selectedCulture:Culture;
    private _labels:any;
    
    constructor(private $q: ng.IQService, private $http:ng.IHttpService, 
                private _cultures:Array<Culture>, private _labelsUrl:string){
        this._cultures = this._cultures || new Array<Culture>();
        if(0 === this._cultures.length){
            this._cultures.push(new Culture('en-US', 'English'));
        }
        this._selectedCulture = this._cultures[0];
    }
    
    public get currentCulture():Culture{ 
        return this._selectedCulture; 
    }
    
    public get registeredCultures():Array<Culture>{
        return this._cultures;
    }
    
    public setCurrent(culture:Culture){
        this._selectedCulture = culture || this._cultures[0];
    }
    
    public getLabel(key:string):ng.IPromise<string>{
        let defer = this.$q.defer(),
            me = this;
        
        if(!this._labels || 0 === this._labels.length){
            this.loadLabels().then(function(){
                defer.resolve(me.getLabelText(key));
            });
        }else{
            defer.resolve(this.getLabelText(key));
        }
        
        return defer.promise;
    }
    
    public getLabels(keys:Array<string>):ng.IPromise<Array<string>>{
        let defer = this.$q.defer(),
            me = this,
            labels = new Array<string>();
            
        keys = keys || [];
        
        if(!this._labels || 0 === this._labels.length){
            this.loadLabels().then(function(){
                for(let i=0;i!=keys.length;++i){
                    labels.push(me.getLabelText(keys[i]));
                }
                defer.resolve(labels);
            });
        }else{
            for(let i=0;i!=keys.length;++i){
                labels.push(me.getLabelText(keys[i]));
            }
            defer.resolve(labels);
        }
        
        return defer.promise;
    }
    
    private loadLabels():ng.IPromise<any>{
        let me = this;
        
        return this.$http.get<any>(this._labelsUrl).then(function(response){
            if(!response || 200 != response.status || !response.data){
                return;
            }
            
            me._labels = {};
            
            let data = response.data;
            for(let code in data){
                me._labels[code] = data[code];
            }
        });
    }
    
    private getLabelText(key:string):string{
        if(!key || "" === key.trim()){
            return "";
        }
        
        let cultureLabels = this._labels[this._selectedCulture.code];
        if(!cultureLabels){
            return key;
        }
        return cultureLabels[key];
    }
}