import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { saveData, loadData } from '../utils/localStorageUtils';

const strumentiMusicali = {
  Goth: { maschio: ["Chitarra", "Basso"], femmina: ["Voce", "Tastiera"] },
  Metallaro: { maschio: ["Chitarra", "Batteria"], femmina: ["Voce", "Basso"] }
};

const ruoliSportivi = {
  maschio: ["Guardia", "Ala Grande", "Ala Piccola", "Playmaker", "Centro"],
  femmina: ["Schiacciatrice", "Alzatrice", "Libero", "Centrale", "Opposto"]
};

const opzioniTabboz = ["Vocalist", "DJ"];

const avatarDisponibili = {
  Goth: { maschio: ["goth/maschio_avatar1.png"], femmina: ["goth/femmina_avatar1.png"] },
  Metallaro: { maschio: ["metallaro/maschio_avatar1.png"], femmina: ["metallaro/femmina_avatar1.png"] },
  Nerd: { maschio: ["nerd/maschio_avatar1.png"], femmina: ["nerd/femmina_avatar1.png"] },
  Tabboz: { maschio: ["tabboz/maschio_avatar1.png"], femmina: ["tabboz/femmina_avatar1.png"] },
  Sportivo: { maschio: ["sportivo/maschio_avatar1.png"], femmina: ["sportivo/femmina_avatar1.png"] }
};

const defaultPlayerData = {
  anagrafica: { nome: "", cognome: "", sesso: "", orientamento: "" },
  percorso: "",
  avatar: { selezionato: "avatar_generico.png" },
  extra: {},
  statistiche: {
    carisma: 5,
    intelligenza: 5,
    resistenza: 5,
    status: 3,
    soldi: 100
  },
  famiglia: { padre: "", madre: "", fratello: "" },
  inventario: {
    equipaggiamento: {
      testa: null,
      collo: null,
      torso: null,
      gambe: null,
      scarpe: null,
      accessorio_1: null,
      accessorio_2: null,
      accessorio_3: null
    },
    consumabili: []
  }
};

