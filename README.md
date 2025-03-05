
# Todo Firebase ✨
È una semplice applicazione di gestione di todo list, sviluppata con Angular v.19. utilizzando il **realtime database** e  l'**autenticazione**  di Firebase.

## Componenti 🛠️

### **Login:**
- Consente la registrazione o il login dell'utente

### **Task:**
- Mostra le task associate all'utente autenticato
- Permette di aggiungere, modificare o eliminare le task
- Protetto da un guard e caricato in lazy loading

## Service ⚙️

### **Auth:**
- Gestisce tutte le richieste relative all'autenticazione *( registrazione / login / logout / auto-login )*
- Implementa anche l'auto-logout tramite un timer che si attiva alla scadenza del token

### **Tasks:**
- Gestisce tutte le richieste CRUD per le task
- Il token delle richieste è inserito tramite interceptor

## Sicurezza 🔐 
Per motivi di sicurezza, l'ID e l'API key di Firebase sono stati rimossi dal codice.  
Puoi visualizzare l'implementazione, ma per il funzionamento è necessario fornirle.

## Styling 🎨
Il CSS è gestito tramite **Tailwind CSS**.
