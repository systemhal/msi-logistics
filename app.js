/* ==========================================================================
   WHATSAPP ENTERPRISE CRM — ESTILO KOMMO & ZOHO CRM (MOTOR JAVASCRIPT)
   Métricas de Encuestas + Subida y Descarga de Archivos Exacta + Responsivo
   ========================================================================== */

var chats = [];
var activePhone = "";
var lastChatsHash = "";
var knownMsgCountMap = {};
var soundEnabled = true;
var audioCtx = null;
var isAuthorized = false;
var currentDragLeadPhone = null;
var selectedFileObj = null;

var APPS_SCRIPT_REST_URL = "https://script.google.com/macros/s/AKfycbyFKmFLY3GJVgFFyASRfWgdj4RPke7AAtI8HHOo6WoC7NPFq6EPaUWONEwuVFcU0iDY/exec";

// ==========================================
// 1. CONTROL DE NAVEGACIÓN Y VISTAS (SPA)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
  var navItems = document.querySelectorAll(".nav-item[data-view]");
  navItems.forEach(function(item) {
    item.addEventListener("click", function() {
      var targetViewId = this.getAttribute("data-view");
      
      navItems.forEach(function(n) { n.classList.remove("active"); });
      this.classList.add("active");

      var views = document.querySelectorAll(".view-panel");
      views.forEach(function(v) { v.classList.remove("active-view"); });

      var activeViewEl = document.getElementById(targetViewId);
      if (activeViewEl) activeViewEl.classList.add("active-view");

      if (targetViewId === "kanbanView") renderKanbanBoard();
    });
  });

  checkAuthOnLoad();
  buildEmojiPicker();
});

// ==========================================
// 2. SISTEMA DE SONIDO (WEB AUDIO API)
// ==========================================
function playNotificationSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    var now = audioCtx.currentTime;
    
    var osc1 = audioCtx.createOscillator();
    var gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.51, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    var osc2 = audioCtx.createOscillator();
    var gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.09);
    gain2.gain.setValueAtTime(0.22, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.32);
  } catch(e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  var btn = document.getElementById("soundToggleBtn");
  if (btn) {
    if (soundEnabled) {
      btn.innerHTML = '<i class="ri-volume-up-line" style="color:var(--wa-green)"></i>';
      btn.title = "Notificación Sonora Activada";
      playNotificationSound();
    } else {
      btn.innerHTML = '<i class="ri-volume-mute-line" style="color:var(--accent-red)"></i>';
      btn.title = "Notificación Sonora Silenciada";
    }
  }
}

function checkNewInboundMessages(newChats) {
  var hasNewInbound = false;
  for (var i = 0; i < newChats.length; i++) {
    var c = newChats[i];
    var phone = c.phone;
    var inboundCount = 0;
    for (var j = 0; j < c.messages.length; j++) {
      if (c.messages[j].type !== 'outbound') {
        inboundCount++;
      }
    }
    
    if (knownMsgCountMap[phone] !== undefined) {
      if (inboundCount > knownMsgCountMap[phone]) {
        hasNewInbound = true;
      }
    }
    knownMsgCountMap[phone] = inboundCount;
  }
  
  if (hasNewInbound) {
    playNotificationSound();
  }
}

// ==========================================
// 3. CARGA DE CHATS (DUAL ENGINE)
// ==========================================
function processLoadedChats(data) {
  var chatsData = (data && data.chats) ? data.chats : data;
  if (chatsData && chatsData.length > 0) {
    checkNewInboundMessages(chatsData);
    var newHash = JSON.stringify(chatsData);
    if (newHash !== lastChatsHash) {
      lastChatsHash = newHash;
      chats = chatsData;
      renderChatList();
      renderKanbanBoard();
      if (activePhone) openChat(activePhone, true);
    }
  }
}

