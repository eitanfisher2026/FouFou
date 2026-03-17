// ===== QUICK ADD PLACE DIALOG — proper React component (hooks not allowed in IIFE) =====
const QuickAddPlaceDialog = ({ place, allInterestOptions, interestStatus, interestConfig, selectedCityId, isUnlocked, tLabel, t, onSave, onCancel, showToast }) => {
  const [qaName, setQaName] = React.useState(place.name || '');
  const [qaDescription, setQaDescription] = React.useState('');
  const [qaNotes, setQaNotes] = React.useState('');
  const [qaInterests, setQaInterests] = React.useState(place.interests || []);
  const [qaRatingScore, setQaRatingScore] = React.useState(0);
  const [qaRatingText, setQaRatingText] = React.useState('');
  const [qaImage, setQaImage] = React.useState(null);
  const [qaRecordingField, setQaRecordingField] = React.useState(null);
  const qaStopRecRef = React.useRef(null);
  const qaFileRef = React.useRef(null);

  const startQaRecording = (field) => {
    if (qaRecordingField) { if (qaStopRecRef.current) qaStopRecRef.current(); setQaRecordingField(null); return; }
    setQaRecordingField(field);
    const stop = window.BKK.startSpeechToText({
      maxDuration: (window.BKK.systemParams?.speechMaxSeconds || 15) * 1000,
      onResult: (text) => {
        if (field === 'description') setQaDescription(prev => (prev ? prev + ' ' : '') + text);
        if (field === 'notes') setQaNotes(prev => (prev ? prev + ' ' : '') + text);
        if (field === 'rating') setQaRatingText(prev => (prev ? prev + ' ' : '') + text);
      },
      onEnd: () => { setQaRecordingField(null); qaStopRecRef.current = null; },
      onError: () => { setQaRecordingField(null); qaStopRecRef.current = null; }
    });
    qaStopRecRef.current = stop;
  };

  const stopQaRecording = () => {
    if (qaStopRecRef.current) qaStopRecRef.current();
    qaStopRecRef.current = null;
    setQaRecordingField(null);
  };

  const handleQaImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setQaImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const enriched = {
      ...place,
      name: qaName.trim() || place.name,
      description: qaDescription.trim(),
      notes: qaNotes.trim(),
      interests: qaInterests.length > 0 ? qaInterests : place.interests,
      uploadedImage: qaImage || null,
    };
    onSave(enriched, qaRatingScore > 0 ? { score: qaRatingScore, text: qaRatingText } : null);
  };

  const activeInterests = allInterestOptions.filter(opt => {
    if (opt.adminStatus === 'hidden') return false;
    if (opt.adminStatus === 'draft' && !isUnlocked) return false;
    if (opt.scope === 'local' && opt.cityId && opt.cityId !== selectedCityId) return false;
    if (opt.custom || opt.id?.startsWith('custom_')) return interestStatus[opt.id] !== false;
    return interestStatus[opt.id] !== false;
  });

  const isRTL = window.BKK.i18n.isRTL();
  const labelStyle = { fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '4px', textAlign: isRTL ? 'right' : 'left' };
  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', direction: isRTL ? 'rtl' : 'ltr' };
  const textareaStyle = { flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', resize: 'vertical', direction: isRTL ? 'rtl' : 'ltr', minHeight: '60px' };

  const MicBtn = ({ field }) => !window.BKK.speechSupported ? null : (
    <button type="button" onClick={() => qaRecordingField === field ? stopQaRecording() : startQaRecording(field)}
      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0, background: qaRecordingField === field ? '#ef4444' : '#f3f4f6', color: qaRecordingField === field ? 'white' : '#6b7280', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: qaRecordingField === field ? 'pulse 1s ease-in-out infinite' : 'none' }}
    >{qaRecordingField === field ? '\u23F9\uFE0F' : '\uD83C\uDF99\uFE0F'}</button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4" style={{ zIndex: 10300 }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', direction: isRTL ? 'rtl' : 'ltr', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{'\u2B50 '}{t('trail.addToFavorites')}</span>
          <button onClick={onCancel} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'✕'}</button>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <div>
            <label style={labelStyle}>{t('places.placeName') || '\u05E9\u05DD \u05D4\u05DE\u05E7\u05D5\u05DD'}</label>
            <input value={qaName} onChange={e => setQaName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t('places.addPhoto') || '\u05D4\u05D5\u05E1\u05E3 \u05EA\u05DE\u05D5\u05E0\u05D4'}</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {qaImage
                ? <img src={qaImage} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, cursor: 'pointer' }} onClick={() => qaFileRef.current?.click()} />
                : <div style={{ width: '56px', height: '56px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, cursor: 'pointer' }} onClick={() => qaFileRef.current?.click()}>{'\uD83D\uDDBC\uFE0F'}</div>
              }
              <button type="button" onClick={() => qaFileRef.current?.click()}
                style={{ flex: 1, padding: '8px', background: '#faf5ff', border: '1px dashed #c4b5fd', borderRadius: '10px', color: '#7c3aed', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {qaImage ? `\u270F\uFE0F ${t('places.addPhoto') || '\u05D4\u05D7\u05DC\u05E3 \u05EA\u05DE\u05D5\u05E0\u05D4'}` : `\uD83D\uDDBC\uFE0F ${t('places.addPhoto') || '\u05D4\u05D5\u05E1\u05E3 \u05EA\u05DE\u05D5\u05E0\u05D4'}`}
              </button>
              <input ref={qaFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleQaImage} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t('places.description') || '\u05EA\u05D9\u05D0\u05D5\u05E8'}</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <textarea value={qaDescription} onChange={e => setQaDescription(e.target.value)} placeholder={t('places.descriptionPlaceholder') || '\u05EA\u05D9\u05D0\u05D5\u05E8 \u05E7\u05E6\u05E8...'} style={textareaStyle} rows={2} />
              <MicBtn field="description" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t('places.notes') || '\u05D4\u05E2\u05E8\u05D5\u05EA'}</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <textarea value={qaNotes} onChange={e => setQaNotes(e.target.value)} placeholder={t('places.notes') || '\u05D4\u05E2\u05E8\u05D5\u05EA...'} style={textareaStyle} rows={2} />
              <MicBtn field="notes" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t('general.interests') || '\u05EA\u05D7\u05D5\u05DE\u05D9\u05DD'}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeInterests.map(opt => {
                const sel = qaInterests.includes(opt.id);
                const iconRaw = opt.icon || '';
                const isImg = iconRaw.startsWith('data:') || iconRaw.startsWith('http');
                return (
                  <button key={opt.id} type="button" onClick={() => setQaInterests(prev => sel ? prev.filter(i => i !== opt.id) : [...prev, opt.id])}
                    style={{ padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', border: `2px solid ${sel ? '#7c3aed' : '#e5e7eb'}`, background: sel ? '#f5f3ff' : 'white', color: sel ? '#7c3aed' : '#6b7280', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isImg ? <img src={iconRaw} alt="" style={{ width: '14px', height: '14px' }} /> : <span>{iconRaw}</span>}
                    {tLabel(opt) || opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ background: '#fefce8', borderRadius: '12px', padding: '12px', border: '1px solid #fde68a' }}>
            <label style={{ ...labelStyle, color: '#92400e', marginBottom: '8px' }}>{`\u2B50 ${t('reviews.rate') || '\u05D3\u05E8\u05D2'} (${t('general.optional') || '\u05DC\u05D0 \u05D7\u05D5\u05D1\u05D4'})`}</label>
            <div style={{ display: 'flex', gap: '4px', marginBottom: qaRatingScore > 0 ? '8px' : '0' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setQaRatingScore(qaRatingScore === n ? 0 : n)}
                  style={{ fontSize: '26px', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= qaRatingScore ? 1 : 0.25, lineHeight: 1, padding: '0 2px' }}>{'\u2B50'}</button>
              ))}
            </div>
            {qaRatingScore > 0 && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <textarea value={qaRatingText} onChange={e => setQaRatingText(e.target.value)} rows={2}
                  placeholder={t('reviews.writeReview') || '\u05DB\u05EA\u05D5\u05D1 \u05D1\u05D9\u05E7\u05D5\u05E8\u05EA...'}
                  style={{ ...textareaStyle, border: '1px solid #fde68a' }} />
                <MicBtn field="rating" />
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
          <button onClick={handleSave}
            style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            {`\uD83D\uDCBE ${t('general.save')}`}
          </button>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '11px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            {t('general.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
