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
    if (qaRecordingField) { if (qaStopRecRef.current) qaStopRecRef.current(); return; }
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
    return true;
  });

  const MicBtn = ({ field }) => !window.BKK.speechSupported ? null : (
    <button type="button" onClick={() => qaRecordingField === field ? stopQaRecording() : startQaRecording(field)}
      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
        background: qaRecordingField === field ? '#ef4444' : '#f3f4f6',
        color: qaRecordingField === field ? 'white' : '#6b7280', fontSize: '15px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: qaRecordingField === field ? 'pulse 1s ease-in-out infinite' : 'none' }}
    >{qaRecordingField === field ? '⏹️' : '🎤'}</button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center" style={{ zIndex: 10300 }}>
      <div style={{ background: 'white', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '500px', maxHeight: '92vh', overflow: 'auto', direction: window.BKK.i18n.isRTL() ? 'rtl' : 'ltr' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px 20px 0 0', position: 'sticky', top: 0, zIndex: 1 }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>⭐ {t('trail.addToFavorites')}</span>
          <button onClick={onCancel} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t('addLocation.name') || t('general.name') || 'שם'}</label>
            <input value={qaName} onChange={e => setQaName(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>{t('places.addPhoto') || '📷 תמונה'}</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {qaImage
                ? <img src={qaImage} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                : <div style={{ width: '64px', height: '64px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>📷</div>
              }
              <button type="button" onClick={() => qaFileRef.current?.click()}
                style={{ flex: 1, padding: '8px', background: '#f0fdf4', border: '1px dashed #6ee7b7', borderRadius: '10px', color: '#059669', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {`📸 ${t('places.addPhoto') || 'הוסף תמונה'}`}
              </button>
              <input ref={qaFileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleQaImage} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t('addLocation.description') || 'תיאור'}</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <textarea value={qaDescription} onChange={e => setQaDescription(e.target.value)} rows={2}
                style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', resize: 'vertical', direction: window.BKK.i18n.isRTL() ? 'rtl' : 'ltr' }} />
              <MicBtn field="description" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t('addLocation.notes') || 'הערות'}</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <textarea value={qaNotes} onChange={e => setQaNotes(e.target.value)} rows={2}
                style={{ flex: 1, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', resize: 'vertical', direction: window.BKK.i18n.isRTL() ? 'rtl' : 'ltr' }} />
              <MicBtn field="notes" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>{t('general.interests')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeInterests.map(opt => {
                const sel = qaInterests.includes(opt.id);
                const iconRaw = opt.icon || '';
                const isImg = iconRaw.startsWith('data:') || iconRaw.startsWith('http');
                return (
                  <button key={opt.id} type="button" onClick={() => setQaInterests(prev => sel ? prev.filter(i => i !== opt.id) : [...prev, opt.id])}
                    style={{ padding: '4px 10px', borderRadius: '20px', border: `2px solid ${sel ? '#2563eb' : '#e5e7eb'}`, background: sel ? '#eff6ff' : 'white', color: sel ? '#2563eb' : '#6b7280', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isImg ? <img src={iconRaw} alt="" style={{ width: '14px', height: '14px' }} /> : <span>{iconRaw}</span>}
                    {tLabel(opt) || opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ background: '#fefce8', borderRadius: '12px', padding: '12px', border: '1px solid #fde68a' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#92400e', display: 'block', marginBottom: '8px' }}>{`⭐ ${t('reviews.rate')} (${t('general.optional') || 'לא חובה'})`}</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setQaRatingScore(qaRatingScore === n ? 0 : n)}
                  style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= qaRatingScore ? 1 : 0.3, lineHeight: 1 }}>⭐</button>
              ))}
            </div>
            {qaRatingScore > 0 && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <textarea value={qaRatingText} onChange={e => setQaRatingText(e.target.value)} rows={2}
                  placeholder={t('reviews.writeReview') || 'כתוב חוות דעת...'}
                  style={{ flex: 1, padding: '8px', border: '1px solid #fde68a', borderRadius: '10px', fontSize: '13px', resize: 'vertical', direction: window.BKK.i18n.isRTL() ? 'rtl' : 'ltr' }} />
                <MicBtn field="rating" />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
            <button onClick={handleSave}
              style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              {`💾 ${t('general.save')}`}
            </button>
            <button onClick={onCancel}
              style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              {t('general.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

