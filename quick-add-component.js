// ===== QUICK ADD PLACE DIALOG — standalone React component =====
const QuickAddPlaceDialog = ({ place, allInterestOptions, interestStatus, selectedCityId, isUnlocked, tLabel, t, onSave, onCancel }) => {
  const [qaName, setQaName] = React.useState(place.name || '');
  const [qaDescription, setQaDescription] = React.useState('');
  const [qaNotes, setQaNotes] = React.useState('');
  const [qaInterests, setQaInterests] = React.useState(place.interests || []);
  const [qaRatingScore, setQaRatingScore] = React.useState(0);
  const [qaRatingText, setQaRatingText] = React.useState('');
  const [qaImage, setQaImage] = React.useState(null);
  const [qaRecordingField, setQaRecordingField] = React.useState(null);
  const qaStopRecRef = React.useRef(null);

  const startRec = (field) => {
    if (qaRecordingField) {
      if (qaStopRecRef.current) qaStopRecRef.current();
      qaStopRecRef.current = null; setQaRecordingField(null); return;
    }
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

  const handleSave = () => {
    onSave(
      { ...place, name: qaName.trim() || place.name, description: qaDescription.trim(), notes: qaNotes.trim(), interests: qaInterests.length > 0 ? qaInterests : place.interests, uploadedImage: qaImage || null },
      qaRatingScore > 0 ? { score: qaRatingScore, text: qaRatingText } : null
    );
  };

  // Exact same filter as wizard interest selector
  const activeInterests = allInterestOptions.filter(option => {
    const aStatus = option.adminStatus || 'active';
    if (aStatus === 'hidden') return false;
    if (aStatus === 'draft' && !isUnlocked) return false;
    const status = interestStatus[option.id];
    if (option.uncovered) return status === true;
    if (option.scope === 'local' && option.cityId && option.cityId !== selectedCityId) return false;
    if (status === undefined && (option.custom || option.id?.startsWith('custom_'))) return false;
    return status !== false;
  });

  const isRTL = window.BKK.i18n.isRTL();
  const labelCls = 'block text-xs font-bold mb-1';
  const textareaStyle = { direction: isRTL ? 'rtl' : 'ltr', fontSize: '14px', minHeight: '55px', resize: 'vertical', lineHeight: '1.4' };
  const micStyle = (active) => ({
    width: '34px', height: '34px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
    background: active ? '#ef4444' : '#f3f4f6', color: active ? 'white' : '#6b7280',
    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: active ? 'pulse 1s ease-in-out infinite' : 'none',
    boxShadow: active ? '0 0 0 3px rgba(239,68,68,0.3)' : 'none'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2" style={{ zIndex: 10300 }}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl">

        {/* Header — identical to addLocation dialog */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between" style={{ flexShrink: 0 }}>
          <h3 className="text-base font-bold">⭐ {t('trail.addToFavorites')}</h3>
          <button onClick={onCancel} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-3 space-y-3" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>

          {/* Name */}
          <div>
            <label className={labelCls}>{t('places.placeName')}</label>
            <input value={qaName} onChange={e => setQaName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-500"
              style={{ direction: isRTL ? 'rtl' : 'ltr', fontSize: '16px' }} />
          </div>

          {/* Image — same two-button pattern as addLocation dialog */}
          <div>
            <label className={labelCls}>{`📷 ${t('general.image')}`}</label>
            {qaImage ? (
              <div className="relative">
                <img src={qaImage} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-purple-300 cursor-pointer hover:opacity-90" />
                <button onClick={() => setQaImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hover:bg-red-600">✕</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button type="button" className="flex-1 p-3 border-2 border-dashed border-green-400 rounded-lg text-center cursor-pointer hover:bg-green-50"
                  onClick={async () => {
                    const result = await window.BKK.openCamera();
                    if (!result) return;
                    const compressed = await window.BKK.compressImage(result.dataUrl);
                    setQaImage(compressed);
                  }}>
                  <span className="text-2xl">📸</span>
                  <div className="text-xs text-green-700 mt-1 font-bold">{t('general.takePhoto')}</div>
                </button>
                <label className="flex-1 p-3 border-2 border-dashed border-purple-300 rounded-lg text-center cursor-pointer hover:bg-purple-50 block">
                  <span className="text-2xl">🖼️</span>
                  <div className="text-xs text-gray-600 mt-1">{t('general.clickToUpload')}</div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async () => { setQaImage(await window.BKK.compressImage(reader.result)); };
                      reader.readAsDataURL(file);
                    }} />
                </label>
              </div>
            )}
          </div>

          {/* Description + mic */}
          <div>
            <label className={labelCls}>{`📝 ${t('places.description')}`}</label>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
              <textarea value={qaDescription} onChange={e => setQaDescription(e.target.value)}
                placeholder={t('places.description')}
                className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                style={textareaStyle} rows={2} />
              {window.BKK.speechSupported && (
                <button type="button" onClick={() => startRec('description')} style={micStyle(qaRecordingField === 'description')}
                  title={qaRecordingField === 'description' ? t('speech.stopRecording') : t('speech.startRecording')}>
                  {qaRecordingField === 'description' ? '⏹️' : '🎤'}
                </button>
              )}
            </div>
          </div>

          {/* Notes + mic */}
          <div>
            <label className={labelCls}>{`💭 ${t('places.notes')}`}</label>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
              <textarea value={qaNotes} onChange={e => setQaNotes(e.target.value)}
                placeholder={t('places.notes')}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500"
                style={textareaStyle} rows={2} />
              {window.BKK.speechSupported && (
                <button type="button" onClick={() => startRec('notes')} style={micStyle(qaRecordingField === 'notes')}
                  title={qaRecordingField === 'notes' ? t('speech.stopRecording') : t('speech.startRecording')}>
                  {qaRecordingField === 'notes' ? '⏹️' : '🎤'}
                </button>
              )}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className={labelCls}>{t('general.interests')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeInterests.map(opt => {
                const sel = qaInterests.includes(opt.id);
                const iconRaw = opt.icon || '';
                const isImg = iconRaw.startsWith('data:') || iconRaw.startsWith('http');
                return (
                  <button key={opt.id} type="button"
                    onClick={() => setQaInterests(prev => sel ? prev.filter(i => i !== opt.id) : [...prev, opt.id])}
                    style={{ padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', border: `2px solid ${sel ? '#a855f7' : '#e5e7eb'}`, background: sel ? '#faf5ff' : 'white', color: sel ? '#7c3aed' : '#6b7280', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isImg ? <img src={iconRaw} alt="" style={{ width: '14px', height: '14px' }} /> : <span>{iconRaw}</span>}
                    {tLabel(opt) || opt.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div style={{ background: '#fefce8', borderRadius: '12px', padding: '12px', border: '1px solid #fde68a' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#92400e', marginBottom: '8px', textAlign: isRTL ? 'right' : 'left' }}>
              {`⭐ ${t('reviews.rate')} (${t('general.optional')})`}
            </label>
            <div style={{ display: 'flex', gap: '4px', marginBottom: qaRatingScore > 0 ? '8px' : '0' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setQaRatingScore(qaRatingScore === n ? 0 : n)}
                  style={{ fontSize: '26px', background: 'none', border: 'none', cursor: 'pointer', opacity: n <= qaRatingScore ? 1 : 0.25, lineHeight: 1, padding: '0 2px' }}>⭐</button>
              ))}
            </div>
            {qaRatingScore > 0 && (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
                <textarea value={qaRatingText} onChange={e => setQaRatingText(e.target.value)} rows={2}
                  placeholder={t('reviews.writeReview')}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-yellow-400"
                  style={{ direction: isRTL ? 'rtl' : 'ltr', fontSize: '14px', resize: 'vertical' }} />
                {window.BKK.speechSupported && (
                  <button type="button" onClick={() => startRec('rating')} style={micStyle(qaRecordingField === 'rating')}>
                    {qaRecordingField === 'rating' ? '⏹️' : '🎤'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '8px', padding: '10px 16px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
          <button onClick={handleSave}
            className="flex-1 py-2.5 font-bold text-white rounded-xl text-base"
            style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', cursor: 'pointer', flex: 2 }}>
            💾 {t('general.save')}
          </button>
          <button onClick={onCancel}
            className="py-2.5 font-bold rounded-xl text-base"
            style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', cursor: 'pointer', flex: 1 }}>
            {t('general.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
