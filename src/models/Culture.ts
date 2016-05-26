class Culture{
    public constructor(private _code:string, private _description:string){}
    
    public get code():string{ return this._code; }
    public get description():string{ return this._description; }
}