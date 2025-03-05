


// Dati utente per body richieste login / register 
export type userData = {
    email : string,
    password : string,
    returnSecureToken : boolean
}

// Risposta richieste login / register firebase 
export type AuthResponse = {
    kind : string,
    idToken : string,
    email : string,
    refreshToken : string,
    expiresIn : number,
    localId : string,
    displayName?: string,
    registered?: boolean,
}

// Errore richieste http login / register firebase
export type ErrorResponseFirebase = {
    code : number,
    message : string,
    errors : { message : string, domain : string, reason : string }[],
}

// Singola task
export type task = {
    descrizione : string,
    completato : boolean
}

// Risposta richiesta allTask 
export type allTaskResponse = {
    [ id : string ] : task;
}


// Rappresenta un oggetto task 
export type taskItem = { 
    id: string,
    value : task,
}

// Rappresenta l'id univoco generato dal server per la task
export type addTaskResponse = { name : string }



