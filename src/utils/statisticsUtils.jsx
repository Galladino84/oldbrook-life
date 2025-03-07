// src/utils/statisticsUtils.js

import { loadData, saveData } from "./localStorageUtils";
import { oggettiConBonus } from "./itemsData"; 

// 📌 Aggiorna le statistiche modificate dalle attività
export const aggiornaStatisticheDaAttività = (modifiche) => {
    let player = loadData("player_data");

    if (!player) {
        console.error("❌ Nessun giocatore trovato!");
        return false;
    }

    // Aggiungi un controllo per evitare errori in caso di proprietà undefined
    player.statistics = player.statistics || {};
    player.statistics.base = player.statistics.base || { carisma: 0, intelligenza: 0, resistenza: 0 };
    player.statistics.modificate = player.statistics.modificate || { carisma: 0, intelligenza: 0, resistenza: 0 };
    player.statistics.bonus_equipaggiamento = player.statistics.bonus_equipaggiamento || { carisma: 0, intelligenza: 0, resistenza: 0 };
    player.statistics.finali = player.statistics.finali || { carisma: 0, intelligenza: 0, resistenza: 0 };

    Object.keys(modifiche).forEach(stat => {
        if (player.statistics.modificate[stat] !== undefined) {
            player.statistics.modificate[stat] += modifiche[stat];
        }
    });

    calcolaStatisticheFinali(player);
    saveData("player_data", player);
    console.log("📊 Statistiche aggiornate dopo l'attività:", player.statistics);
    return true;
};

// 📌 Calcola il bonus degli equipaggiamenti
const calcolaBonusEquipaggiamento = (player) => {
    let bonus = { carisma: 0, intelligenza: 0, resistenza: 0 };

    Object.values(player.inventario.equipaggiamento).forEach(itemID => {
        if (itemID && oggettiConBonus[itemID]) {
            Object.keys(oggettiConBonus[itemID].bonus_statistiche).forEach(stat => {
                bonus[stat] += oggettiConBonus[itemID].bonus_statistiche[stat];
            });
        }
    });

    return bonus;
};

// 📌 Ricalcola le statistiche finali
export const calcolaStatisticheFinali = (player = null) => {
    if (!player) player = loadData("player_data");
    if (!player) return;

    // 1️⃣ Reset delle statistiche finali
    player.statistics.base = player.statistics.base || { carisma: 0, intelligenza: 0, resistenza: 0 };
    player.statistics.modificate = player.statistics.modificate || { carisma: 0, intelligenza: 0, resistenza: 0 };
    player.statistics.finali = player.statistics.finali || { carisma: 0, intelligenza: 0, resistenza: 0 };

    Object.keys(player.statistics.base).forEach(stat => {
        player.statistics.finali[stat] = 
            player.statistics.base[stat] + 
            player.statistics.modificate[stat];
    });

    // 2️⃣ Calcola il bonus dagli equipaggiamenti
    player.statistics.bonus_equipaggiamento = calcolaBonusEquipaggiamento(player);

    // 3️⃣ Aggiungi il bonus equipaggiamento alle statistiche finali
    Object.keys(player.statistics.bonus_equipaggiamento).forEach(stat => {
        player.statistics.finali[stat] += player.statistics.bonus_equipaggiamento[stat];
    });

    saveData("player_data", player);
    console.log("🔄 Statistiche finali ricalcolate:", player.statistics.finali);
};
