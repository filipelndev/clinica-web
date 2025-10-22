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

    // Smooth scroll for internal nav links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(href.startsWith('#')){
          const target = document.querySelector(href);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth', block:'start'});
            // close mobile nav if open
            if(siteNav && siteNav.classList.contains('open')) siteNav.classList.remove('open');
          }
        }
      })
    })

  const dateInput = document.getElementById('contact-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

})
