interface MatchInformation{
    index: number,
    token: string
}

interface TraceLifeMatch{
    activeTrace: boolean,
    currentTime: number,
    matchTime: number,
    lifeTime: number
}

const BASE_MATCH_TIME: number = 100; //ms
const BASE_LIFE_TIME: number = 10000; //ms

export class SingletonOffline{
    
    private static _instance: SingletonOffline = new SingletonOffline();
    private _listado: MatchInformation[] = [];
    private _timeInformation: TraceLifeMatch = {
        activeTrace: false,
        currentTime: 0,
        matchTime: BASE_MATCH_TIME,
        lifeTime: BASE_LIFE_TIME
    }

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
        SingletonOffline.getInstance()._timeInformation = {
            activeTrace: false,
            currentTime: 0,
            matchTime: SingletonOffline.getInstance()._timeInformation.matchTime,
            lifeTime: SingletonOffline.getInstance()._timeInformation.lifeTime
        }
    }

    public AddMatch(token: string, index: number){

        if(!SingletonOffline.getInstance()._timeInformation.activeTrace){
            this.SetTraceActiveTime();
        }

        SingletonOffline.getInstance()._listado.push({
            token,
            index
        });
    }

    public SetTraceActiveTime(active: boolean = true){
        SingletonOffline.getInstance()._timeInformation.activeTrace = active;
    }

    public AddTimeMatch(){
        if(SingletonOffline.getInstance()._timeInformation.activeTrace){
            SingletonOffline.getInstance()._timeInformation.currentTime += SingletonOffline.getInstance()._timeInformation.matchTime;
        }
    }

    public SetTimeMatch(time: number = BASE_MATCH_TIME){
        SingletonOffline.getInstance()._timeInformation.matchTime = time;
    }
    
    public SetLifeTime(time: number = BASE_LIFE_TIME){
        SingletonOffline.getInstance()._timeInformation.lifeTime = time;
    }
    public Matches(){
        return SingletonOffline.getInstance()._listado;
    }

    public TimeInformation(){
        return SingletonOffline.getInstance()._timeInformation;
    }
}