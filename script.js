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