function getDemoMockChats() {
  return [
    {
      id: "51925030096", phone: "51925030096", name: "Ghilbert 🎮", stage: "Encuesta Enviada", time: "23/07/2026 01:50", lastMsg: "📋 Encuesta completada",
      messages: [
        { type: "inbound", text: "1234", fullStr: "23/07/2026 00:02", dateStr: "23/07/2026", ts: 1784782936000 },
        { type: "outbound", text: "Hola Ghilbert, gracias por contactar a MSI Aduanas. ¿En qué podemos ayudarte?", fullStr: "23/07/2026 00:05", dateStr: "23/07/2026", ts: 1784783000000 },
        { type: "survey_flow", fullStr: "23/07/2026 01:50", dateStr: "23/07/2026", ts: 1784789400000, scores: { rapidez: '5', conocimiento: '5', acompanamiento: '5', respaldo: '5', cambio: 'No', recomendacion: '5' } }
      ]
    },
    {
      id: "51913984252", phone: "51913984252", name: "Cliente MSI Aduanas", stage: "En Contacto", time: "23/07/2026 01:15", lastMsg: "Buenas tardes, consulta sobre despacho",
      messages: [
        { type: "inbound", text: "Buenas tardes, consulta sobre despacho de aduana", fullStr: "23/07/2026 01:15", dateStr: "23/07/2026", ts: 1784787300000 }
      ]
    }
  ];
}

function loadChats() {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run.withSuccessHandler(function(data) {
      processLoadedChats(data);
    }).obtenerChatsEnVivo();
  } else {
    fetch(APPS_SCRIPT_REST_URL + "?action=getChats")
      .then(function(res){ return res.json(); })
      .then(function(data){ processLoadedChats(data); })
      .catch(function(err){
        processLoadedChats(getDemoMockChats());
      });
  }
}

function renderChatList() {
  var container = document.getElementById("chatsListContainer");
  if (!container) return;
  container.innerHTML = "";

  var searchVal = document.getElementById("searchInput").value.toLowerCase();

  for (var i = 0; i < chats.length; i++) {
    var c = chats[i];
    if (searchVal && c.name.toLowerCase().indexOf(searchVal) === -1 && c.phone.indexOf(searchVal) === -1) {
      continue;
    }

    var initials = getInitials(c.name);
    var stage = c.stage || "Nuevo Lead";

    var div = document.createElement("div");
    div.className = "chat-item" + (c.phone === activePhone ? " active-chat" : "");
    div.onclick = (function(ph) { return function() { openChat(ph); }; })(c.phone);

    div.innerHTML = `
      <div class="avatar">${initials}</div>
      <div class="chat-info">
        <div class="chat-info-row1">
          <span class="chat-name">${esc(c.name)}</span>
          <span class="chat-time">${esc(c.time || '')}</span>
        </div>
        <div class="chat-info-row2">
          <span class="last-msg-text">${esc(c.lastMsg || '')}</span>
          <span class="stage-tag">${esc(stage)}</span>
        </div>
      </div>
    `;
    container.appendChild(div);
  }
}

function forceScrollBottom() {
  var area = document.getElementById("messagesViewport");
  if (!area) return;
  var b = document.getElementById("chatBottomAnchor");
  if (b) b.scrollIntoView({ behavior: 'smooth', block: 'end' });
  area.scrollTop = area.scrollHeight + 999999;
}

