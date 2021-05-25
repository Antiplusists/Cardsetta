import User from "../../entities/User";
import {deleteCookie, getCookie, setCookie} from "../../helpers/cookieHelpers";
import {ApiPaths} from "./ApiAuthorizationConstants";

export enum OperationResponse {
    Success,
    InvalidData,
    ServerError
}

class AuthorizeService {
    private static tokenCookieName = "access_token";
    
    private _user: User | null = null;
    private _callbacks: { callback: ()=> void, subscription: number }[] = [];
    private _nextSubscriptionId: number = 0;
    
    constructor() {
        const token = getCookie(AuthorizeService.tokenCookieName);
        if (!token) return;
        const jwtPlayload = AuthorizeService.parseJwtPlayload(token);
        this.updateStateInternal(jwtPlayload.sub);
    }
    
    addAuthorizationHeader(data: RequestInit) {
        let token = getCookie(AuthorizeService.tokenCookieName);
        if (!token) return false;
        
        data.headers = {
            ...data.headers,
            Authorization: 'Bearer ' + token
        }
        return true;
    }
    
    getUser() {
        return this._user;
    }
    
    isAuthenticated() {
        // let reqData: RequestInit = {
        //     method: 'POST'
        // }
        // if (!this.addAuthorizationHeader(reqData))
        //     return false;
        //
        // let response = await fetch(ApiPaths.auth.isAuth, reqData);
        //
        // return response.ok;
        
        return !!getCookie(AuthorizeService.tokenCookieName);
    }
    
    async login(credentials: FormData) {
        let response = await fetch(ApiPaths.auth.login, {
            method: "POST",
            credentials: "include",
            body: credentials
        });
        
        switch (response.status) {
            case 200: {
                let respObj = await response.json();
                
                let playload = AuthorizeService.parseJwtPlayload(respObj.accessToken);
                
                setCookie(AuthorizeService.tokenCookieName, respObj.accessToken, playload.exp - playload.nbf);
                let user = await (await fetch(ApiPaths.users.byId(playload.sub))).json() as User;
                this.updateState(user);
                
                return OperationResponse.Success;
            }
            case 422: return OperationResponse.InvalidData;
            default: return OperationResponse.ServerError
        }
    }
    
    async register(credentials: FormData) {
        let response = await fetch(ApiPaths.auth.register, {
            method: "POST",
            credentials: "include",
            body: credentials
        });
        
        switch (response.status) {
            case 200: {
                let respObj = await response.json();
                
                let playload = AuthorizeService.parseJwtPlayload(respObj.accessToken);
                
                setCookie(AuthorizeService.tokenCookieName, respObj.accessToken, playload.exp - playload.nbf);
                let user = await (await fetch(ApiPaths.users.byId(playload.sub))).json()
                this.updateState(user);
                
                return OperationResponse.Success;
            }
            case 422: return OperationResponse.InvalidData;
            default: return OperationResponse.ServerError;
        }
    }
    
    logout() {
        deleteCookie(AuthorizeService.tokenCookieName);
        this.updateState(null);
    }

    private async updateStateInternal(userId: string) {
        const response = await fetch(ApiPaths.users.byId(userId));
        this.updateState(await response.json());
    }
    
    updateState(user: User | null) {
        this._user = user;
        this.notifySubscribers();
    }
    
    notifySubscribers() {
        for (let i = 0; i < this._callbacks.length; i++) {
            const callback = this._callbacks[i].callback;
            callback();
        }
    }
    
    subscribe(callback: () => void) {
        this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
        return this._nextSubscriptionId - 1;
    }

    unsubscribe(subscriptionId: number | undefined) {
        const subscriptionIndex = this._callbacks
            .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
            .filter(element => element.found);
        if (subscriptionIndex.length !== 1) {
            throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
        }
        
        this._callbacks.splice(subscriptionIndex[0].index as number, 1);
    }
    
    private static parseJwtPlayload(jwt: string): JwtPlayload {
        let playloadInBase64 = jwt.split('.')[1];
        return  JSON.parse(atob(playloadInBase64));
    }
}

const authService = new AuthorizeService();

export default authService;

interface JwtPlayload {
    sub: string,
    unique_name: string,
    nbf: number,
    exp: number,
    iss: string
}