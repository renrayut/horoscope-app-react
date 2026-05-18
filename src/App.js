import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import './App.css';
import { ANIMAL_IMAGES } from './animalImages';

const ANIMALS = [
  { id: 'rat',     km: 'ជូត',   en: 'Rat',     emoji: '🐭' },
  { id: 'ox',      km: 'ឆ្លូវ',  en: 'Ox',      emoji: '🐂' },
  { id: 'tiger',   km: 'ខាល',   en: 'Tiger',   emoji: '🐯' },
  { id: 'rabbit',  km: 'ថោះ',   en: 'Rabbit',  emoji: '🐰' },
  { id: 'dragon',  km: 'រោង',   en: 'Dragon',  emoji: '🐲' },
  { id: 'snake',   km: 'មមី',   en: 'Snake',   emoji: '🐍' },
  { id: 'horse',   km: 'មមែ',   en: 'Horse',   emoji: '🐴' },
  { id: 'goat',    km: 'វក',    en: 'Goat',    emoji: '🐐' },
  { id: 'monkey',  km: 'រកា',   en: 'Monkey',  emoji: '🐒' },
  { id: 'rooster', km: 'ច',     en: 'Rooster', emoji: '🐓' },
  { id: 'dog',     km: 'កុរ',   en: 'Dog',     emoji: '🐕' },
  { id: 'pig',     km: 'ថោះ',   en: 'Pig',     emoji: '🐷' },
];

const ELEMENTS = [
  { id: 'fire',  km: 'ភ្លើង', en: 'Fire',  icon: '🔥' },
  { id: 'water', km: 'ទឹក',   en: 'Water', icon: '💧' },
  { id: 'earth', km: 'ដី',    en: 'Earth', icon: '🌍' },
  { id: 'metal', km: 'លោហ',  en: 'Metal', icon: '⚙️' },
  { id: 'wood',  km: 'ឈើ',   en: 'Wood',  icon: '🌿' },
];

const RATING_OPTIONS = [
  { id: 'up',   km: 'ឡើង',    en: 'Rising',   color: '#4ade80' },
  { id: 'down', km: 'ធ្លាក់ចុះ', en: 'Falling',  color: '#f87171' },
  { id: 'mid',  km: 'មធ្យម',  en: 'Neutral',  color: '#fbbf24' },
];

