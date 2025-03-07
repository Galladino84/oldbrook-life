import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { saveData, loadData, removeData } from '../utils/localStorageUtils';
import { useNavigate } from 'react-router-dom';


const strumentiMusicali = {
  Goth: { maschio: ["Chitarra", "Basso"], femmina: ["Voce", "Tastiera"] },
  Metallaro: { maschio: ["Chitarra", "Batteria"], femmina: ["Voce", "Basso"] }
};

const ruoliSportivi = {
  maschio: ["Guardia", "Ala Grande", "Ala Piccola", "Playmaker", "Centro"],
  femmina: ["Schiacciatrice", "Alzatrice", "Libero", "Centrale", "Opposto"]
};

const classiGdR = ["Master", "Mago", "Guerriero", "Ladro", "Chierico"];
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
  statistiche: {}
};

const CharacterCreation = () => {
  const [playerData, setPlayerData] = useState(() => loadData("player_data") || defaultPlayerData);

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

  useEffect(() => {
    if (playerData.percorso && playerData.anagrafica.sesso) {
      fetch(`${process.env.PUBLIC_URL}/data/famiglie.json`)
        .then(response => response.json())
        .then(data => {
          const nuovaFamiglia = data[playerData.percorso]?.[playerData.anagrafica.sesso] || {};
          setPlayerData(prev => ({
            ...prev,
            famiglia: nuovaFamiglia
          }));
        })
        .catch(error => console.error("Errore caricamento famiglia:", error));
    }
  }, [playerData.percorso, playerData.anagrafica.sesso]);

  // **📊 Caricamento Statistiche Iniziali**
  useEffect(() => {
    if (playerData.percorso && playerData.anagrafica.sesso) {
      fetch(`${process.env.PUBLIC_URL}/data/statistiche_iniziali.json`)
        .then(response => response.json())
        .then(data => {
          const nuoveStatistiche = data[playerData.percorso]?.[playerData.anagrafica.sesso] || {};
          setPlayerData(prev => ({
            ...prev,
            statistiche: nuoveStatistiche
          }));
        })
        .catch(error => console.error("Errore caricamento statistiche:", error));
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
              
              {/* **🖼️ Selezione della variante di avatar** */}
{avatarDisponibili[playerData.percorso]?.[playerData.anagrafica.sesso] ? (
  <>
    <h5 className="mt-3">Seleziona Avatar</h5>
    <div className="d-flex justify-content-center">
     {/* **🖼️ Selezione della variante di avatar** */}
{avatarDisponibili[playerData.percorso]?.[playerData.anagrafica.sesso] && avatarDisponibili[playerData.percorso][playerData.anagrafica.sesso].length > 0 ? (
   <>
     <h5 className="mt-3">Seleziona Avatar</h5>
     <div className="d-flex flex-wrap justify-content-center">
       {avatarDisponibili[playerData.percorso][playerData.anagrafica.sesso].map((avatar, index) => (
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
               style={{ width: "60px", height: "60px", cursor: "pointer", border: playerData.avatar.selezionato === avatar ? "3px solid #007bff" : "1px solid #ccc" }}
               onError={(e) => {
                 console.error("Errore nel caricamento dell'immagine:", e.target.src);
                 e.target.style.display = "none"; // Nasconde le immagini non trovate
               }}
             />
           </label>
         </div>
       ))}
     </div>
   </>
 ) : (
   <p className="text-muted mt-3">Nessun avatar disponibile</p>
 )}



    </div>
  </>
) : (
  <p className="text-muted mt-3">Nessun avatar disponibile</p>
)}

              
              {/* **👨‍👩‍👧‍👦 Visualizzazione della famiglia** */}
              {Object.keys(playerData.famiglia).length > 0 && (
                <>
                  <h5 className="mt-3">Famiglia</h5>
                  <ul className="list-unstyled">
                    {Object.entries(playerData.famiglia).map(([relazione, nome], index) => (
                      <li key={index}><strong>{relazione}:</strong> {nome} {playerData.anagrafica.cognome}</li>
                    ))}
                  </ul>
                </>
              )}
              {/* **📊 Visualizzazione delle Statistiche** */}
{Object.keys(playerData.statistiche).length > 0 ? (
  <>
    <h5 className="mt-3">Statistiche</h5>
    <ul className="list-unstyled">
      <li><strong>💖 Status:</strong> {playerData.statistiche.status}</li>
      <li><strong>✨ Carisma:</strong> {playerData.statistiche.carisma}</li>
      <li><strong>🧠 Intelligenza:</strong> {playerData.statistiche.intelligenza}</li>
      <li><strong>🎸 Maestria:</strong> {playerData.statistiche.maestria}</li>
      <li><strong>💰 Soldi:</strong> {playerData.statistiche.soldi} $</li>
    </ul>
  </>
) : (
  <p className="text-muted mt-3">Le statistiche verranno generate automaticamente.</p>
)}

            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Form>
            <Form.Group><Form.Label>Nome:</Form.Label><Form.Control type="text" name="nome" value={playerData.anagrafica.nome} onChange={handleChange} required /></Form.Group>
            <Form.Group><Form.Label>Cognome:</Form.Label><Form.Control type="text" name="cognome" value={playerData.anagrafica.cognome} onChange={handleChange} required /></Form.Group>
            <Form.Group><Form.Label>Sesso:</Form.Label><Form.Select name="sesso" value={playerData.anagrafica.sesso} onChange={handleChange} required>
                <option value="">Seleziona</option><option value="maschio">Maschio</option><option value="femmina">Femmina</option></Form.Select>
            </Form.Group>

            <Form.Group><Form.Label>Percorso:</Form.Label><Form.Select name="percorso" value={playerData.percorso} onChange={handlePercorsoChange} required>
                <option value="">Seleziona</option><option value="Goth">Goth</option><option value="Metallaro">Metallaro</option><option value="Nerd">Nerd</option><option value="Tabboz">Tabboz</option><option value="Sportivo">Sportivo</option></Form.Select>
            </Form.Group>

            {/* Campi condizionali */}
            {["Goth", "Metallaro"].includes(playerData.percorso) && (
              <>
                <Form.Group><Form.Label>Strumento Musicale:</Form.Label><Form.Select name="strumento" value={playerData.extra.strumento || ""} onChange={handleExtraChange}>
                    <option value="">Seleziona</option>
                    {strumentiMusicali[playerData.percorso]?.[playerData.anagrafica.sesso]?.map((strumento, index) => <option key={index} value={strumento}>{strumento}</option>)}
                  </Form.Select></Form.Group>
                <Form.Group><Form.Label>Nome della Band:</Form.Label><Form.Control type="text" name="band" value={playerData.extra.band || ""} onChange={handleExtraChange} /></Form.Group>
              </>
            )}

            {playerData.percorso === "Nerd" && (
              <>
                <Form.Group><Form.Label>Tipo di Nerd:</Form.Label><Form.Select name="tipo_nerd" value={playerData.extra.tipo_nerd || ""} onChange={handleExtraChange}>
                    <option value="">Seleziona</option>
                    <option value="Videogiocatore">Videogiocatore</option>
                    <option value="Giocatore di Ruolo">Giocatore di Ruolo</option>
                  </Form.Select></Form.Group>
                {playerData.extra.tipo_nerd === "Giocatore di Ruolo" && (
                  <Form.Group><Form.Label>Classe GdR:</Form.Label><Form.Select name="classe" value={playerData.extra.classe || ""} onChange={handleExtraChange}>
                      <option value="">Seleziona</option>
                      {classiGdR.map((classe, index) => <option key={index} value={classe}>{classe}</option>)}
                    </Form.Select></Form.Group>
                )}
              </>
            )}

{playerData.percorso === "Sportivo" && (
  <>
    <Form.Group>
      <Form.Label>Ruolo Sportivo:</Form.Label>
      <Form.Select name="ruolo_sportivo" value={playerData.extra.ruolo_sportivo || ""} onChange={handleExtraChange}>
        <option value="">Seleziona</option>
        {ruoliSportivi[playerData.anagrafica.sesso]?.map((ruolo, index) => (
          <option key={index} value={ruolo}>{ruolo}</option>
        ))}
      </Form.Select>
    </Form.Group>
    <Form.Group>
      <Form.Label>Nome Squadra:</Form.Label>
      <Form.Control type="text" name="squadra" value={playerData.extra.squadra || ""} onChange={handleExtraChange} />
    </Form.Group>
  </>
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