function openChat(ph, isAutoRefresh) {
  activePhone = ph;
  if (!isAutoRefresh) renderChatList();

  var c = findChat(ph);
  if (!c) return;

  document.getElementById("inboxEmptyState").style.display = "none";
  document.getElementById("chatHeader").style.display = "flex";
  document.getElementById("messagesViewport").style.display = "flex";
  document.getElementById("composeBar").style.display = "flex";
  document.getElementById("scrollBottomBtn").style.display = "flex";

  var initials = getInitials(c.name);
  document.getElementById("activeHdrAvatar").innerText = initials;
  document.getElementById("activeHdrName").innerText = c.name;
  document.getElementById("activeHdrPhone").innerText = "+" + c.phone;

  document.getElementById("detailAvatar").innerText = initials;
  document.getElementById("detailName").innerText = c.name;
  document.getElementById("detailPhone").innerText = "+" + c.phone;
  document.getElementById("pipelineStageSelect").value = c.stage || "Nuevo Lead";

  var surveysSent = 0;
  var surveysAnswered = 0;
  for (var k = 0; k < c.messages.length; k++) {
    var msgK = c.messages[k];
    if (msgK.type === "outbound" && msgK.text && msgK.text.indexOf("Encuesta") !== -1) surveysSent++;
    if (msgK.type === "survey_flow") surveysAnswered++;
  }
  if (c.stage === "Encuesta Enviada" && surveysSent === 0) surveysSent = 1;

  document.getElementById("detailSurveysSent").innerText = surveysSent;
  document.getElementById("detailSurveysAnswered").innerText = surveysAnswered;

  var viewport = document.getElementById("messagesViewport");
  viewport.innerHTML = "";

  var lastDate = "";
  var lastSurvey = null;

  for (var i = 0; i < c.messages.length; i++) {
    var m = c.messages[i];
    var msgDate = m.dateStr || "Fecha Desconocida";

    if (msgDate !== lastDate) {
      lastDate = msgDate;
      var dBadge = document.createElement("div");
      dBadge.className = "day-badge";
      dBadge.innerText = "📅 " + msgDate;
      viewport.appendChild(dBadge);
    }

    var div = document.createElement("div");

    if (m.type === "survey_flow") {
      lastSurvey = m.scores;
      div.className = "msg-bubble inbound";
      div.style.maxWidth = "80%";
      var html = `
        <div class="survey-card-widget">
          <div class="survey-card-title"><i class="ri-checkbox-circle-fill"></i> Encuesta Respondida</div>
          <div class="survey-scores-grid">
            <div class="score-box"><div class="label">Rapidez</div><div class="val">${esc(m.scores.rapidez)} / 5</div></div>
            <div class="score-box"><div class="label">Técnico</div><div class="val">${esc(m.scores.conocimiento)} / 5</div></div>
            <div class="score-box"><div class="label">Acompañamiento</div><div class="val">${esc(m.scores.acompanamiento)} / 5</div></div>
            <div class="score-box"><div class="label">Respaldo MSI</div><div class="val">${esc(m.scores.respaldo)} / 5</div></div>
          </div>
          <div style="margin-top:6px;font-size:0.73rem;color:var(--text-muted)">Cambiar ejecutivo: <strong style="color:#fff">${esc(m.scores.cambio)}</strong></div>
        </div>
        <div class="timestamp-tag">📅 ${esc(m.fullStr || '')}</div>
      `;
      div.innerHTML = html;
    } else if (m.type === "outbound") {
      div.className = "msg-bubble outbound";
      if (m.text && m.text.indexOf("Encuesta") !== -1) {
        div.style.background = "linear-gradient(135deg, #005c4b, #017561)";
        div.style.border = "1px solid #00a884";
        div.innerHTML = `<div style="font-weight:600;display:flex;align-items:center;gap:6px;"><i class="ri-file-list-3-line" style="font-size:1.1rem;color:#34d399;"></i> ${esc(m.text)}</div><div class="timestamp-tag">📅 ${esc(m.fullStr || '')} <i class="ri-check-double-line" style="color:#53b4f0;"></i></div>`;
      } else {
        div.innerHTML = `<div>${esc(m.text)}</div><div class="timestamp-tag">📅 ${esc(m.fullStr || '')} <i class="ri-check-double-line" style="color:#53b4f0;"></i></div>`;
      }
    } else {
      div.className = "msg-bubble inbound";
      var contentHtml = `<div>${esc(m.text)}</div>`;
      if (m.mediaUrl) {
        contentHtml += `<div class="download-attachment-btn" style="margin-top:6px;"><a href="${m.mediaUrl}" target="_blank" style="background:#00a884;color:#fff;padding:6px 12px;border-radius:6px;font-size:0.78rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:600;"><i class="ri-download-2-line"></i> Descargar Archivo Recibido</a></div>`;
      }
      div.innerHTML = contentHtml + `<div class="timestamp-tag">📅 ${esc(m.fullStr || '')}</div>`;
    }

    viewport.appendChild(div);
  }

  var bElement = document.createElement("div");
  bElement.id = "chatBottomAnchor";
  bElement.style.height = "1px";
  bElement.style.width = "100%";
  viewport.appendChild(bElement);

  forceScrollBottom();

  var surveyCardEl = document.getElementById("detailSurveyCard");
  if (lastSurvey && surveyCardEl) {
    var nums = [parseFloat(lastSurvey.rapidez)||0, parseFloat(lastSurvey.conocimiento)||0, parseFloat(lastSurvey.acompanamiento)||0, parseFloat(lastSurvey.respaldo)||0];
    var avg = nums.reduce(function(a,b){return a+b}, 0) / nums.length;
    surveyCardEl.innerHTML = `
      <div style="color:var(--wa-green);font-weight:700;font-size:0.98rem;margin-bottom:6px">Promedio: ${avg.toFixed(1)} / 5.0 ⭐</div>
      <div style="font-size:0.8rem;display:flex;flex-direction:column;gap:3px">
        <div>• Rapidez: <strong>${esc(lastSurvey.rapidez)}</strong></div>
        <div>• Técnico: <strong>${esc(lastSurvey.conocimiento)}</strong></div>
        <div>• Acompañamiento: <strong>${esc(lastSurvey.acompanamiento)}</strong></div>
        <div>• Respaldo: <strong>${esc(lastSurvey.respaldo)}</strong></div>
        <div>• Cambio Ejecutivo: <strong>${esc(lastSurvey.cambio)}</strong></div>
      </div>
    `;
  } else if (surveyCardEl) {
    surveyCardEl.innerHTML = `<p style="font-size:0.8rem;color:var(--text-muted);">Sin encuestas respondidas aún.</p>`;
  }
}

