import React, { useState } from 'react';

const CharacterCreation = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    sesso: '',
    percorso: '',
    ruolo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrazione con LocalStorage qui
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Crea il tuo personaggio</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Nome:</label>
            <input type="text" className="form-control" name="nome" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Cognome</label>
            <input type="text" className="form-control" name="cognome" onChange={(e) => setFormData({...formData, cognome: e.target.value})} required />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-4">
            <label className="form-label">Sesso</label>
            <select className="form-select" name="sesso" onChange={(e) => setFormData({...formData, sesso: e.target.value})} required>
              <option value="">Seleziona sesso</option>
              <option value="Maschio">Maschio</option>
              <option value="Femmina">Femmina</option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Percorso di Vita</label>
            <select className="form-control" name="percorso" onChange={(e) => setFormData({...formData, percorso: e.target.value})}>
              <option value="">Scegli percorso</option>
              <option value="Goth">Goth</option>
              <option value="Metallaro">Metallaro</option>
              <option value="Nerd Gamer">Nerd Gamer</option>
              <option value="Nerd GdR">Nerd Giocatore di Ruolo</option>
              <option value="Tabboz">Tabboz</option>
              <option value="Sportivo">Sportivo</option>
            </select>
          </div>
        </div>

        {/* Campo ruolo che si visualizza in base al percorso selezionato */}
        {formData.percorso === 'Sportivo' && (
          <div className="mt-3">
            <label>Ruolo Sportivo</label>
            <input type="text" className="form-control" name="ruolo" onChange={(e) => setFormData({...formData, ruolo: e.target.value})} required />
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-4">Crea Personaggio</button>
      </form>
    </div>
  );
};

export default CharacterCreation;
