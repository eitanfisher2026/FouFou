// ===== QUICK ADD PLACE DIALOG — standalone React component =====
// Used in two modes:
//   captureMode=false (default): adding a Google place to favorites
//   captureMode=true: "Capture Now" FAB — photo + GPS, full save form
//
// Props:
//   place           — initial place object
//   captureMode     — boolean: green header, GPS indicator, auto-name, photo required
//   gpsStatus       — { loading, lat, lng, nearestStop, blocked } (captureMode only)
//   onAutoName      — (interestId) => string  (captureMode only)
//   allInterestOptions, interestStatus, selectedCityId, isUnlocked, tLabel, t
//   onSave(enriched, rating)
//   onCancel()

const QuickAddPlaceDialog = ({
  place, captureMode, gpsStatus,
  onAutoName, allInterestOptions, interestStatus,
  selectedCityId, isUnlocked, tLabel, t,
  onSave, onCancel
}) => {
  const [qaName, setQaName] = React.useState(place.name || "");
  const [qaDescription, setQaDescription] = React.useState("");
  const [qaNotes, setQaNotes] = React.useState("");
  const [qaInterests, setQaInterests] = React.useState(place.interests || []);
  const [qaRatingScore, setQaRatingScore] = React.useState(0);
  const [qaRatingText, setQaRatingText] = React.useState("");
  const [qaImage, setQaImage] = React.useState(place.uploadedImage || null);
  const [qaRecordingField, setQaRecordingField] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const qaStopRecRef = React.useRef(null);

  // Bug fix: when dialog opens with pre-selected interests (from lastCaptureInterestsRef),
  // no toggle event fires, so onAutoName is never called. Generate name on mount.
  React.useEffect(() => {
    if (captureMode && onAutoName && qaInterests.length > 0 && !qaName) {
      const generated = onAutoName(qaInterests[0], qaInterests);
      if (generated) setQaName(generated);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInterestToggle = (optId) => {
    const newInterests = qaInterests.includes(optId)
      ? qaInterests.filter(i => i !== optId)
      : [...qaInterests, optId];
    setQaInterests(newInterests);
    if (captureMode && onAutoName && newInterests.length > 0) {
      const generated = onAutoName(newInterests[0], newInterests);
      if (generated) setQaName(generated);
    }
  };

  const startRec = (field) => {
    if (qaRecordingField) {
      if (qaStopRecRef.current) qaStopRecRef.current();
      qaStopRecRef.current = null;
      setQaRecordingField(null);
      return;
    }
    setQaRecordingField(field);
    const stop = window.BKK.startSpeechToText({
      maxDuration: (window.BKK.systemParams?.speechMaxSeconds || 15) * 1000,
      onResult: (text, isFinal) => {
        if (!isFinal) return; // ignore interim — only append confirmed final text
        if (field === "description") setQaDescription(prev => (prev ? prev + " " : "") + text);
        if (field === "notes") setQaNotes(prev => (prev ? prev + " " : "") + text);
        if (field === "rating") setQaRatingText(prev => (prev ? prev + " " : "") + text);
      },
      onEnd: () => { setQaRecordingField(null); qaStopRecRef.current = null; },
      onError: () => { setQaRecordingField(null); qaStopRecRef.current = null; }
    });
    qaStopRecRef.current = stop;
  };

  const handleSave = () => {
    if (isSaving) return; // guard against double-click
    setIsSaving(true);
    const enriched = {
      ...place,
      name: qaName.trim() || place.name,
      description: qaDescription.trim(),
      notes: qaNotes.trim(),
      interests: qaInterests.length > 0 ? qaInterests : place.interests,
      uploadedImage: qaImage || null
    };
    onSave(enriched, qaRatingScore > 0 ? { score: qaRatingScore, text: qaRatingText } : null);
  };

  const activeInterests = allInterestOptions.filter(option => {
    const aStatus = option.adminStatus || "active";
    if (aStatus === "hidden") return false;
    if (aStatus === "draft" && !isUnlocked) return false;
    const status = interestStatus[option.id];
    if (option.uncovered) return status === true;
    if (option.scope === "local" && option.cityId && option.cityId !== selectedCityId) return false;
    if (status === undefined && (option.custom || option.id?.startsWith("custom_"))) return false;
    return status !== false;
  }).sort((a, b) => (tLabel(a) || a.label || '').localeCompare(tLabel(b) || b.label || '', 'he'));

  const isRTL = window.BKK.i18n.isRTL();
  const labelCls = "block text-xs font-bold mb-1";
  const textareaStyle = { direction: isRTL ? "rtl" : "ltr", fontSize: "14px", minHeight: "55px", resize: "vertical", lineHeight: "1.4" };
  const micStyle = (active) => ({
    width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0,
    background: active ? "#ef4444" : "#f3f4f6", color: active ? "white" : "#6b7280",
    fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
    animation: active ? "pulse 1s ease-in-out infinite" : "none",
    boxShadow: active ? "0 0 0 3px rgba(239,68,68,0.3)" : "none"
  });

  const headerBg = captureMode
    ? "linear-gradient(135deg, #22c55e, #16a34a)"
    : "linear-gradient(to right, #a855f7, #ec4899)";
  const headerTitle = captureMode
    ? `📸 ${t("trail.capturePlace")}`
    : `⭐ ${t("trail.addToFavorites")}`;
  const saveDisabled = isSaving || (captureMode && !qaImage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2" style={{ zIndex: 10300 }}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between"
          style={{ background: headerBg, flexShrink: 0 }}>
          <h3 className="text-base font-bold">{headerTitle}</h3>
          <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.25)", border: "none", color: "white", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div className="overflow-y-auto p-3 space-y-3" style={{ direction: isRTL ? "rtl" : "ltr" }}>

          {/* GPS indicator — captureMode only */}
          {captureMode && gpsStatus && (() => {
            if (gpsStatus.loading) return (
              <div style={{ padding: "6px 10px", background: "#f0fdf4", borderRadius: "8px", fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
                📍 {t("trail.detectingLocation")}...
              </div>
            );
            if (gpsStatus.blocked) return (
              <div style={{ padding: "6px 10px", background: "#fef3c7", borderRadius: "8px", fontSize: "11px", color: "#92400e", textAlign: "center" }}>
                📍 {t("trail.gpsBlocked")}
              </div>
            );
            if (gpsStatus.nearestStop) return (
              <div style={{ padding: "6px 10px", background: "#f0fdf4", borderRadius: "8px", fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#22c55e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", flexShrink: 0 }}>
                  {String.fromCharCode(65 + gpsStatus.nearestStop.idx)}
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t("trail.nearStop")} <b>{gpsStatus.nearestStop.name}</b>
                </span>
                <span style={{ fontSize: "10px", color: "#9ca3af", flexShrink: 0 }}>
                  {gpsStatus.nearestStop.dist < 1000 ? `${gpsStatus.nearestStop.dist}m` : `${(gpsStatus.nearestStop.dist/1000).toFixed(1)}km`}
                </span>
              </div>
            );
            if (gpsStatus.lat && gpsStatus.lng) return (
              <div style={{ padding: "6px 10px", background: "#f0fdf4", borderRadius: "8px", fontSize: "11px", color: "#16a34a", textAlign: "center" }}>
                📍 GPS ✓
              </div>
            );
            return null;
          })()}

          {/* Image */}
          <div>
            <label className={labelCls}>{`📷 ${t("general.image")}`}</label>
            {qaImage ? (
              <div className="relative">
                <img src={qaImage} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 cursor-pointer hover:opacity-90"
                  style={{ borderColor: captureMode ? "#22c55e" : "#c084fc" }} />
                <button onClick={() => setQaImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hover:bg-red-600">✕</button>
                {captureMode && gpsStatus?.lat && gpsStatus?.lng && (
                  <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(0,0,0,0.7)", color: "#22c55e", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "bold" }}>
                    📍 GPS ✓
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button type="button"
                  className="flex-1 p-3 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-green-50"
                  style={{ borderColor: "#22c55e" }}
                  onClick={async () => {
                    const result = await window.BKK.openCamera();
                    if (!result) return;
                    const compressed = await window.BKK.compressImage(result.dataUrl);
                    setQaImage(compressed);
                    // Extract GPS from EXIF and bubble up to parent
                    if (captureMode && place._onGpsFromExif) {
                      const gps = await window.BKK.extractGpsFromImage(result.file);
                      if (gps && gps.lat !== 0) place._onGpsFromExif(gps);
                    }
                    if (captureMode) window.BKK.saveImageToDevice(result.dataUrl, `foufou_quick_${Date.now()}.jpg`);
                  }}>
                  <span className="text-2xl">📸</span>
                  <div className="text-xs text-green-700 mt-1 font-bold">{t("general.takePhoto")}</div>
                </button>
                <label className="flex-1 p-3 border-2 border-dashed border-purple-300 rounded-lg text-center cursor-pointer hover:bg-purple-50 block">
                  <span className="text-2xl">🖼️</span>
                  <div className="text-xs text-gray-600 mt-1">{t("general.clickToUpload")}</div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      // DO NOT extract EXIF GPS from gallery — Android/iOS strip it when saving to gallery
                      const reader = new FileReader();
                      reader.onload = async () => { setQaImage(await window.BKK.compressImage(reader.result)); };
                      reader.readAsDataURL(file);
                    }} />
                </label>
              </div>
            )}
          </div>

          {/* Interests */}
          <div>
            <label className={labelCls}>{captureMode ? t("trail.whatDidYouSee") : t("general.interests")}</label>
            {captureMode ? (
              <div className="grid grid-cols-6 gap-1.5 p-1.5 bg-gray-50 rounded-lg max-h-36 overflow-y-auto border border-gray-200">
                {activeInterests.map(option => {
                  const sel = qaInterests.includes(option.id);
                  return (
                    <button key={option.id} type="button"
                      onClick={() => handleInterestToggle(option.id)}
                      className={`p-1.5 rounded-lg text-[10px] font-bold transition-all ${sel ? "bg-green-500 text-white shadow-md" : "bg-white border border-gray-300"}`}>
                      <span className="text-lg block">
                        {option.icon?.startsWith?.("data:") ? <img src={option.icon} alt="" className="w-5 h-5 object-contain mx-auto" /> : option.icon}
                      </span>
                      <span className="text-[7px] block truncate leading-tight mt-0.5">{tLabel(option)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {activeInterests.map(opt => {
                  const sel = qaInterests.includes(opt.id);
                  const iconRaw = opt.icon || "";
                  const isImg = iconRaw.startsWith("data:") || iconRaw.startsWith("http");
                  return (
                    <button key={opt.id} type="button"
                      onClick={() => handleInterestToggle(opt.id)}
                      style={{ padding: "4px 10px", borderRadius: "20px", cursor: "pointer", border: `2px solid ${sel ? "#a855f7" : "#e5e7eb"}`, background: sel ? "#faf5ff" : "white", color: sel ? "#7c3aed" : "#6b7280", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                      {isImg ? <img src={iconRaw} alt="" style={{ width: "14px", height: "14px" }} /> : <span>{iconRaw}</span>}
                      {tLabel(opt) || opt.labelEn}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Name field — both modes. captureMode: auto-generated but editable. QuickAdd: from Google but editable */}
          <div>
            <label className={labelCls}>{t("places.placeName")}</label>
            <input value={qaName} onChange={e => setQaName(e.target.value)}
              placeholder={captureMode ? (t("places.placeName") + "...") : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
              style={{
                direction: isRTL ? "rtl" : "ltr", fontSize: "16px",
                borderColor: captureMode ? "#22c55e" : "#d1d5db",
                outline: "none"
              }} />
            {captureMode && !qaName && (
              <p style={{ fontSize: "10px", color: "#9ca3af", margin: "3px 0 0 4px" }}>
                {t("trail.whatDidYouSee")} → {t("places.placeName")}
              </p>
            )}
          </div>

          {/* Description + mic */}
          <div>
            <label className={labelCls}>{`📝 ${t("places.description")}`}</label>
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <textarea value={qaDescription} onChange={e => setQaDescription(e.target.value)}
                placeholder={t("places.description")}
                className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                style={textareaStyle} rows={2} />
              {qaDescription.trim() && (
                <button type="button" onClick={() => setQaDescription('')} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0, background: '#fee2e2', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('general.clear') || 'מחק'}>🗑️</button>
              )}
              {window.BKK.speechSupported && (
                <button type="button" onClick={() => startRec("description")} style={micStyle(qaRecordingField === "description")}
                  title={qaRecordingField === "description" ? t("speech.stopRecording") : t("speech.startRecording")}>
                  {qaRecordingField === "description" ? "⏹️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          {/* Notes + mic */}
          <div>
            <label className={labelCls}>{`💭 ${t("places.notes")}`}</label>
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <textarea value={qaNotes} onChange={e => setQaNotes(e.target.value)}
                placeholder={t("places.notes")}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500"
                style={textareaStyle} rows={2} />
              {qaNotes.trim() && (
                <button type="button" onClick={() => setQaNotes('')} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0, background: '#fee2e2', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('general.clear') || 'מחק'}>🗑️</button>
              )}
              {window.BKK.speechSupported && (
                <button type="button" onClick={() => startRec("notes")} style={micStyle(qaRecordingField === "notes")}
                  title={qaRecordingField === "notes" ? t("speech.stopRecording") : t("speech.startRecording")}>
                  {qaRecordingField === "notes" ? "⏹️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div style={{ background: "#fefce8", borderRadius: "12px", padding: "12px", border: "1px solid #fde68a" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#92400e", marginBottom: "8px", textAlign: isRTL ? "right" : "left" }}>
              {`⭐ ${t("reviews.rate")} (${t("general.optional")})`}
            </label>
            <div style={{ display: "flex", gap: "4px", marginBottom: qaRatingScore > 0 ? "8px" : "0" }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setQaRatingScore(qaRatingScore === n ? 0 : n)}
                  style={{ fontSize: "26px", background: "none", border: "none", cursor: "pointer", opacity: n <= qaRatingScore ? 1 : 0.25, lineHeight: 1, padding: "0 2px" }}>⭐</button>
              ))}
            </div>
            {qaRatingScore > 0 && (
              <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
                <textarea value={qaRatingText} onChange={e => setQaRatingText(e.target.value)} rows={2}
                  placeholder={t("reviews.writeReview")}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-yellow-400"
                  style={{ direction: isRTL ? "rtl" : "ltr", fontSize: "14px", resize: "vertical" }} />
                {qaRatingText.trim() && (
                  <button type="button" onClick={() => setQaRatingText('')} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0, background: '#fee2e2', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('general.clear') || 'מחק'}>🗑️</button>
                )}
                {window.BKK.speechSupported && (
                  <button type="button" onClick={() => startRec("rating")} style={micStyle(qaRecordingField === "rating")}>
                    {qaRecordingField === "rating" ? "⏹️" : "🎤"}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "8px", padding: "10px 16px", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
          <button onClick={handleSave}
            disabled={saveDisabled}
            className="flex-1 py-2.5 font-bold text-white rounded-xl text-base"
            style={{
              background: saveDisabled ? "#e5e7eb" : (captureMode ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(to right, #a855f7, #ec4899)"),
              border: "none", cursor: saveDisabled ? "not-allowed" : "pointer",
              color: saveDisabled ? "#9ca3af" : "white", flex: 2
            }}>
            {captureMode ? `✅ ${t("trail.saveAndContinue")}` : `💾 ${t("general.save")}`}
          </button>
          <button onClick={onCancel}
            className="py-2.5 font-bold rounded-xl text-base"
            style={{ background: "#f3f4f6", color: "#6b7280", border: "none", cursor: "pointer", flex: 1 }}>
            {t("general.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DebugTab — standalone component, loaded before 500KB Babel limit
// Props: debugSessions, searchDebugLog, debugFlagged, debugCategories,
//        debugClaudeQ, setDebugClaudeQ, toggleDebugCategory,
//        toggleDebugFlag, exportDebugSessions, clearDebugSessions,
//        exportFlaggedStops, askClaude
// ============================================================
const DebugTab = ({
  debugSessions, searchDebugLog, debugFlagged, debugCategories,
  debugClaudeQ, setDebugClaudeQ, toggleDebugCategory,
  toggleDebugFlag, exportDebugSessions, clearDebugSessions,
  exportFlaggedStops, askClaude,
}) => {
  const claudeQuestionTemplates = [
    { label: '🔍 למה המקום נבחר?', q: 'למה המקום הזה נבחר במסלול? האם הוא מתאים לתחום? תסביר את הלוגיקה.' },
    { label: '❌ למה חסרים מקומות?', q: 'המסלול קיבל מעט מקומות. למה? מה עלול לגרום ל-zero results?' },
    { label: '🔧 שגיאת שמירה Firebase', q: 'יש בעיה בשמירה ל-Firebase ואין שגיאות בconsole. מה יכול לגרום לכך?' },
    { label: '🏷️ בעיית types / סינון', q: 'הסינון של Google types לא עובד כמצופה. על סמך הcontext, מה הבעיה?' },
    { label: '🐛 הסבר התנהגות', q: 'שים לב להתנהגות הבאה שאני רואה: [תאר כאן]. על סמך הcontext, מה גורם לכך?' },
    { label: '⚡ מסלול איטי', q: 'יצירת המסלול לוקחת הרבה זמן. מה יכול לגרום לכך?' },
  ];

  return (
    <div style={{ paddingBottom: '16px' }}>

      {/* Category filter */}
      <div style={{ marginBottom: '12px', padding: '8px 10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '5px' }}>Filter by category:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {['all', 'api', 'firebase', 'sync', 'route', 'interest', 'location', 'migration'].map(cat => (
            <button key={cat} onClick={() => toggleDebugCategory(cat)}
              style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', border: 'none',
                background: debugCategories.includes(cat) || (cat !== 'all' && debugCategories.includes('all')) ? '#374151' : '#e5e7eb',
                color: debugCategories.includes(cat) || (cat !== 'all' && debugCategories.includes('all')) ? 'white' : '#6b7280'
              }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827' }}>🐛 Sessions ({debugSessions.length})</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {debugSessions.length > 0 && <button onClick={exportDebugSessions} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: '#2563eb', border: 'none', color: 'white', cursor: 'pointer' }}>📋 Export</button>}
          {debugSessions.length > 0 && <button onClick={clearDebugSessions} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: '#dc2626', border: 'none', color: 'white', cursor: 'pointer' }}>🗑️</button>}
        </div>
      </div>

      {/* Claude Bridge */}
      {debugSessions.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0369a1', marginBottom: '8px' }}>🤖 שאל קלוד</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
            {claudeQuestionTemplates.map((tpl, ti) => (
              <button key={ti} onClick={() => setDebugClaudeQ(tpl.q)}
                style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: '#e0f2fe', border: '1px solid #7dd3fc', cursor: 'pointer', color: '#0369a1' }}>
                {tpl.label}
              </button>
            ))}
          </div>
          <textarea
            value={debugClaudeQ}
            onChange={e => setDebugClaudeQ(e.target.value)}
            placeholder="כתוב שאלה חופשית, או בחר template למעלה..."
            style={{ width: '100%', minHeight: '60px', fontSize: '12px', padding: '6px', borderRadius: '6px', border: '1px solid #bae6fd', resize: 'vertical', direction: 'rtl', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => { if (debugClaudeQ.trim()) askClaude(debugClaudeQ); }}
            disabled={!debugClaudeQ.trim()}
            style={{ marginTop: '6px', width: '100%', padding: '8px', borderRadius: '8px', background: debugClaudeQ.trim() ? '#0369a1' : '#e5e7eb', color: debugClaudeQ.trim() ? 'white' : '#9ca3af', border: 'none', cursor: debugClaudeQ.trim() ? 'pointer' : 'default', fontWeight: 'bold', fontSize: '13px' }}
          >🤖 פתח claude.ai עם context</button>
        </div>
      )}

      {/* Empty state */}
      {debugSessions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 20px', color: '#9ca3af', background: '#f9fafb', borderRadius: '10px', marginBottom: '12px', border: '1px dashed #d1d5db' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🐛</div>
          <div style={{ fontWeight: 'bold', color: '#6b7280' }}>אין sessions עדיין</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>צור מסלול כדי לאסוף נתוני debug</div>
        </div>
      )}

      {/* Sessions list */}
      {debugSessions.slice(-10).reverse().map((sess) => {
        const sessLogs = searchDebugLog.filter(e => e.runId && e.runId === sess.runId);
        return (
          <div key={sess.id} style={{ marginBottom: '12px', background: 'white', borderRadius: '10px', border: '1px solid #bfdbfe', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '8px 12px', background: '#dbeafe', fontSize: '12px', fontWeight: 'bold', color: '#1e3a5f' }}>
              {sess.time} — {sess.areaName || sess.area} ({sess.searchMode}{sess.radiusMeters ? ` ${sess.radiusMeters}m` : ''}) — {sess.stops.length} stops
            </div>
            {(sess.stops || []).map((st, i) => {
              const d = st._debug;
              const flagKey = sess.id + ':' + i;
              const isFlagged = debugFlagged.has(flagKey);
              return (
                <div key={i} style={{ padding: '7px 12px', borderTop: '1px solid #e5e7eb', fontSize: '11px', background: isFlagged ? '#fef3c7' : 'transparent', borderLeft: isFlagged ? '4px solid #f59e0b' : '4px solid transparent' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                    <button onClick={() => toggleDebugFlag(flagKey)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', fontSize: '14px', opacity: isFlagged ? 1 : 0.3 }}>🚩</button>
                    <span style={{ fontWeight: 'bold', color: '#6b7280', minWidth: '14px' }}>{i + 1}.</span>
                    <span style={{ fontWeight: 'bold' }}>{st.custom ? '📌' : '🌐'} {st.name}</span>
                    <span style={{ color: '#6b7280' }}>⭐{st.rating || '?'} ({st.ratingCount || '?'})</span>
                    {d?.rank && <span style={{ color: '#9ca3af', fontSize: '10px' }}>#{d.rank}/{d.totalFromGoogle}</span>}
                  </div>
                  {d && (
                    <div style={{ fontSize: '10px', paddingLeft: '24px', marginTop: '2px', color: '#6b7280' }}>
                      {d.interestLabel} · {d.searchType === 'text' ? '🔤 "' + d.query + '"' : '🏷️ ' + (d.placeTypes || []).join(',')}
                      {d.primaryType && ' · ' + d.primaryType}
                    </div>
                  )}
                </div>
              );
            })}
            {sessLogs.length > 0 && (
              <details style={{ borderTop: '2px solid #fcd34d' }}>
                <summary style={{ cursor: 'pointer', padding: '6px 12px', background: '#fef9c3', fontSize: '11px', fontWeight: 'bold', color: '#92400e' }}>📊 API Log ({sessLogs.length})</summary>
                <div style={{ padding: '6px', fontSize: '10px', background: '#fffbeb' }}>
                  {sessLogs.map((entry, idx) => (
                    <div key={idx} style={{ marginBottom: '3px', padding: '3px 6px', borderRadius: '4px', background: entry.message.includes('📊') ? '#dcfce7' : entry.message.includes('❌') ? '#fee2e2' : 'white', border: '1px solid #e5e7eb' }}>
                      <div style={{ fontWeight: 'bold', color: '#1e3a5f' }}>{entry.message}</div>
                      {entry.data?.total !== undefined && <div style={{ color: '#374151' }}>Google:{entry.data.total} → Kept:{entry.data.kept} BL:-{entry.data.blacklistFiltered || 0} Type:-{entry.data.typeFiltered || 0}</div>}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        );
      })}

      {debugFlagged.size > 0 && (
        <button onClick={exportFlaggedStops}
          style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#f59e0b', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', marginTop: '8px' }}>
          🚩 Copy {debugFlagged.size} flagged stops
        </button>
      )}
    </div>
  );
};

// TranslateButton — inline translate button for description/notes/review fields
// Shows only when detected language differs from UI language
// Uses MyMemory API (free, no key needed)
const TranslateButton = ({ text, onTranslated, translateText, detectNeedsTranslation }) => {
  const [status, setStatus] = React.useState('idle'); // idle | translating | done | error
  const targetLang = detectNeedsTranslation(text);
  if (!targetLang) return null;

  const uiLang = window.BKK.i18n.currentLang || 'he';
  const label = status === 'idle' ? window.t('settings.translateBtn')
    : status === 'translating' ? window.t('settings.translatingBtn')
    : status === 'done' ? window.t('settings.translateDone')
    : '⚠️';

  const handleClick = async () => {
    if (status === 'translating' || status === 'done') return;
    setStatus('translating');
    try {
      const translated = await translateText(text, targetLang);
      onTranslated(translated);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      console.error('[TRANSLATE] Error:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'translating'}
      style={{
        fontSize: '10px',
        padding: '2px 7px',
        borderRadius: '10px',
        border: '1px solid #93c5fd',
        background: status === 'done' ? '#dcfce7' : status === 'error' ? '#fee2e2' : '#eff6ff',
        color: status === 'done' ? '#15803d' : status === 'error' ? '#dc2626' : '#2563eb',
        cursor: status === 'translating' ? 'wait' : 'pointer',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        opacity: status === 'translating' ? 0.7 : 1,
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
};

// ReviewTextWithTranslate — read-only review text with optional inline translation
// Keeps translated state locally so original is preserved in Firebase
const ReviewTextWithTranslate = ({ text, translateText, detectNeedsTranslation }) => {
  const [translated, setTranslated] = React.useState(null);
  const lang = window.BKK.i18n.currentLang || 'he';
  return (
    <div>
      <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0' }}>
        {translated || text}
      </p>
      {!translated
        ? <TranslateButton text={text} onTranslated={(t) => setTranslated(t)} translateText={translateText} detectNeedsTranslation={detectNeedsTranslation} />
        : <button onClick={() => setTranslated(null)} style={{ fontSize: '9px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            ↩ {lang === 'he' ? 'הצג מקור' : 'Show original'}
          </button>
      }
    </div>
  );
};

// AutoTranslateText — automatically translates text if language doesn't match UI
// Shows original while loading, replaces with translation on completion
// No state saved — display only, on-the-fly via MyMemory API
const AutoTranslateText = ({ text, style, className, prefix, translateText, detectNeedsTranslation }) => {
  const [display, setDisplay] = React.useState(text);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setDisplay(text); // reset when text changes
    if (!text || text.trim().length < 3) return;
    const targetLang = detectNeedsTranslation(text);
    if (!targetLang) return;
    setLoading(true);
    translateText(text, targetLang)
      .then(translated => { setDisplay(translated); setLoading(false); })
      .catch(() => setLoading(false)); // on error, keep original
  }, [text]);

  return (
    <span style={{ ...style, opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }} className={className}>
      {prefix}{display}
    </span>
  );
};