function sendTextMessage() {
  var input = document.getElementById("messageReplyInput");
  var txt = input.value.trim();
  if (!txt || !activePhone) return;
  input.value = "";

  var now = new Date();
  var day = String(now.getDate()).padStart(2, "0");
  var mnt = String(now.getMonth() + 1).padStart(2, "0");
  var yr = now.getFullYear();
  var h = String(now.getHours()).padStart(2, "0");
  var mn = String(now.getMinutes()).padStart(2, "0");
  var fullStr = day + "/" + mnt + "/" + yr + " " + h + ":" + mn;

  var viewport = document.getElementById("messagesViewport");
  var div = document.createElement("div");
  div.className = "msg-bubble outbound";
  div.innerHTML = `<div>${esc(txt)}</div><div class="timestamp-tag">📅 ${fullStr} <i class="ri-time-line" style="color:var(--text-muted)"></i></div>`;
  
  var bAnchor = document.getElementById("chatBottomAnchor");
  if (bAnchor) viewport.insertBefore(div, bAnchor);
  else viewport.appendChild(div);

  forceScrollBottom();

  var c = findChat(activePhone);
  if (c) c.messages.push({ type: "outbound", text: txt, fullStr: fullStr, ts: now.getTime() });

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run.withSuccessHandler(function(res) {
      if (res && res.exito) {
        var tick = div.querySelector(".ri-time-line");
        if (tick) { tick.className = "ri-check-double-line"; tick.style.color = "#53b4f0"; }
      } else if (res && res.error) {
        div.innerHTML += `<div style="color:var(--accent-red);font-size:0.75rem;margin-top:4px;">❌ Error Meta: ${esc(res.error)}</div>`;
      }
    }).enviarRespuestaManual(activePhone, txt);
  } else {
    var token = localStorage.getItem("msi_meta_token") || "EAASz43rVNgUBSAbTl8hgBWhe290GQMJ77FrGKGxeLrvYLOopaa3tJH9mSQ1ZAIzqSdDzMAlqM9nIPEXLNZClrngOgjuYM4rNo8C6KdFbESWf9QQJ1W0WWUnQZB3pm16XA3uMQ0gGpxb8ASYG46uA8HwZBYBy4CMUIicPfWNRyQqMxP5RFBsvEWplpTeBUAZDZD";
    
    fetch("https://graph.facebook.com/v20.0/1266313029888670/messages", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: activePhone,
        type: "text",
        text: { body: txt }
      })
    })
    .then(r => r.json())
    .then(resMsg => {
      if (resMsg.messages && resMsg.messages[0].id) {
        var tick = div.querySelector(".ri-time-line");
        if (tick) { tick.className = "ri-check-double-line"; tick.style.color = "#53b4f0"; }
        
        // Log in Google Sheets via JSONP
        var scriptUrl = localStorage.getItem("msi_script_url") || "https://script.google.com/macros/s/AKfycbyFKmFLY3GJVgFFyASRfWgdj4RPke7AAtI8HHOo6WoC7NPFq6EPaUWONEwuVFcU0iDY/exec";
        var script = document.createElement("script");
        script.src = `${scriptUrl}?action=logMessage&phone=${encodeURIComponent(activePhone)}&msg=${encodeURIComponent(txt)}&msgId=${resMsg.messages[0].id}&t=${Date.now()}`;
        document.body.appendChild(script);
      } else {
        throw new Error(resMsg.error ? resMsg.error.message : "Error Meta al enviar texto");
      }
    })
    .catch(err => {
      div.innerHTML += `<div style="color:var(--accent-red);font-size:0.75rem;margin-top:4px;">❌ Error Local: ${esc(err.message || err)}</div>`;
    });
  }
}

