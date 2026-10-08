/* ============================================================
   Transport Support Initiative - Main JavaScript
   Alpine.js + Chart.js + Mailto builder
   ============================================================ */
document.addEventListener('alpine:init', () => {
  Alpine.data('siteApp', () => ({
    mobileMenuOpen: false,
    init() {
      this.bindMobileMenu();
      this.initFAQs();
      this.loadResponses();
      this.initMailtoForms();
    },
    bindMobileMenu() {
      const toggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.mobile-menu');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          this.mobileMenuOpen = !this.mobileMenuOpen;
          menu.classList.toggle('open', this.mobileMenuOpen);
        });
      }
    },
    initFAQs() {
      const items = document.querySelectorAll('.faq-item');
      items.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        if (question && answer && toggle) {
          question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach((i) => {
              i.classList.remove('open');
            });
            if (!isOpen) { item.classList.add('open'); }
          });
        }
      });
    },
    loadResponses() {
      fetch('assets/data/responses.json')
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          if (data && data.total_responses) {
            this.updateCounters(data);
            this.initCharts(data);
          } else { this.initMockData(); }
        })
        .catch((err) => {
          console.warn('Using mock data:', err);
          this.initMockData();
        });
    },
    initMockData() {
      const mocks = {
        total_responses: 127,
        orgs_reached: 18,
        avg_cost: 1850,
        interest_pct: 72,
        daily_cost: { labels: ['Under 500','500-999','1000-1499','1500-2499','2500+'], data: [5,18,42,35,27] },
        cost_increase: { labels: ['<50%','50-100%','100-200%','>200%'], data: [10,28,52,37] },
        interest: { labels: ['Very Interested','Interested','Not Interested'], data: [72,23,5] },
        trust_features: { labels: ['Office ID','NIN+Face','Live Tracking','SOS','Female-only','Insurance','Ratings','Same Office'], data: [68,55,72,60,45,38,40,52] },
        corridors: { labels: ['Kubwa','Nyanya/Mararaba','Lugbe','Gwarinpa','Lokogoma'], data: [38,42,22,15,10] },
        employer_support: { labels: ['Very Likely','Maybe','Not Likely'], data: [68,22,10] }
      };
      this.updateCounters(mocks);
      this.initCharts(mocks);
    },
    updateCounters(data) {
      const get = (id) => document.getElementById(id);
      const total = get('total-responses');
      const orgs = get('orgs-reached');
      const cost = get('avg-cost');
      const interest = get('very-interested');
      const fmt = (v) => {
        if (typeof v !== 'number') return String(v);
        if (v >= 1000) return (v/1000).toFixed(v%1000===0?0:1).replace(/\.0$/,'')+'k';
        return String(v);
      };
      if (total) total.textContent = fmt(data.total_responses);
      if (orgs) orgs.textContent = fmt(data.orgs_reached || Math.round(data.total_responses/7));
      if (cost) cost.textContent = 'N' + (data.avg_cost || 1850).toLocaleString();
      if (interest) interest.textContent = (data.interest_pct || 72) + '%';
    },
    initCharts(data) {
      if (typeof Chart === 'undefined') return;
      this.destroyCharts();
      const mk = (id, type, labels, vals, colors, extra) => {
        const el = document.getElementById(id);
        if (!el) return;
        new Chart(el, {
          type: type,
          data: { labels: labels, datasets: [{ label: 'Respondents', data: vals, backgroundColor: colors, borderRadius: 6, borderColor: '#FFF', borderWidth: type === 'doughnut' ? 3 : 0 }] },
          options: Object.assign({ responsive: true, plugins: { legend: { display: false } } }, extra || {})
        });
      };
      mk('chart-daily-cost','bar',data.daily_cost.labels,data.daily_cost.data,['#E8F5E9','#C8E6C9','#A5D6A7','#81C784','#66BB6A']);
      mk('chart-cost-increase','bar',data.cost_increase.labels,data.cost_increase.data,['#FFF3E0','#FFE0B2','#FFCC80','#FFB300']);
      mk('chart-interest','doughnut',data.interest.labels,data.interest.data,['#1B5E20','#43A047','#81C784']);
      mk('chart-trust-features','bar',data.trust_features.labels,data.trust_features.data,'#1B5E20',{indexAxis:'y'});
      mk('chart-corridors','bar',data.corridors.labels,data.corridors.data,['#F9A825','#FDD835','#F9A825','#FDD835','#F9A825']);
      mk('chart-employer-support','doughnut',data.employer_support.labels,data.employer_support.data,['#1B5E20','#F9A825','#FFB300']);
    },
    destroyCharts() {
      if (typeof Chart !== 'undefined' && Chart.instances) {
        Object.values(Chart.instances).forEach((c) => { try { c.destroy(); } catch(e){} });
      }
    },
    initMailtoForms() {
      document.querySelectorAll('.mailto-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const subject = fd.get('subject') || 'Contact';
          let body = '';
          fd.forEach((v,k) => { if (k !== 'subject') body += k.replace(/_/g,' ') + ': ' + v + '\n'; });
          window.location.href = 'mailto:olandasolutions@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
      });
    }
  }));
});

