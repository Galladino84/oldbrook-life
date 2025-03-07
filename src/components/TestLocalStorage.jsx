import React, { useEffect, useState } from "react";
import {
    saveData,
    loadData,
    removeData,
    creaCopiaTemporaneaGiocatore,
    modificaDatiTemporanei,
    validaDatiTemporanei,
    salvaDatiFinali,
    annullaModificheTemporanee
} from "../utils/localStorageUtils";
import { aggiornaStatisticheDaAttività, calcolaStatisticheFinali } from "../utils/statisticsUtils"; // ✅ Importazione aggiunta

// Simuliamo gli oggetti con bonus statistici
const oggettiConBonus = {
    "vgm001": { nome: "Felpa Goth", bonus_statistiche: { carisma: 3 } },
    "vgm002": { nome: "Giacca Rock", bonus_statistiche: { carisma: 2, resistenza: 1 } },
    "c001": { nome: "Energy Drink", bonus_statistiche: { resistenza: 2 } },
    "w001": { nome: "Spada Epica", bonus_statistiche: { carisma: 1, intelligenza: 3 } }
};

const TestLocalStorage = () => {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        console.clear();
        let storedPlayer = loadData("player_data");

        if (!storedPlayer) {
            console.log("⚠️ Nessun dato trovato, creazione nuovo profilo...");
            storedPlayer = {
                name: "Alex",
                percorso: "Nerd Videogiocatore",
                statistics: {
                    base: { carisma: 5, intelligenza: 6, resistenza: 4 },
                    modificate: { carisma: 0, intelligenza: 0, resistenza: 0 },
                    bonus_equipaggiamento: { carisma: 0, intelligenza: 0, resistenza: 0 },
                    finali: { carisma: 5, intelligenza: 6, resistenza: 4 }
                },
                inventario: {
                    equipaggiamento: {
                        testa: null, collo: null, torso: null,
                        gambe: null, scarpe: null, accessorio_1: null, accessorio_2: null, accessorio_3: null
                    },
                    possessi: [],
                    activity_room: { slot_1: null, slot_2: null, slot_3: null },
                    garage: { veicoli_posseduti: [], slot_tuning: [], veicolo_corrente: null },
                    consumabili: []
                }
            };
            saveData("player_data", storedPlayer);
        }

        setPlayer(storedPlayer);
    }, []);

    const handleEquipaggiaTorso = () => {
        if (!player) return;
        creaCopiaTemporaneaGiocatore();
        modificaDatiTemporanei("inventario.equipaggiamento.torso", "vgm001");

        if (validaDatiTemporanei()) {
            salvaDatiFinali();
            setTimeout(() => {
                let updatedPlayer = loadData("player_data");
                calcolaStatisticheFinali(updatedPlayer); // 🔄 Ricalcola le statistiche dopo il cambio
                setPlayer({ ...updatedPlayer });
            }, 100);
        } else {
            annullaModificheTemporanee();
        }
    };

    const handleAggiornaStatistiche = () => {
        aggiornaStatisticheDaAttività({ intelligenza: +2, resistenza: -1 });
        setTimeout(() => {
            setPlayer(loadData("player_data")); // 🔄 Forza il re-render
        }, 100);
    };

    const handleResetLocalStorage = () => {
        removeData("player_data");
        removeData("temp_player_data");
        console.log("🗑️ LocalStorage resettato!");
        setTimeout(() => {
            setPlayer(loadData("player_data")); // 🔄 Aggiorna lo stato
        }, 100);
    };

    return (
        <div>
            <h2>Test LocalStorage</h2>
            {!player ? (
                <p>⏳ Caricamento dati...</p>
            ) : (
                <div>
                    <h3>📊 Statistiche</h3>
                    <p>Carisma: {player.statistics?.finali?.carisma ?? 0} (Base: {player.statistics?.base?.carisma ?? 0} | Attività: {player.statistics?.modificate?.carisma ?? 0} | Equip: {player.statistics?.bonus_equipaggiamento?.carisma ?? 0})</p>
                    <p>Intelligenza: {player.statistics?.finali?.intelligenza ?? 0} (Base: {player.statistics?.base?.intelligenza ?? 0} | Attività: {player.statistics?.modificate?.intelligenza ?? 0} | Equip: {player.statistics?.bonus_equipaggiamento?.intelligenza ?? 0})</p>
                    <p>Resistenza: {player.statistics?.finali?.resistenza ?? 0} (Base: {player.statistics?.base?.resistenza ?? 0} | Attività: {player.statistics?.modificate?.resistenza ?? 0} | Equip: {player.statistics?.bonus_equipaggiamento?.resistenza ?? 0})</p>

                    <h3>🎽 Equipaggiamento</h3>
                    <p>Torso: {player.inventario.equipaggiamento.torso ? oggettiConBonus[player.inventario.equipaggiamento.torso]?.nome : "Nessun oggetto"}</p>

                    <button style={{ backgroundColor: "blue", color: "white" }} onClick={handleEquipaggiaTorso}>
                        🎽 Equipaggia Felpa Goth
                    </button>
                    
                    <button style={{ backgroundColor: "green", color: "white" }} onClick={handleAggiornaStatistiche}>
                        📈 Simula Attività
                    </button>

                    <button style={{ backgroundColor: "red", color: "white" }} onClick={annullaModificheTemporanee}>
                        ❌ Annulla Modifiche
                    </button>

                    <button style={{ backgroundColor: "orange", color: "black" }} onClick={handleResetLocalStorage}>
                        🗑️ Reset LocalStorage
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestLocalStorage;