// ==========================================
// 4. SUBIDA Y ENVÍO DE ADJUNTOS (SINTAXIS EXACTA A CÓDIGO PROBADO DE USUARIO)
// ==========================================
function openAttachModal() {
  document.getElementById("attachModal").classList.add("show");
}

function closeAttachModal() {
  document.getElementById("attachModal").classList.remove("show");
  document.getElementById("fileInput").value = "";
  document.getElementById("fileSelectedInfo").style.display = "none";
  document.getElementById("btnSendFile").disabled = true;
  selectedFileObj = null;
}

function handleFileSelect(input) {
  if (input.files && input.files[0]) {
    selectedFileObj = input.files[0];
    document.getElementById("selectedFileName").innerText = selectedFileObj.name + " (" + (selectedFileObj.size / 1024 / 1024).toFixed(2) + " MB)";
    document.getElementById("fileSelectedInfo").style.display = "flex";
    document.getElementById("btnSendFile").disabled = false;
  }
}

function sendFileAttachment() {
  if (!selectedFileObj || !activePhone) return;
  
  var fileToUpload = selectedFileObj; // Guardar referencia antes de limpiar
  var fileName = fileToUpload.name;
  var fileType = fileToUpload.type || "application/octet-stream";
  var isImage = fileType.indexOf("image/") === 0;
  var waType = isImage ? "image" : "document";
  var label = isImage ? "📷 " + fileName : "📎 " + fileName;

  closeAttachModal();

  var now = new Date();
  var day = String(now.getDate()).padStart(2, "0");
  var mnt = String(now.getMonth() + 1).padStart(2, "0");
  var yr = now.getFullYear();
  var h = String(now.getHours()).padStart(2, "0");
  var mn = String(now.getMinutes()).padStart(2, "0");
  var fullStr = day + "/" + mnt + "/" + yr + " " + h + ":" + mn;

  var viewport = document.getElementById("messagesViewport");
  var div = document.createElement("div");
  div.className = "msg-bubble outbound";
  div.innerHTML = `<div>${esc(label)} (Subiendo a Meta...)</div><div class="timestamp-tag">📅 ${fullStr} <i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i></div>`;
  
  var bAnchor = document.getElementById("chatBottomAnchor");
  if (bAnchor) viewport.insertBefore(div, bAnchor);
  else viewport.appendChild(div);
  forceScrollBottom();

  var c = findChat(activePhone);
  
  var token = localStorage.getItem("msi_meta_token") || "EAASz43rVNgUBSAbTl8hgBWhe290GQMJ77FrGKGxeLrvYLOopaa3tJH9mSQ1ZAIzqSdDzMAlqM9nIPEXLNZClrngOgjuYM4rNo8C6KdFbESWf9QQJ1W0WWUnQZB3pm16XA3uMQ0gGpxb8ASYG46uA8HwZBYBy4CMUIicPfWNRyQqMxP5RFBsvEWplpTeBUAZDZD";

  // Upload to Meta
  var formData = new FormData();
  formData.append("messaging_product", "whatsapp");
  formData.append("type", fileType); // MIME type
  formData.append("file", fileToUpload);

  fetch("https://graph.facebook.com/v20.0/1266313029888670/media", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token },
    body: formData
  })
  .then(r => r.json())
  .then(resMedia => {
    if (resMedia.id) {
      // Send Message
      var msgPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: activePhone,
        type: waType
      };
      if (waType === "image") msgPayload.image = { id: resMedia.id };
      else msgPayload.document = { id: resMedia.id, filename: fileName };

      return fetch("https://graph.facebook.com/v20.0/1266313029888670/messages", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify(msgPayload)
      });
    } else {
      throw new Error(resMedia.error ? resMedia.error.message : "Error subiendo archivo a Meta");
    }
  })
  .then(r => r.json())
  .then(resMsg => {
    if (resMsg.messages && resMsg.messages[0].id) {
      div.querySelector("div").innerHTML = `<div>${esc(label)}</div>`;
      var tick = div.querySelector(".timestamp-tag");
      if (tick) tick.innerHTML = `📅 ${fullStr} <i class="ri-check-double-line" style="color:#53b4f0;"></i>`;
      if (c) c.messages.push({ type: "outbound", text: label, fullStr: fullStr, ts: now.getTime() });

      // Log in Google Sheets via JSONP
      var scriptUrl = localStorage.getItem("msi_script_url") || "https://script.google.com/macros/s/AKfycbyFKmFLY3GJVgFFyASRfWgdj4RPke7AAtI8HHOo6WoC7NPFq6EPaUWONEwuVFcU0iDY/exec";
      var script = document.createElement("script");
      script.src = `${scriptUrl}?action=logMessage&phone=${encodeURIComponent(activePhone)}&msg=${encodeURIComponent(label)}&msgId=${resMsg.messages[0].id}&t=${Date.now()}`;
      document.body.appendChild(script);
    } else {
      throw new Error(resMsg.error ? resMsg.error.message : "Error Meta al enviar mensaje");
    }
  })
  .catch(err => {
    div.innerHTML = `<div>${esc(label)}</div><div style="color:#ef4444;font-size:0.75rem;margin-top:4px;">❌ Error: ${esc(err.message || err)}</div><div class="timestamp-tag">📅 ${fullStr}</div>`;
  });
}

