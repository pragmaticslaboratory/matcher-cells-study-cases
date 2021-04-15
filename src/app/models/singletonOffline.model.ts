interface MatchInformation{
    index: number,
    token: string
}

export class SingletonOffline{
    
    private static _instance: SingletonOffline = new SingletonOffline();
    private _listado: MatchInformation[] = [];

    private constructor()
    {
        if (SingletonOffline._instance) {
            return SingletonOffline._instance;
        }

        SingletonOffline._instance = this;
    }

    public static getInstance()
    {
        return this._instance || (this._instance = new this());
    }

    public Reset(){
        SingletonOffline.getInstance()._listado = [];
    }

    public AddMatch(token: string, index: number){
        SingletonOffline.getInstance()._listado.push({
            token,
            index
        });
    }

    public Matches(){
        return SingletonOffline.getInstance()._listado;
    }
}