export default function App() {
  const [bgImage, setBgImage] = useState(null);
  const [title, setTitle] = useState('ឆ្នាំមមីពងទេវតា');
  const [subtitle, setSubtitle] = useState('ស្រីធាតុភ្លើង');
  const [caption, setCaption] = useState('រាសីថ្ងៃនេះ ធ្លាក់ចុះ។ លោក អ្នក អាច ជួប នឹង គ្រោះ ភ័យ ជា យ ថា ហេតុ ដោយ សារ ការ ធ្វេស ប្រហេស ដូច្នេះ មិន គួប ធ្វើ ដំណើរ ទៅ ទីឆ្ងាយ ដល ដែល មិន ចាំ បាច់ ឡើយ។');
  const [warning, setWarning] = useState('គ្រប់គ្រងសតិអារម្មណ៍ · ប្រុងប្រយ័ត្នក្នុងការធ្វើដំណើរ');
  const [animal, setAnimal] = useState('snake');
  const [element, setElement] = useState('fire');
  const [rating, setRating] = useState('down');
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef(null);
  const fileRef = useRef(null);

  const selectedAnimal = ANIMALS.find(a => a.id === animal);
  const selectedElement = ELEMENTS.find(e => e.id === element);
  const selectedRating = RATING_OPTIONS.find(r => r.id === rating);

  const today = new Date();
  const months = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `khmer-horoscope-${animal}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    }
    setDownloading(false);
  };

  return (
    <div className="app">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="header-icon">🌟</span>
            <div>
              <div className="header-title">Khmer Horoscope</div>
              <div className="header-sub">Post Generator</div>
            </div>
          </div>
          <button className="dl-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳ Exporting…' : '⬇ Download PNG'}
          </button>
        </div>
      </header>

      <div className="workspace">
        {/* ===== LEFT PANEL — controls ===== */}
        <aside className="panel">

          {/* BG IMAGE */}
          <section className="section">
            <label className="section-label">Background Image</label>
            <div
              className={`dropzone ${bgImage ? 'has-image' : ''}`}
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {bgImage
                ? <img src={bgImage} alt="bg preview" className="dz-preview" />
                : <>
                    <span className="dz-icon">🖼</span>
                    <span className="dz-text">Click or drag image here</span>
                    <span className="dz-hint">JPG, PNG, WEBP</span>
                  </>
              }
              {bgImage && <div className="dz-change">Change</div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageUpload} />
          </section>

          {/* ANIMAL */}
          <section className="section">
            <label className="section-label">Zodiac Animal · សត្វចក្រ</label>
            <div className="animal-grid">
              {ANIMALS.map(a => (
                <button
                  key={a.id}
                  className={`animal-btn ${animal === a.id ? 'active' : ''}`}
                  onClick={() => setAnimal(a.id)}
                  title={a.en}
                >
                  <img
                    src={ANIMAL_IMAGES[a.id]}
                    alt={a.en}
                    className="animal-silhouette"
                  />
                  <span className="animal-km">{a.km}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ELEMENT */}
          <section className="section">
            <label className="section-label">Element · ធាតុ</label>
            <div className="elem-row-btns">
              {ELEMENTS.map(e => (
                <button
                  key={e.id}
                  className={`elem-btn ${element === e.id ? 'active' : ''}`}
                  onClick={() => setElement(e.id)}
                >
                  {e.icon} {e.km}
                </button>
              ))}
            </div>
          </section>

          {/* RATING */}
          <section className="section">
            <label className="section-label">Today's Rating</label>
            <div className="rating-row">
              {RATING_OPTIONS.map(r => (
                <button
                  key={r.id}
                  className={`rating-btn ${rating === r.id ? 'active' : ''}`}
                  style={{'--rc': r.color}}
                  onClick={() => setRating(r.id)}
                >
                  {r.km}
                </button>
              ))}
            </div>
          </section>

          {/* TITLE */}
          <section className="section">
            <label className="section-label">Title · ចំណងជើង</label>
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ឆ្នាំមមីពងទេវតា"
            />
          </section>

          {/* SUBTITLE */}
          <section className="section">
            <label className="section-label">Subtitle</label>
            <input
              className="input"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="ស្រីធាតុភ្លើង"
            />
          </section>

          {/* CAPTION */}
          <section className="section">
            <label className="section-label">Caption · ខ្លឹមសារ</label>
            <textarea
              className="textarea"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={5}
              placeholder="Enter horoscope reading..."
            />
          </section>

          {/* WARNING */}
          <section className="section">
            <label className="section-label">Warning · ការព្រមាន</label>
            <input
              className="input"
              value={warning}
              onChange={e => setWarning(e.target.value)}
              placeholder="Warning text..."
            />
          </section>

        </aside>

        {/* ===== RIGHT PANEL — preview ===== */}
        <main className="preview-area">
          <div className="preview-label">Preview · 480 × auto</div>

          <div className="card-wrap">
            <div className="card" ref={cardRef}>

              {/* IMAGE ZONE */}
              <div className="card-img-zone">
                {bgImage
                  ? <img src={bgImage} alt="bg" className="card-bg" />
                  : <div className="card-bg-placeholder">
                      <span>🖼</span>
                      <span>Upload background image</span>
                    </div>
                }
                <div className="card-gradient" />

                {/* subtitle over image — centered top */}
                <div className="card-subtitle-over">
                  <span>{subtitle}</span>
                </div>

                {/* chips */}
                <div className="card-chips">
                  <div className="chip">ហោរាសាស្ត្រខ្មែរ</div>
                  <div className="chip chip-date">{dateStr}</div>
                </div>

                {/* title bottom-left */}
                <div className="card-title-wrap">
                  <div className="card-animal-row">
                    <img
                      src={ANIMAL_IMAGES[animal]}
                      alt={selectedAnimal?.en}
                      className="card-animal-silhouette"
                    />
                    <span className="card-animal-name">{selectedAnimal?.km} · {selectedAnimal?.en}</span>
                  </div>
                  <div className="card-title">{title}</div>
                </div>
              </div>

              {/* BOTTOM PANEL */}
              <div className="card-body">

                {/* horoscope */}
                <div className="card-horoscope">
                  <div className="card-horoscope-label">រាសីថ្ងៃនេះ · Today's Reading</div>
                  <p className="card-caption">{caption}</p>
                </div>



              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