// ==========================================
// 5. MOTOR KANBAN
// ==========================================
var stagesList = ["Nuevo Lead", "En Contacto", "Encuesta Enviada", "Cotización", "Cliente Ganado", "Cliente Perdido"];

function renderKanbanBoard() {
  stagesList.forEach(function(stage) {
    var container = document.getElementById("cards-" + stage);
    var countBadge = document.getElementById("count-" + stage);
    if (!container) return;

    container.innerHTML = "";
    var count = 0;

    for (var i = 0; i < chats.length; i++) {
      var c = chats[i];
      var cStage = c.stage || "Nuevo Lead";

      if (cStage === stage) {
        count++;
        
        var sSent = 0;
        var sAns = 0;
        for (var m = 0; m < c.messages.length; m++) {
          if (c.messages[m].type === "outbound" && c.messages[m].text && c.messages[m].text.indexOf("Encuesta") !== -1) sSent++;
          if (c.messages[m].type === "survey_flow") sAns++;
        }
        if (cStage === "Encuesta Enviada" && sSent === 0) sSent = 1;

        var card = document.createElement("div");
        card.className = "lead-card";
        card.draggable = true;
        card.setAttribute("data-phone", c.phone);
        card.ondragstart = handleDragStart;

        card.innerHTML = `
          <div class="lead-card-hdr">
            <span class="lead-card-name">${esc(c.name)}</span>
          </div>
          <div class="lead-card-sub">+${esc(c.phone)}</div>
          <div class="lead-card-metrics">
            <div><span>Encuestas Enviadas:</span> <strong style="color:var(--wa-green);">${sSent}</strong></div>
            <div><span>Encuestas Respondidas:</span> <strong style="color:#34d399;">${sAns}</strong></div>
          </div>
          <div class="lead-card-footer">
            <span>Último: ${esc(c.time || '')}</span>
            <i class="ri-whatsapp-line" style="color:var(--wa-green);font-size:1.1rem;cursor:pointer;" onclick="openChatFromKanban('${c.phone}')"></i>
          </div>
        `;
        container.appendChild(card);
      }
    }

    if (countBadge) countBadge.innerText = count;
  });
}

