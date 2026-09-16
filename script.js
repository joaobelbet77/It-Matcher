<<<<<<< HEAD
let currentJob = null;
let tempSkills = [];

function addSkillToJob() {
  const nameInput = document.getElementById('skillName');
  const weightInput = document.getElementById('skillWeight');
  const name = nameInput.value.trim();
  const weight = parseInt(weightInput.value, 10) || 1;

  if (!name) return;

  tempSkills.push({ name, weight });
  nameInput.value = '';
  weightInput.value = '';
  renderTempSkills();
}

function renderTempSkills() {
  const container = document.getElementById('jobSkillsList');
  container.innerHTML = tempSkills
    .map((s) => `<span class="badge-skill">${s.name} • P${s.weight}</span>`)
    .join('');
}

function saveJob() {
  const titleInput = document.getElementById('jobTitle');
  const title = titleInput.value.trim();

  if (!title || tempSkills.length === 0) {
    alert('Especifique o título da vaga e insira pelo menos uma skill.');
    return;
  }

  currentJob = {
    title: title,
    skills: [...tempSkills]
  };

  alert(`Vaga "${title}" gravada no sistema com sucesso.`);


  tempSkills = [];
  titleInput.value = '';
  renderTempSkills();
}

function processMatch() {
  if (!currentJob) {
    alert('Cadastre uma vaga antes de processar candidatos.');
    return;
  }

  const name = document.getElementById('candidateName').value.trim();
  const rawSkills = document.getElementById('candidateSkills').value.trim();

  if (!name || !rawSkills) {
    alert('Preencha os dados completos do candidato.');
    return;
  }

  const candidateSkillsArr = rawSkills
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  let totalWeight = 0;
  let matchedWeight = 0;
  let matchingSkills = [];
  let missingSkills = [];

  currentJob.skills.forEach((req) => {
    totalWeight += req.weight;
    const reqLower = req.name.toLowerCase();

    if (candidateSkillsArr.includes(reqLower)) {
      matchedWeight += req.weight;
      matchingSkills.push(req.name);
    } else {
      missingSkills.push(req.name);
    }
  });

  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  renderMatchResult(name, score, matchingSkills, missingSkills);

  document.getElementById('candidateName').value = '';
  document.getElementById('candidateSkills').value = '';
}

