// src/utils/localStorageUtils.js

// 💾 Salvataggio dei dati in LocalStorage
export const saveData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Dati salvati con successo! [Chiave: ${key}]`);
    } catch (error) {
        console.error("❌ Errore nel salvataggio:", error);
    }
};

// 📥 Caricamento dati da LocalStorage
export const loadData = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("❌ Errore nel caricamento:", error);
        return null;
    }
};

// 🗑️ Rimozione dati da LocalStorage
export const removeData = (key) => {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Dati rimossi con successo! [Chiave: ${key}]`);
    } catch (error) {
        console.error("❌ Errore nella rimozione:", error);
    }
};

// 📋 Creazione di una copia temporanea dei dati del giocatore
export const creaCopiaTemporaneaGiocatore = () => {
    let player = loadData("player_data");

    if (!player) {
        console.error("❌ Nessun giocatore trovato!");
        return false;
    }

    // Cloniamo i dati in modo sicuro
    const tempPlayer = JSON.parse(JSON.stringify(player));

    // Assicuriamoci che le statistiche siano presenti nella copia
    if (!tempPlayer.statistics) {
        tempPlayer.statistics = { carisma: 5, intelligenza: 5, resistenza: 5 };
    }

    saveData("temp_player_data", tempPlayer);
    console.log("📋 Copia temporanea creata con successo!");
    return true;
};

// ✍️ Modifica sicura dei dati temporanei, anche per chiavi nidificate
export const modificaDatiTemporanei = (chiave, valore) => {
    let tempPlayer = loadData("temp_player_data");

    if (!tempPlayer) {
        console.error("❌ Nessuna copia temporanea trovata!");
        return false;
    }

    // 🛠️ Naviga nella struttura dell'oggetto per modificare i dati correttamente
    const keys = chiave.split("."); // Es. "inventario.equipaggiamento.torso"
    let obj = tempPlayer;

    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]; // Naviga nella struttura
        if (!obj) {
            console.error(`❌ Chiave "${keys[i]}" non trovata in tempPlayer`);
            return false;
        }
    }

    const lastKey = keys[keys.length - 1];
    obj[lastKey] = valore; // Applica il valore alla chiave finale

    saveData("temp_player_data", tempPlayer);
    console.log(`✍️ Modifica applicata: ${chiave} →`, valore);
    return true;
};

// 🔍 Controllo di validità prima di salvare
export const validaDatiTemporanei = () => {
    let tempPlayer = loadData("temp_player_data");

    if (!tempPlayer) {
        console.error("❌ Nessuna copia temporanea per la validazione!");
        return false;
    }

    // Verifica che statistics sia definito
    if (!tempPlayer.statistics) {
        console.error("❌ Errore: Statistiche mancanti in temp_player_data!");
        return false;
    }

    console.log("✅ Dati temporanei validati con successo!");
    return true;
};

// 💾 Sincronizzazione definitiva
export const salvaDatiFinali = () => {
    let tempPlayer = loadData("temp_player_data");

    if (!tempPlayer || !validaDatiTemporanei()) {
        console.error("❌ Dati non validi, annullamento!");
        return false;
    }

    saveData("player_data", tempPlayer);
    removeData("temp_player_data");
    console.log("💾 Dati finali salvati con successo!");
    return true;
};

// ❌ Annulla modifiche temporanee
export const annullaModificheTemporanee = () => {
    removeData("temp_player_data");
    console.log("🔄 Modifiche annullate!");
};