function handleDragStart(e) {
  currentDragLeadPhone = this.getAttribute("data-phone");
  e.dataTransfer.setData("text/plain", currentDragLeadPhone);
  this.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, targetStage) {
  e.preventDefault();
  if (!currentDragLeadPhone) return;

  var c = findChat(currentDragLeadPhone);
  if (c) {
    c.stage = targetStage;
    renderKanbanBoard();
    renderChatList();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.actualizarEtapaCliente(currentDragLeadPhone, targetStage);
    } else {
      fetch(APPS_SCRIPT_REST_URL + "?action=updateStage&phone=" + encodeURIComponent(currentDragLeadPhone) + "&stage=" + encodeURIComponent(targetStage));
    }
  }
  currentDragLeadPhone = null;
}

function updateClientStageFromDetail(newStage) {
  if (!activePhone) return;
  var c = findChat(activePhone);
  if (c) {
    c.stage = newStage;
    renderChatList();
    renderKanbanBoard();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.actualizarEtapaCliente(activePhone, newStage);
    } else {
      fetch(APPS_SCRIPT_REST_URL + "?action=updateStage&phone=" + encodeURIComponent(activePhone) + "&stage=" + encodeURIComponent(newStage));
    }
  }
}

function openChatFromKanban(ph) {
  var inboxItem = document.querySelector('.nav-item[data-view="inboxView"]');
  if (inboxItem) inboxItem.click();
  openChat(ph);
}

// ==========================================
// 6. EMOJIS & SEGURIDAD PIN
// ==========================================
var emojiList = ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","😴","😷","🤒","🤕","🤢","🤮","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","💩","🤡","👹","👺","👻","👽","👾","🤖","👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💪","❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","🎉","🎊","🎈","🎁","⭐","🌟","✨","💫","🔥","💥","🎯","🚀","📋","📊","📈","📝","✅","❌","⚠️","📌","🔗","📎","✏️","💼","🏢","📞","📱","💻","✉️"];

function buildEmojiPicker() {
  var grid = document.getElementById("emojiGrid");
  if (!grid) return;
  grid.innerHTML = "";
  emojiList.forEach(function(e) {
    var cell = document.createElement("div");
    cell.className = "emoji-item";
    cell.innerText = e;
    cell.onclick = function() {
      var input = document.getElementById("messageReplyInput");
      input.value += e;
      input.focus();
    };
    grid.appendChild(cell);
  });
}

function toggleEmojiPicker() {
  var p = document.getElementById("emojiPicker");
  if (p) p.classList.toggle("show");
}

function findChat(ph) {
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].phone === ph) return chats[i];
  }
  return null;
}

function getInitials(n) {
  if (!n) return "MSI";
  var parts = n.trim().split(" ");
  var r = "";
  for (var i = 0; i < Math.min(parts.length, 2); i++) {
    if (parts[i][0]) r += parts[i][0];
  }
  return r.toUpperCase();
}

function esc(s) {
  if (!s) return "";
  var d = document.createElement("div");
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}

function checkAuthOnLoad() {
  var token = sessionStorage.getItem("crm_auth_token");
  if (token) {
    isAuthorized = true;
    document.getElementById("authOverlay").style.display = "none";
    loadChats();
  } else {
    isAuthorized = false;
    document.getElementById("authOverlay").style.display = "flex";
  }
}

function submitAuthPin() {
  var pin = document.getElementById("authPinInput").value.trim();
  if (pin === "MSI2026*") {
    isAuthorized = true;
    sessionStorage.setItem("crm_auth_token", "authorized_token_msi");
    document.getElementById("authOverlay").style.display = "none";
    loadChats();
  } else {
    document.getElementById("authError").style.display = "block";
  }
}

function lockPanel() {
  isAuthorized = false;
  sessionStorage.removeItem("crm_auth_token");
  document.getElementById("authOverlay").style.display = "flex";
}

setInterval(function() {
  if (isAuthorized) loadChats();
}, 3500);
