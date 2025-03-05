


export class User{

    constructor( public id : string , public email : string , private token : string, private scadenzaToken : number ){}

    getToken() : string | null {
        if( !this.scadenzaToken || this.scadenzaToken < new Date().getTime() ){ return null}
        else{ return this.token }
    }

    getScadenzaToken() : number { return this.scadenzaToken }
}