function renderMatchResult(name, score, matched, missing) {
  const container = document.getElementById('resultsContainer');

  if (container.querySelector('.empty-state')) {
    container.innerHTML = '';
  }

  let scoreClass = 'score-low';
  let barColor = 'var(--accent-rose)';

  if (score >= 70) {
    scoreClass = 'score-high';
    barColor = 'var(--accent-emerald)';
  } else if (score >= 40) {
    scoreClass = 'score-mid';
    barColor = 'var(--accent-amber)';
  }

  const matchedTags = matched.length
    ? matched.map((s) => `<span class="tag-match">${s}</span>`).join('')
    : '<span style="color:var(--text-muted)">Nenhuma</span>';

  const missingTags = missing.length
    ? missing.map((s) => `<span class="tag-missing">${s}</span>`).join('')
    : '<span style="color:var(--text-muted)">Nenhum</span>';

  const cardHTML = `
    <div class="match-item">
      <div class="match-item-header">
        <div class="candidate-info">
          <h4>${name}</h4>
          <p>Alvo: ${currentJob.title}</p>
        </div>
        <div class="score-badge ${scoreClass}">${score}%</div>
      </div>

      <div class="progress-track">
        <div class="progress-bar" style="width: ${score}%; background-color: ${barColor};"></div>
      </div>

      <div class="match-details">
        <div class="detail-col found">
          <h5>Encontradas</h5>
          <div class="tag-cloud">
            ${matchedTags}
          </div>
        </div>
        <div class="detail-col missing">
          <h5>Gaps / Faltantes</h5>
          <div class="tag-cloud">
            ${missingTags}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = cardHTML + container.innerHTML;
}
=======
const JOBS_DATA = [
  {
    id: 'job-1',
    title: 'Desenvolvedor Frontend Next.js & React',
    company: 'TechFlow Solutions',
    location: 'São Paulo, SP',
    workModel: 'Remoto',
    level: 'Pleno',
    salary: 'R$ 7.500 - R$ 9.500',
    description: 'Buscamos desenvolvedor(a) frontend com sólida experiência em React, Next.js e TypeScript para atuar na criação de aplicações web de alto desempenho e interfaces modernas.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Git'],
    postedAt: 'Há 1 dia'
  },
  {
    id: 'job-2',
    title: 'Desenvolvedor Full Stack Node & TypeScript',
    company: 'Nexus Digital',
    location: 'Belo Horizonte, MG',
    workModel: 'Remoto',
    level: 'Sênior',
    salary: 'R$ 11.000 - R$ 14.000',
    description: 'Oportunidade para atuar em arquitetura de microserviços escaláveis, APIs REST/GraphQL em Node.js e interfaces integradas em React.',
    skills: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    postedAt: 'Há 2 dias'
  },
  {
    id: 'job-3',
    title: 'Engenheiro de Software Backend (Python / Django)',
    company: 'CloudScale Data',
    location: 'Curitiba, PR',
    workModel: 'Híbrido',
    level: 'Pleno',
    salary: 'R$ 8.000 - R$ 10.500',
    description: 'Venha desenvolver pipelines de dados e APIs robustas utilizando Python, FastAPI/Django e bancos relacionais em infraestrutura de nuvem.',
    skills: ['Python', 'SQL', 'Django', 'Docker', 'Git'],
    postedAt: 'Há 3 dias'
  },
  {
    id: 'job-4',
    title: 'Desenvolvedor Mobile (Flutter / React Native)',
    company: 'Appfy Mobile',
    location: 'Florianópolis, SC',
    workModel: 'Remoto',
    level: 'Júnior / Pleno',
    salary: 'R$ 5.500 - R$ 7.500',
    description: 'Desenvolvimento e publicação de aplicativos móveis iOS e Android com foco em excelente experiência de usuário e consumo de APIs REST.',
    skills: ['Flutter', 'Dart', 'Git', 'Firebase', 'REST APIs'],
    postedAt: 'Há 4 dias'
  }
];

let candidateProfile = {
  name: 'Carlos Eduardo Silva',
  email: 'carlos.silva@email.com',
  skills: 'React, TypeScript, Node.js, Next.js, Git, SQL, Tailwind CSS'
};

let myApplications = [];
let currentFilterModel = 'Todos';
let activeApplyingJob = null;

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (isDark) {
    icon.className = 'fa-solid fa-sun';
    text.textContent = 'Modo Claro';
  } else {
    icon.className = 'fa-solid fa-moon';
    text.textContent = 'Modo Escuro';
  }
}

function switchTab(tabId, el) {
  document.querySelectorAll('.nav-item').forEach((btn) => btn.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.tab-content').forEach((tab) => (tab.style.display = 'none'));
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.style.display = 'block';

  const titleEl = document.getElementById('pageTitle');
  const subtitleEl = document.getElementById('pageSubtitle');

  switch (tabId) {
    case 'jobs':
      titleEl.textContent = 'Vagas em Tecnologia';
      subtitleEl.textContent = 'Descubra oportunidades e veja sua compatibilidade em tempo real';
      break;
    case 'applications':
      titleEl.textContent = 'Minhas Candidaturas';
      subtitleEl.textContent = 'Acompanhe as vagas para as quais você enviou seu perfil';
      renderApplications();
      break;
    case 'profile':
      titleEl.textContent = 'Meu Perfil Profissional';
      subtitleEl.textContent = 'Gerencie suas habilidades para calcular o match automaticamente';
      break;
    case 'about':
      titleEl.textContent = 'Sobre o ItMatcher';
      subtitleEl.textContent = 'Conheça nosso propósito e como simplificamos a busca por empregos em tecnologia';
      break;
  }
}

function calculateScore(candidateSkillsStr, jobSkillsArr) {
  if (!candidateSkillsStr.trim()) return 0;
  const cSkills = candidateSkillsStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  let matched = 0;
  jobSkillsArr.forEach((s) => {
    const sLower = s.toLowerCase();
    if (cSkills.some((cs) => cs === sLower || cs.includes(sLower) || sLower.includes(cs))) {
      matched++;
    }
  });
  return Math.round((matched / jobSkillsArr.length) * 100);
}

function renderJobs() {
  const container = document.getElementById('jobsListContainer');
  const search = (document.getElementById('jobSearchInput')?.value || '').toLowerCase();

  const filtered = JOBS_DATA.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      job.skills.some((s) => s.toLowerCase().includes(search));

    const matchesModel = currentFilterModel === 'Todos' || job.workModel === currentFilterModel;
    return matchesSearch && matchesModel;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-muted); font-size:0.85rem;">Nenhuma vaga encontrada com os filtros selecionados.</div>';
    return;
  }

  container.innerHTML = filtered
    .map((job) => {
      const score = calculateScore(candidateProfile.skills, job.skills);
      const isApplied = myApplications.some((a) => a.jobId === job.id);

      return `
        <div class="job-card">
          <div class="job-header">
            <div>
              <span class="job-company">${job.company}</span>
              <h3 class="job-title">${job.title}</h3>
              <div class="job-meta">📍 ${job.location} • <strong>${job.workModel}</strong> • ${job.level}</div>
            </div>
            <div class="job-salary-badge">${job.salary}</div>
          </div>

          <p class="job-desc">${job.description}</p>

          <div class="job-skills">
            ${job.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
          </div>

          <div class="job-footer">
            <span class="match-pill">${score}% de Match com seu perfil</span>
            ${
              isApplied
                ? '<span style="font-size:0.75rem; font-weight:bold; color:var(--primary);">✓ Já Candidatado</span>'
                : `<button class="btn-apply" onclick="openApplyModal('${job.id}')">Ver Detalhes & Candidatar-se &rarr;</button>`
            }
          </div>
        </div>
      `;
    })
    .join('');
}

function filterJobs() {
  renderJobs();
}

function filterByModel(model, el) {
  currentFilterModel = model;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderJobs();
}

function openApplyModal(jobId) {
  const job = JOBS_DATA.find((j) => j.id === jobId);
  if (!job) return;

  activeApplyingJob = job;
  const score = calculateScore(candidateProfile.skills, job.skills);

  const modal = document.getElementById('applyModal');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div style="margin-bottom:1rem;">
      <span style="font-size:0.75rem; font-weight:800; color:var(--primary); text-transform:uppercase;">${job.company}</span>
      <h2 style="font-size:1.25rem; font-weight:900; margin-top:2px;">${job.title}</h2>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">📍 ${job.location} • ${job.workModel} • ${job.salary}</p>
    </div>

    <div style="padding:0.75rem; background:var(--input-bg); border-radius:10px; font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
      ${job.description}
    </div>

    <form onsubmit="submitApplication(event)">
      <div class="form-group">
        <label>Seu Nome Completo</label>
        <input type="text" id="applyName" value="${candidateProfile.name}" required />
      </div>

      <div class="form-group">
        <label>Seu E-mail</label>
        <input type="email" id="applyEmail" value="${candidateProfile.email}" required />
      </div>

      <div class="form-group">
        <label>Suas Habilidades (separadas por vírgula)</label>
        <textarea id="applySkills" rows="3" required oninput="updateModalScore()">${candidateProfile.skills}</textarea>
      </div>

      <div id="modalScoreBox" style="padding:0.75rem; background:var(--primary-light); border:1px solid var(--primary-border); border-radius:10px; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:bold;">
        <span>Seu Match com a vaga:</span>
        <span style="color:var(--primary);">${score}% Compatível</span>
      </div>

      <button type="submit" class="btn-block">Enviar Minha Candidatura &rarr;</button>
    </form>
  `;

  modal.style.display = 'flex';
}

function updateModalScore() {
  if (!activeApplyingJob) return;
  const skills = document.getElementById('applySkills').value;
  const score = calculateScore(skills, activeApplyingJob.skills);
  const box = document.getElementById('modalScoreBox');
  if (box) {
    box.innerHTML = `
      <span>Seu Match com a vaga:</span>
      <span style="color:var(--primary);">${score}% Compatível</span>
    `;
  }
}

function closeApplyModal() {
  document.getElementById('applyModal').style.display = 'none';
  activeApplyingJob = null;
}

function submitApplication(e) {
  e.preventDefault();
  if (!activeApplyingJob) return;

  const name = document.getElementById('applyName').value;
  const email = document.getElementById('applyEmail').value;
  const skills = document.getElementById('applySkills').value;
  const score = calculateScore(skills, activeApplyingJob.skills);

  myApplications.unshift({
    id: `app-${Date.now()}`,
    jobId: activeApplyingJob.id,
    jobTitle: activeApplyingJob.title,
    company: activeApplyingJob.company,
    score,
    appliedAt: new Date().toLocaleDateString('pt-BR')
  });

  const countBadge = document.getElementById('appCountBadge');
  if (countBadge) countBadge.textContent = myApplications.length;

  alert(`🎉 Candidatura enviada com sucesso para a vaga de "${activeApplyingJob.title}" na empresa ${activeApplyingJob.company}!`);
  closeApplyModal();
  renderJobs();
}

function renderApplications() {
  const container = document.getElementById('applicationsContainer');
  if (myApplications.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:3rem;">
        <p style="font-size:1.1rem; font-weight:800; margin-bottom:0.5rem;">Você ainda não se candidatou a nenhuma vaga</p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Navegue pelas vagas abertas e envie seu perfil em 1 clique!</p>
        <button class="btn btn-primary" onclick="switchTab('jobs')">Ver Vagas Abertas</button>
      </div>
    `;
    return;
  }

  container.innerHTML = myApplications
    .map(
      (app) => `
      <div class="card" style="margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; font-weight:bold; color:var(--primary);">${app.company}</span>
          <h4 style="font-size:1rem; font-weight:800; margin-top:2px;">${app.jobTitle}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted);">Enviada em ${app.appliedAt}</p>
        </div>
        <span class="match-pill">${app.score}% Match</span>
      </div>
    `
    )
    .join('');
}

let currentAuthMode = 'register';

function openAuthModal(mode = 'register') {
  currentAuthMode = mode;
  setAuthMode(mode);
  document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function setAuthMode(mode) {
  currentAuthMode = mode;
  const isReg = mode === 'register';
  document.getElementById('tabAuthRegister').className = isReg ? 'filter-btn active' : 'filter-btn';
  document.getElementById('tabAuthLogin').className = isReg ? 'filter-btn' : 'filter-btn active';

  document.getElementById('authNameGroup').style.display = isReg ? 'block' : 'none';
  document.getElementById('authRoleGroup').style.display = isReg ? 'block' : 'none';
  document.getElementById('authModalTitle').textContent = isReg ? 'Criar Nova Conta no ItMatcher' : 'Entrar na Minha Conta';
  document.getElementById('authSubmitBtn').textContent = isReg ? 'Criar Conta e Acessar' : 'Entrar na Conta';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('authInputName').value.trim();
  const email = document.getElementById('authInputEmail').value.trim();
  const role = document.getElementById('authInputRole').value.trim();

  if (currentAuthMode === 'register') {
    candidateProfile.name = name || 'Novo Candidato';
    candidateProfile.email = email;
    candidateProfile.role = role || 'Desenvolvedor de Software';
  } else {
    candidateProfile.email = email;
    if (name) candidateProfile.name = name;
  }

  updateProfileUI();
  closeAuthModal();
  alert(currentAuthMode === 'register' ? '🎉 Conta criada com sucesso!' : '✅ Login realizado com sucesso!');
  renderJobs();
}

function logoutAccount() {
  if (confirm('Deseja realmente sair da sua conta?')) {
    candidateProfile = {
      name: 'Visitante',
      email: '',
      role: 'Sem conta',
      skills: ''
    };
    updateProfileUI();
    alert('Você saiu da sua conta.');
    switchTab('jobs');
    renderJobs();
  }
}

function updateProfileUI() {
  const name = candidateProfile.name || 'Minha Conta';
  const role = candidateProfile.role || 'Ver Perfil';
  const firstLetter = name.charAt(0).toUpperCase() || '👤';

  // Sidebar
  const sbName = document.getElementById('sidebarName');
  const sbRole = document.getElementById('sidebarRole');
  const avatarLetter = document.getElementById('avatarLetter');
  if (sbName) sbName.textContent = name;
  if (sbRole) sbRole.textContent = role;
  if (avatarLetter) avatarLetter.textContent = firstLetter;

  // Header no profile
  const pName = document.getElementById('profileDisplayName');
  const pRole = document.getElementById('profileDisplayRole');
  const pEmail = document.getElementById('profileDisplayEmail');
  const pAvatar = document.getElementById('profileHeaderAvatar');
  const pAppsCount = document.getElementById('profileAppsCount');
  if (pName) pName.textContent = name;
  if (pRole) pRole.textContent = role;
  if (pEmail) pEmail.textContent = `📧 ${candidateProfile.email || 'sem e-mail'} • 📍 São Paulo, SP`;
  if (pAvatar) pAvatar.textContent = firstLetter;
  if (pAppsCount) pAppsCount.textContent = `${myApplications.length} vagas`;

  // Form fields
  const inpName = document.getElementById('profileName');
  const inpEmail = document.getElementById('profileEmail');
  const inpRole = document.getElementById('profileRole');
  const inpSkills = document.getElementById('profileSkills');
  if (inpName) inpName.value = candidateProfile.name || '';
  if (inpEmail) inpEmail.value = candidateProfile.email || '';
  if (inpRole) inpRole.value = candidateProfile.role || '';
  if (inpSkills) inpSkills.value = candidateProfile.skills || '';

  const preview = document.getElementById('currentSkillsPreview');
  if (preview) preview.textContent = candidateProfile.skills || 'Nenhuma habilidade adicionada';
}

function saveProfile(e) {
  e.preventDefault();
  candidateProfile.name = document.getElementById('profileName').value.trim();
  candidateProfile.email = document.getElementById('profileEmail').value.trim();
  candidateProfile.role = document.getElementById('profileRole').value.trim();
  candidateProfile.skills = document.getElementById('profileSkills').value.trim();

  updateProfileUI();
  alert('Perfil atualizado com sucesso! Todas as vagas foram recalculadas com seu novo match.');
  renderJobs();
}

// Inicialização
updateProfileUI();
renderJobs();
>>>>>>> origin/v1
