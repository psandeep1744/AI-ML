/**
 * Kynovia AI - UI & Helper Functions
 * Formatting (₹ INR, IST Date/Time), Toast Alerts, Chatbot Widget, Global Navbar, Mobile Navigation, Booking Modal
 */

const UI = {
  // Format Indian Rupee currency (e.g. ₹900, ₹1,200)
  formatINR(amount) {
    if (amount === undefined || amount === null) return '₹0';
    const num = Number(amount);
    return `₹${num.toLocaleString('en-IN')}`;
  },

  // Format Date in IST (e.g. 03 Oct 2026)
  formatISTDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return dateStr;
    }
  },

  // Format Time in IST (e.g. 02:30 PM)
  formatISTTime(timeStr) {
    if (!timeStr) return '';
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
    }
    return timeStr;
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    let container = document.getElementById('kynovia-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'kynovia-toast-container';
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '99999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'shadow-lg rounded-3 p-3 text-white d-flex align-items-center gap-2 animate-fade-in';
    toast.style.minWidth = '290px';
    toast.style.maxWidth = '400px';
    toast.style.fontSize = '0.85rem';
    toast.style.backgroundColor = type === 'error' ? '#ba1a1a' : type === 'success' ? '#007a67' : '#001428';
    toast.style.border = '1px solid rgba(255,255,255,0.18)';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';

    const icon = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-white" style="font-size: 20px;">${icon}</span>
      <div class="flex-grow-1 font-weight-medium">${message}</div>
      <button type="button" class="btn-close btn-close-white ms-auto" style="font-size: 0.7rem;" onclick="this.parentElement.remove()"></button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Setup Global Header & Mobile Controls
  setupHeader() {
    const user = API.getUser();
    const userSlot = document.getElementById('navbar-user-slot');
    if (userSlot) {
      if (user) {
        userSlot.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${user.role === 'doctor' ? 'bg-primary' : 'bg-teal text-white'} rounded-pill text-uppercase px-2" style="font-size: 10px;">
              ${user.role}
            </span>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1.5 rounded-3 py-1.5 px-2.5 font-weight-bold" type="button" data-bs-toggle="dropdown">
                <span class="material-symbols-outlined" style="font-size: 18px;">account_circle</span>
                <span class="d-none d-sm-inline" style="font-size: 0.82rem;">${user.full_name}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-1 p-2 rounded-3" style="font-size: 0.85rem; min-width: 200px;">
                <li class="dropdown-header text-muted text-uppercase py-1" style="font-size: 10px;">Bengaluru Hub • #KY-${user.id.slice(-4)}</li>
                ${user.role === 'doctor' ? '<li><a class="dropdown-item py-1.5 rounded-2" href="/doctor-dashboard.html"><span class="material-symbols-outlined align-middle me-1.5" style="font-size: 16px;">stethoscope</span>Doctor Workstation</a></li>' : ''}
                ${user.role === 'admin' ? '<li><a class="dropdown-item py-1.5 rounded-2" href="/admin-dashboard.html"><span class="material-symbols-outlined align-middle me-1.5" style="font-size: 16px;">shield_person</span>Admin Console</a></li>' : ''}
                <li><a class="dropdown-item py-1.5 rounded-2" href="/appointments.html"><span class="material-symbols-outlined align-middle me-1.5" style="font-size: 16px;">calendar_month</span>My Appointments</a></li>
                <li><a class="dropdown-item py-1.5 rounded-2" href="/"><span class="material-symbols-outlined align-middle me-1.5" style="font-size: 16px;">grid_view</span>Patient Dashboard</a></li>
                <li><hr class="dropdown-divider my-1"></li>
                <li><button class="dropdown-item text-danger py-1.5 rounded-2" onclick="API.logout()"><span class="material-symbols-outlined align-middle me-1.5 text-danger" style="font-size: 16px;">logout</span>Logout</button></li>
              </ul>
            </div>
          </div>
        `;
      } else {
        userSlot.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <a href="/login.html" class="btn btn-sm kyn-btn-outline py-1 px-3" style="font-size: 0.82rem;">Sign In</a>
            <a href="/register.html" class="btn btn-sm kyn-btn-primary py-1 px-3 d-none d-sm-inline-flex" style="font-size: 0.82rem;">Register</a>
          </div>
        `;
      }
    }

    // Role switcher pills (Patient / Doctor)
    const patientBtn = document.getElementById('role-patient-btn');
    const doctorBtn = document.getElementById('role-doctor-btn');
    if (patientBtn && doctorBtn) {
      if (user && user.role === 'doctor') {
        doctorBtn.classList.add('active');
        doctorBtn.style.background = '#ffffff';
        doctorBtn.style.color = 'var(--kyn-primary)';
        doctorBtn.style.fontWeight = '700';
        patientBtn.classList.remove('active');
        patientBtn.style.background = 'transparent';
        patientBtn.style.color = '#43474d';
      } else {
        patientBtn.classList.add('active');
        patientBtn.style.background = '#ffffff';
        patientBtn.style.color = 'var(--kyn-primary)';
        patientBtn.style.fontWeight = '700';
        doctorBtn.classList.remove('active');
        doctorBtn.style.background = 'transparent';
        doctorBtn.style.color = '#43474d';
      }

      patientBtn.onclick = async (e) => {
        e.preventDefault();
        await API.loginAsDemo('patient');
      };
      doctorBtn.onclick = async (e) => {
        e.preventDefault();
        await API.loginAsDemo('doctor');
      };
    }

    // Inject Responsive Mobile Bottom Navigation Bar (< 992px)
    this.setupMobileNav();
  },

  // Setup Responsive Mobile Bottom Navigation
  setupMobileNav() {
    if (document.getElementById('kyn-mobile-bottom-bar')) return;

    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html';
    const isDoctors = path.includes('/doctors');
    const isAppointments = path.includes('/appointments');
    const isRecommend = path.includes('/recommend');
    const user = API.getUser();
    const accountUrl = user ? (user.role === 'doctor' ? '/doctor-dashboard.html' : '/appointments.html') : '/login.html';

    const nav = document.createElement('nav');
    nav.id = 'kyn-mobile-bottom-bar';
    nav.className = 'kyn-mobile-nav d-lg-none';
    nav.innerHTML = `
      <a href="/" class="kyn-mobile-nav-item ${isHome ? 'active' : ''}">
        <span class="material-symbols-outlined ${isHome ? 'fill' : ''}">grid_view</span>
        <span>Home</span>
      </a>
      <a href="/doctors.html" class="kyn-mobile-nav-item ${isDoctors ? 'active' : ''}">
        <span class="material-symbols-outlined ${isDoctors ? 'fill' : ''}">person_search</span>
        <span>Doctors</span>
      </a>
      <a href="/recommend.html" class="kyn-mobile-nav-item ${isRecommend ? 'active text-teal' : ''}">
        <span class="material-symbols-outlined text-teal ${isRecommend ? 'fill' : ''}">neurology</span>
        <span>AI Triage</span>
      </a>
      <a href="/appointments.html" class="kyn-mobile-nav-item ${isAppointments ? 'active' : ''}">
        <span class="material-symbols-outlined ${isAppointments ? 'fill' : ''}">calendar_month</span>
        <span>Visits</span>
      </a>
      <a href="${accountUrl}" class="kyn-mobile-nav-item">
        <span class="material-symbols-outlined">account_circle</span>
        <span>${user ? 'Profile' : 'Sign In'}</span>
      </a>
    `;

    document.body.appendChild(nav);
  },

  // Setup Floating Chatbot with Friendly Welcome Callout
  setupChatbot() {
    if (document.getElementById('kynovia-chatbot-root')) return;

    const root = document.createElement('div');
    root.id = 'kynovia-chatbot-root';
    root.innerHTML = `
      <!-- Friendly Callout Bubble -->
      <div id="kyn-chat-callout" class="position-fixed shadow-md bg-white border rounded-4 p-2.5 d-flex align-items-center gap-2 cursor-pointer"
           style="bottom: 90px; right: 24px; z-index: 1040; max-width: 250px; font-size: 12px; box-shadow: 0 4px 16px rgba(0,20,40,0.12);">
        <span class="material-symbols-outlined text-teal" style="font-size: 20px;">chat</span>
        <div>
          <strong class="d-block text-dark font-headline" style="font-size: 11px;">Need quick guidance?</strong>
          <span class="text-muted">Chat with our Bengaluru clinical AI assistant</span>
        </div>
        <button type="button" class="btn-close ms-auto" style="font-size: 0.6rem;" onclick="event.stopPropagation(); document.getElementById('kyn-chat-callout').remove();"></button>
      </div>

      <!-- FAB -->
      <div id="kyn-chat-fab" class="kyn-chatbot-fab" title="Chat with Kynovia AI Assistant">
        <span class="material-symbols-outlined" style="font-size: 26px;">psychology</span>
      </div>

      <!-- Window -->
      <div id="kyn-chat-window" class="kyn-chat-window d-none">
        <div class="kyn-chat-header">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle bg-teal p-1 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px; background: #00a187;">
              <span class="material-symbols-outlined text-white" style="font-size: 18px;">neurology</span>
            </div>
            <div>
              <div class="font-headline font-weight-bold" style="font-size: 0.85rem; line-height: 1.1;">Kynovia AI Assistant</div>
              <div style="font-size: 10px; color: #7cf8da;">Bengaluru Clinical Companion</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button id="kyn-chat-clear" class="btn btn-sm text-white p-1" title="Clear chat">
              <span class="material-symbols-outlined" style="font-size: 18px;">restart_alt</span>
            </button>
            <button id="kyn-chat-close" class="btn btn-sm text-white p-1" title="Close">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>
        </div>

        <div id="kyn-chat-body" class="kyn-chat-body">
          <div class="kyn-chat-bubble-bot">
            Namaste! I am your <strong>Kynovia AI Healthcare Assistant</strong> for Bengaluru. I can help you find specialists in Indiranagar, Koramangala & Whitefield, verify doctor fees in ₹ INR, and triage your symptoms.
          </div>
          <div class="d-flex flex-wrap gap-1 mt-1" id="kyn-chat-chips">
            <button class="btn btn-sm btn-light border rounded-pill py-1 px-2.5 text-muted chat-quick-prompt" style="font-size: 11px;">
              Book with Dr. Rajeshwar Sharma
            </button>
            <button class="btn btn-sm btn-light border rounded-pill py-1 px-2.5 text-muted chat-quick-prompt" style="font-size: 11px;">
              Find Neurologists in Bengaluru
            </button>
            <button class="btn btn-sm btn-light border rounded-pill py-1 px-2.5 text-muted chat-quick-prompt" style="font-size: 11px;">
              What is the consultation fee?
            </button>
            <button class="btn btn-sm btn-light border rounded-pill py-1 px-2.5 text-muted chat-quick-prompt" style="font-size: 11px;">
              Check Migraine & Headache Symptoms
            </button>
          </div>
        </div>

        <div class="p-2.5 bg-white border-top">
          <form id="kyn-chat-form" class="d-flex gap-2">
            <input
              type="text"
              id="kyn-chat-input"
              class="form-control form-control-sm rounded-3 text-dark"
              style="font-size: 0.85rem;"
              placeholder="Ask about doctors, symptoms, fees in ₹..."
              autocomplete="off"
            />
            <button type="submit" class="btn btn-sm kyn-btn-primary px-3">
              <span class="material-symbols-outlined" style="font-size: 18px;">send</span>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Event listeners
    const fab = document.getElementById('kyn-chat-fab');
    const win = document.getElementById('kyn-chat-window');
    const closeBtn = document.getElementById('kyn-chat-close');
    const clearBtn = document.getElementById('kyn-chat-clear');
    const callout = document.getElementById('kyn-chat-callout');
    const form = document.getElementById('kyn-chat-form');
    const input = document.getElementById('kyn-chat-input');
    const body = document.getElementById('kyn-chat-body');

    const toggleWindow = () => {
      win.classList.toggle('d-none');
      if (callout) callout.remove();
      if (!win.classList.contains('d-none')) {
        input.focus();
      }
    };

    fab.addEventListener('click', toggleWindow);
    if (callout) callout.addEventListener('click', toggleWindow);

    closeBtn.addEventListener('click', () => {
      win.classList.add('d-none');
    });

    clearBtn.addEventListener('click', () => {
      body.innerHTML = `
        <div class="kyn-chat-bubble-bot">
          Conversation cleared. How can I assist you with your health today?
        </div>
      `;
    });

    // Handle Quick Prompts
    document.addEventListener('click', e => {
      if (e.target.classList.contains('chat-quick-prompt')) {
        const text = e.target.innerText.trim();
        input.value = text;
        form.dispatchEvent(new Event('submit'));
      }
    });

    // Form Submit
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = input.value.trim();
      if (!msg) return;

      const userBubble = document.createElement('div');
      userBubble.className = 'kyn-chat-bubble-user';
      userBubble.innerText = msg;
      body.appendChild(userBubble);
      input.value = '';
      body.scrollTop = body.scrollHeight;

      const typingBubble = document.createElement('div');
      typingBubble.className = 'kyn-chat-bubble-bot text-muted';
      typingBubble.id = 'chat-typing-bubble';
      typingBubble.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Kynovia Assistant is typing...';
      body.appendChild(typingBubble);
      body.scrollTop = body.scrollHeight;

      try {
        const res = await API.sendChatMessage(msg);
        typingBubble.remove();

        const botBubble = document.createElement('div');
        botBubble.className = 'kyn-chat-bubble-bot';
        let formatted = res.reply
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n\n/g, '<br><br>')
          .replace(/• (.*?)(<br>|$)/g, '<li>$1</li>');
        if (formatted.includes('<li>')) formatted = formatted.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

        botBubble.innerHTML = formatted;
        body.appendChild(botBubble);

        if (res.suggested_prompts && res.suggested_prompts.length > 0) {
          const chipsContainer = document.createElement('div');
          chipsContainer.className = 'd-flex flex-wrap gap-1 mt-1';
          res.suggested_prompts.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-light border rounded-pill py-0.5 px-2 text-muted chat-quick-prompt';
            btn.style.fontSize = '11px';
            btn.innerText = p;
            chipsContainer.appendChild(btn);
          });
          body.appendChild(chipsContainer);
        }
      } catch (err) {
        typingBubble.remove();
        const errBubble = document.createElement('div');
        errBubble.className = 'kyn-chat-bubble-bot text-danger';
        errBubble.innerText = 'Unable to reach the assistant right now. Please try again.';
        body.appendChild(errBubble);
      }

      body.scrollTop = body.scrollHeight;
    });

    // Auto-dismiss callout after 10s
    setTimeout(() => {
      if (callout) {
        callout.style.opacity = '0';
        callout.style.transition = 'opacity 0.5s ease';
        setTimeout(() => callout.remove(), 500);
      }
    }, 10000);
  },

  // Universal Booking Confirmation Dialog with Real Google Calendar Sync
  showBookingSuccessModal(apt) {
    let modalEl = document.getElementById('kynoviaBookingSuccessModal');
    if (!modalEl) {
      const div = document.createElement('div');
      div.className = 'modal fade';
      div.id = 'kynoviaBookingSuccessModal';
      div.tabIndex = -1;
      document.body.appendChild(div);
      modalEl = div;
    }

    const title = encodeURIComponent(`Consultation with ${apt.doctor_name || 'Doctor'}`);
    const details = encodeURIComponent(`Kynovia AI Health Consultation\nType: ${apt.consultation_type || 'Telehealth'}\nFee: ₹${apt.consultation_fee || 900}\nBengaluru, India.`);
    const location = encodeURIComponent(apt.hospital || 'Kynovia Health Center, Bengaluru');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;

    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
          <div class="modal-header bg-teal text-white p-4">
            <div class="d-flex align-items-center gap-2.5">
              <span class="material-symbols-outlined text-white" style="font-size: 32px;">check_circle</span>
              <div>
                <h5 class="modal-title font-headline font-weight-bold text-white mb-0">Booking Confirmed!</h5>
                <div style="font-size: 11px; opacity: 0.9;">EHR Code: ${apt.code || 'APT-' + Math.floor(1000 + Math.random() * 9000)} • Bengaluru Node</div>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border mb-3">
              <img src="${apt.doctor_image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&auto=format&fit=crop&q=80'}" class="rounded-circle border" style="width: 52px; height: 52px; object-fit: cover;" alt="${apt.doctor_name}" />
              <div>
                <h5 class="font-headline font-weight-bold text-dark mb-0" style="font-size: 1rem;">${apt.doctor_name}</h5>
                <div class="text-teal font-weight-bold" style="font-size: 11px;">${apt.specialization || 'Clinical Specialist'}</div>
                <div class="text-muted" style="font-size: 11px;">${apt.hospital || 'Bengaluru, Karnataka'}</div>
              </div>
            </div>

            <div class="row g-2 mb-3 text-dark" style="font-size: 0.85rem;">
              <div class="col-6">
                <div class="p-2.5 bg-light rounded-2 border">
                  <div class="text-muted" style="font-size: 11px;">Date & Time (IST)</div>
                  <strong class="d-block">${apt.appointment_date || 'Today'} • ${apt.appointment_time || '14:30'}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2.5 bg-light rounded-2 border">
                  <div class="text-muted" style="font-size: 11px;">Consultation Mode</div>
                  <strong class="d-block text-capitalize">${apt.consultation_type || 'Telehealth Video'}</strong>
                </div>
              </div>
            </div>

            <div class="p-2.5 bg-light rounded-2 border mb-4 d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted" style="font-size: 11px;">Consultation Fee:</span>
                <span class="font-weight-bold text-dark ms-1">${UI.formatINR(apt.consultation_fee || 900)}</span>
              </div>
              <span class="badge bg-success">Pay at Clinic / Post-Call</span>
            </div>

            <div class="d-grid gap-2">
              <a href="${gCalUrl}" target="_blank" class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1.5 py-2 font-weight-bold">
                <span class="material-symbols-outlined" style="font-size: 18px;">event</span>
                <span>Add to Google Calendar</span>
              </a>
              <a href="/appointments.html" class="btn kyn-btn-primary d-flex align-items-center justify-content-center gap-1.5 py-2 font-weight-bold">
                <span class="material-symbols-outlined" style="font-size: 18px;">calendar_month</span>
                <span>View in My Appointments</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  },

  // Setup Emergency Dialog
  openEmergencyModal() {
    let modalEl = document.getElementById('kynoviaEmergencyModal');
    if (!modalEl) {
      const div = document.createElement('div');
      div.className = 'modal fade';
      div.id = 'kynoviaEmergencyModal';
      div.tabIndex = -1;
      div.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
            <div class="modal-header bg-danger text-white p-4">
              <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined text-white" style="font-size: 28px;">emergency</span>
                <div>
                  <h5 class="modal-title font-headline font-weight-bold text-white mb-0">Emergency Medical Helpline</h5>
                  <div style="font-size: 11px; opacity: 0.9;">Bengaluru & National Emergency Dispatch</div>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" style="font-size: 0.85rem;">
              <div class="alert alert-danger mb-3 p-3">
                <strong>CRITICAL ADVISORY:</strong> If you are experiencing acute chest pain, sudden numbness, or severe breathing distress, do not wait for an online appointment.
              </div>
              <div class="d-grid gap-2 mb-3">
                <a href="tel:112" class="btn btn-danger font-headline font-weight-bold py-2.5 d-flex align-items-center justify-content-center gap-2">
                  <span class="material-symbols-outlined">call</span> Call 112 (National Emergency)
                </a>
                <a href="tel:108" class="btn btn-outline-danger font-headline font-weight-bold py-2 d-flex align-items-center justify-content-center gap-2">
                  <span class="material-symbols-outlined">ambulance</span> Call 108 (Ambulance Service)
                </a>
              </div>
              <div class="p-3 bg-light rounded-3 text-muted">
                <strong class="text-dark d-block mb-1">Top Bengaluru Tertiary Emergency Hospitals:</strong>
                <div>• Manipal Hospital (HAL Airport Rd) - 080 2502 4444</div>
                <div>• Aster CMI Hospital (Hebbal) - 080 4342 0100</div>
                <div>• Apollo Hospital (Bannerghatta Rd) - 1066</div>
                <div>• Sakra World Hospital (Marathahalli-Sarjapur) - 080 4969 4969</div>
              </div>
            </div>
            <div class="modal-footer bg-light p-3">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(div);
      modalEl = div;
    }
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  },
};

window.UI = UI;

document.addEventListener('DOMContentLoaded', async () => {
  if (window.API && typeof window.API.ensureAuthenticated === 'function') {
    await window.API.ensureAuthenticated();
  }
  UI.setupHeader();
  UI.setupChatbot();
});