const CharacterCreation = () => {
  const [playerData, setPlayerData] = useState(() => loadData("player_data") || defaultPlayerData);
  const [equipaggiamentoIniziale, setEquipaggiamentoIniziale] = useState(null);

  useEffect(() => {
    saveData("player_data", playerData);
  }, [playerData]);

  // **🟢 Avatar Dinamico**
  useEffect(() => {
    if (playerData.percorso && playerData.anagrafica.sesso) {
      const avatarOptions = avatarDisponibili[playerData.percorso]?.[playerData.anagrafica.sesso] || [];
      setPlayerData(prev => ({
        ...prev,
        avatar: { selezionato: avatarOptions.length > 0 ? avatarOptions[0] : "avatar_generico.png" }
      }));
    }
  }, [playerData.percorso, playerData.anagrafica.sesso]);

  // **Caricamento equipaggiamento iniziale dal file JSON**
  useEffect(() => {
    if (playerData.percorso && playerData.anagrafica.sesso) {
      fetch(`${process.env.PUBLIC_URL}/data/equipaggiamento_iniziale.json`)
        .then(response => response.json())
        .then(data => {
          const equipaggiamentoIniziale = data[playerData.percorso]?.[playerData.anagrafica.sesso] || [];
          setEquipaggiamentoIniziale(equipaggiamentoIniziale);

          // Assegna gli oggetti iniziali all'inventario e equipaggiali
          const updatedEquipaggiamento = { ...playerData.inventario.equipaggiamento };

          equipaggiamentoIniziale.forEach(oggetto => {
            updatedEquipaggiamento[oggetto.slot] = { ...oggetto, equipaggiato: true };
          });

          setPlayerData(prev => ({
            ...prev,
            inventario: {
              ...prev.inventario,
              equipaggiamento: updatedEquipaggiamento
            }
          }));
        })
        .catch(error => console.error("Errore nel caricamento dell'equipaggiamento iniziale:", error));
    }
  }, [playerData.percorso, playerData.anagrafica.sesso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      anagrafica: { ...prev.anagrafica, [name]: value }
    }));
  };

  const handlePercorsoChange = (e) => {
    setPlayerData(prev => ({
      ...prev,
      percorso: e.target.value,
      extra: {}
    }));
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      extra: { ...prev.extra, [name]: value || "" }
    }));
  };

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={4} className="border-end">
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Anteprima Personaggio</Card.Title>
              <h4>{playerData.anagrafica.nome || "Nome"} {playerData.anagrafica.cognome || "Cognome"}</h4>
              <img src={process.env.PUBLIC_URL + "/assets/avatar/" + playerData.avatar.selezionato} alt="Avatar" className="img-fluid" />

              {/* Selezione Avatar */}
              <h5 className="mt-3">Seleziona Avatar</h5>
              <div className="d-flex justify-content-center">
                {avatarDisponibili[playerData.percorso]?.[playerData.anagrafica.sesso]?.map((avatar, index) => (
                  <div key={index} className="text-center mx-2">
                    <Form.Check
                      type="radio"
                      name="avatar"
                      value={avatar}
                      checked={playerData.avatar.selezionato === avatar}
                      onChange={(e) => setPlayerData(prev => ({
                        ...prev,
                        avatar: { selezionato: e.target.value }
                      }))}
                      className="d-none"
                      id={`avatar-${index}`}
                    />
                    <label htmlFor={`avatar-${index}`}>
                      <img
                        src={process.env.PUBLIC_URL + "/assets/avatar/" + avatar}
                        alt={`Avatar ${index + 1}`}
                        className={`img-thumbnail avatar-option ${playerData.avatar.selezionato === avatar ? "selected-avatar" : ""}`}
                        style={{ width: "60px", height: "60px", cursor: "pointer" }}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Visualizzazione Equipaggiamento */}
              <h5 className="mt-3">Equipaggiamento</h5>
              <ul className="list-unstyled">
                {playerData.inventario.equipaggiamento && Object.entries(playerData.inventario.equipaggiamento).map(([slot, oggetto], index) => (
                  oggetto ? (
                    <li key={index}><strong>{slot}:</strong> {oggetto.nome}</li>
                  ) : null
                ))}
              </ul>

              {/* **Visualizzazione Statistiche** */}
              {playerData.statistiche && (
                <div>
                  <h5 className="mt-3">Statistiche</h5>
                  <ul className="list-unstyled">
                    <li><strong>Status:</strong> {playerData.statistiche.status}</li>
                    <li><strong>✨ Carisma:</strong> {playerData.statistiche.carisma}</li>
                    <li><strong>🧠 Intelligenza:</strong> {playerData.statistiche.intelligenza}</li>
                    <li><strong>🎸 Maestria:</strong> {playerData.statistiche.maestria}</li>
                    <li><strong>💰 Soldi:</strong> {playerData.statistiche.soldi}</li>
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Form>
            <Form.Group><Form.Label>Nome:</Form.Label><Form.Control type="text" name="nome" value={playerData.anagrafica.nome} onChange={handleChange} required /></Form.Group>
            <Form.Group><Form.Label>Cognome:</Form.Label><Form.Control type="text" name="cognome" value={playerData.anagrafica.cognome} onChange={handleChange} required /></Form.Group>
            <Form.Group><Form.Label>Sesso:</Form.Label><Form.Select name="sesso" value={playerData.anagrafica.sesso} onChange={handleChange} required>
              <option value="">Seleziona</option><option value="maschio">Maschio</option><option value="femmina">Femmina</option></Form.Select></Form.Group>

            <Form.Group><Form.Label>Percorso:</Form.Label><Form.Select name="percorso" value={playerData.percorso} onChange={handlePercorsoChange} required>
              <option value="">Seleziona</option><option value="Goth">Goth</option><option value="Metallaro">Metallaro</option><option value="Nerd">Nerd</option><option value="Tabboz">Tabboz</option><option value="Sportivo">Sportivo</option></Form.Select></Form.Group>

            {/* Campi condizionali */}
            {["Goth", "Metallaro"].includes(playerData.percorso) && (
              <Form.Group><Form.Label>Strumento Musicale:</Form.Label><Form.Select name="strumento" value={playerData.extra.strumento || ""} onChange={handleExtraChange}>
                <option value="">Seleziona</option>
                {strumentiMusicali[playerData.percorso]?.[playerData.anagrafica.sesso]?.map((strumento, index) => <option key={index} value={strumento}>{strumento}</option>)}
              </Form.Select></Form.Group>
            )}

            {playerData.percorso === "Sportivo" && (
              <Form.Group>
                <Form.Label>Ruolo Sportivo:</Form.Label>
                <Form.Select name="ruolo_sportivo" value={playerData.extra.ruolo_sportivo || ""} onChange={handleExtraChange}>
                  <option value="">Seleziona</option>
                  {ruoliSportivi[playerData.anagrafica.sesso]?.map((ruolo, index) => (
                    <option key={index} value={ruolo}>{ruolo}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            {playerData.percorso === "Tabboz" && (
              <Form.Group>
                <Form.Label>Ruolo Tabboz:</Form.Label>
                <Form.Select name="ruolo_tabboz" value={playerData.extra.ruolo_tabboz || ""} onChange={handleExtraChange}>
                  <option value="">Seleziona</option>
                  {opzioniTabboz.map((ruolo, index) => (
                    <option key={index} value={ruolo}>{ruolo}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Button variant="success" onClick={() => saveData("player_data", playerData)}>Crea Personaggio ✅</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CharacterCreation;
