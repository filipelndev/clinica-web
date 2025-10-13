// Script básico para interações: menu móvel, ano no rodapé, agenda com localStorage e formulário de contato

document.addEventListener('DOMContentLoaded', ()=>{
  // ano no rodapé
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', ()=> siteNav.classList.toggle('open'))
  }

  // theme switch
  const themeToggle = document.querySelector('.theme-toggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const next = document.documentElement.classList.toggle('dark');
      localStorage.setItem('clinica_theme_dark', next ? '1' : '0');
      themeToggle.setAttribute('aria-pressed', String(next));
    })

    // init theme from storage or prefers-color-scheme
    const saved = localStorage.getItem('clinica_theme_dark');
    if(saved === null){
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if(prefers) document.documentElement.classList.add('dark');
    }else if(saved === '1'){
      document.documentElement.classList.add('dark');
      themeToggle.setAttribute('aria-pressed','true');
    }
  }

  // Agenda
  const appointmentsEl = document.getElementById('appointments');
  const apForm = document.getElementById('appointmentForm');
  if(appointmentsEl){
    const STORAGE_KEY = 'clinica_appointments_v1';
    let apps = loadAppointments();
    renderAppointments();

    if(apForm){
      apForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const date = document.getElementById('ap-date').value;
        const time = document.getElementById('ap-time').value;
        const name = document.getElementById('ap-name').value.trim();
        if(!date||!time||!name) return;
        const ap = {id: Date.now(), date, time, name};
        apps.push(ap);
        saveAppointments();
        renderAppointments();
        apForm.reset();
      })
    }

    function loadAppointments(){
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw) return JSON.parse(raw);
      }catch(e){console.warn('erro ao ler storage',e)}
      // default sample: próximos dias
      const today = new Date();
      const samp = [];
      for(let i=0;i<3;i++){
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate()+i+1);
        samp.push({id: Date.now()+i, date: d.toISOString().slice(0,10), time: '10:00', name: `Paciente ${i+1}`})
      }
      return samp;
    }

    function saveAppointments(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    }

    function renderAppointments(){
      appointmentsEl.innerHTML = '';
      // show only next 14 days
      const now = new Date();
      const future = apps.filter(a=> new Date(a.date + 'T' + a.time) >= now)
        .sort((x,y)=> new Date(x.date + 'T' + x.time) - new Date(y.date + 'T' + y.time))
        .slice(0,20);

      if(future.length===0){
        appointmentsEl.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
        return;
      }

      future.forEach(a=>{
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.gap = '1rem';

        const left = document.createElement('div');
        left.innerHTML = `<strong>${a.name}</strong><div class="muted">${formatDate(a.date)} • ${a.time}</div>`;

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '0.5rem';

        const gcal = document.createElement('a');
        gcal.className = 'btn ghost';
        gcal.textContent = 'Adicionar ao Google Calendar';
        gcal.target = '_blank';
        gcal.rel = 'noopener noreferrer';
        gcal.href = makeGoogleCalendarLink(a);

        const remove = document.createElement('button');
        remove.className = 'btn';
        remove.textContent = 'Remover';
        remove.addEventListener('click', ()=>{
          apps = apps.filter(x=>x.id!==a.id);
          saveAppointments();
          renderAppointments();
        })

        actions.appendChild(gcal);
        actions.appendChild(remove);

        li.appendChild(left);
        li.appendChild(actions);
        appointmentsEl.appendChild(li);
      })
    }

    function formatDate(d){
      const dt = new Date(d);
      return dt.toLocaleDateString('pt-BR', {weekday:'short', day:'2-digit', month:'short'});
    }
  }

  // Helper: create a Google Calendar event creation URL
  function makeGoogleCalendarLink(ap){
    // Google Calendar expects dates in YYYYMMDDTHHMMSSZ (UTC) or with local times without Z
    // We'll build with local datetime and assume user's calendar will adjust.
    try{
      const local = new Date(ap.date + 'T' + ap.time);
      const start = toGCalDateTime(local);
      // default 1h event
      const end = toGCalDateTime(new Date(local.getTime() + 60*60*1000));
      const details = encodeURIComponent('Consulta agendada via site. Nome: ' + ap.name);
      const text = encodeURIComponent('Consulta — ' + ap.name);
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${start}/${end}`;
    }catch(e){
      return '#';
    }
  }

  function toGCalDateTime(d){
    // returns YYYYMMDDTHHMMSS (no timezone) - Google treats as local
    const pad = (n)=>String(n).padStart(2,'0');
    return d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds());
  }

  // Formulário de contato (apenas mock local)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      if(!name||!email||!message) return alert('Preencha todos os campos');
      // aqui idealmente faria um fetch para backend. Vamos apenas simular
      console.log('Mensagem enviada', {name,email,message});
      alert('Mensagem enviada! Entrarei em contato em breve.');
      contactForm.reset();
    })
  }

})
