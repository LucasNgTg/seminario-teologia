(() => {
  const cfg = window.APP_CONFIG;
  const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const questions = window.EXPERIMENT_QUESTIONS;

  let rows = [];
  let stage = 1;
  let questionIndex = 0;
  let refreshTimer = null;
  let realtimeChannel = null;
  let dashboardStarted = false;

  const values = Array.from({ length: 11 }, (_, value) => value);

  function getDistribution(items, field) {
    const counts = Array(11).fill(0);

    items.forEach(item => {
      const value = item[field];
      if (Number.isInteger(value) && value >= 0 && value <= 10) {
        counts[value]++;
      }
    });

    const total = counts.reduce((sum, count) => sum + count, 0);

    return counts.map((count, value) => ({
      value,
      count,
      percentage: total ? count / total * 100 : 0
    }));
  }

  function renderMiniColumns(question, items) {
    const distribution = getDistribution(items, question.field);
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    const columns = distribution.map(item => `
      <div class="mini-column" title="${item.value}: ${item.count} (${item.percentage.toFixed(1)}%)">
        <span class="mini-count">${item.count || ''}</span>
        <div class="mini-track">
          <div class="mini-bar" style="height:${item.percentage}%"></div>
        </div>
        <span class="mini-label">${item.value}</span>
      </div>
    `).join('');

    return `
      <article class="overview-card">
        <h3>${question.label}</h3>
        <div class="overview-chart-meta">${total}</div>
        <div class="mini-chart">${columns}</div>
      </article>
    `;
  }

  function renderHorizontalDistribution(question, items) {
    const distribution = getDistribution(items, question.field);
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    const bars = distribution.map(item => `
      <div class="horizontal-row" title="${item.value}: ${item.count} respostas">
        <span class="horizontal-label">${item.value}</span>
        <div class="horizontal-track">
          <div class="horizontal-bar" style="width:${item.percentage}%"></div>
        </div>
        <span class="horizontal-value">${item.count} <small>${item.percentage.toFixed(0)}%</small></span>
      </div>
    `).join('');

    return `
      <p class="panel-total">${total}</p>
      <div class="horizontal-chart">${bars}</div>
    `;
  }

  function renderSplitColumns(question, items) {
    const distribution = getDistribution(items, question.field);
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    const columns = distribution.map(item => `
      <div class="detail-column" title="${item.value}: ${item.count} (${item.percentage.toFixed(1)}%)">
        <span class="detail-count">${item.count || ''}</span>
        <div class="detail-track">
          <div class="detail-bar" style="height:${item.percentage}%"></div>
        </div>
        <span class="detail-label">${item.value}</span>
      </div>
    `).join('');

    return `
      <p class="panel-total">${total}</p>
      <div class="detail-column-chart">${columns}</div>
    `;
  }

  function renderOverview() {
    $('aggregate-grid').innerHTML = questions
      .map(question => renderMiniColumns(question, rows))
      .join('');
  }

  function renderDetail() {
    const question = questions[questionIndex];
    const firstGroup = rows.filter(row => row.condition_code === 'A');
    const secondGroup = rows.filter(row => row.condition_code === 'B');

    $('detail-question-title').textContent = question.label;
    $('total-chart').innerHTML = renderHorizontalDistribution(question, rows);
    $('first-split-chart').innerHTML = renderSplitColumns(question, firstGroup);
    $('second-split-chart').innerHTML = renderSplitColumns(question, secondGroup);

    $('question-page').textContent = `${questionIndex + 1} / ${questions.length}`;
    $('question-prev').disabled = questionIndex === 0;
    $('question-next').disabled = questionIndex === questions.length - 1;
  }

  function render() {
    $('overview-stage').hidden = stage !== 1;
    $('detail-stage').hidden = stage !== 2;
    $('response-count').textContent = `${rows.length} respostas`;

    if (stage === 1) {
      renderOverview();
    } else {
      renderDetail();
    }
  }

  async function refresh() {
    const { data, error } = await db
      .from('experiment_responses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao carregar respostas:', error);
      $('login-status').textContent = 'Não foi possível carregar as respostas.';
      return;
    }

    rows = data || [];
    if (dashboardStarted) render();
  }

  async function startDashboard() {
    if (dashboardStarted) return;
    dashboardStarted = true;

    $('login').hidden = true;
    $('dashboard').hidden = false;

    await refresh();
    render();

    realtimeChannel = db.channel('experiment-live')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'experiment_responses'
      }, refresh)
      .subscribe();

    refreshTimer = setInterval(refresh, 5000);
  }

  $('stage-next').addEventListener('click', () => {
    stage = 2;
    questionIndex = 0;
    render();
  });

  $('stage-prev').addEventListener('click', () => {
    stage = 1;
    render();
  });

  $('question-prev').addEventListener('click', () => {
    if (questionIndex > 0) {
      questionIndex--;
      renderDetail();
    }
  });

  $('question-next').addEventListener('click', () => {
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderDetail();
    }
  });

  $('login-form').addEventListener('submit', async event => {
    event.preventDefault();
    $('login-btn').disabled = true;
    $('login-status').textContent = '';

    const { error } = await db.auth.signInWithPassword({
      email: $('email').value.trim(),
      password: $('password').value
    });

    if (error) {
      $('login-status').textContent = 'Falha no login.';
      $('login-btn').disabled = false;
      return;
    }

    await startDashboard();
  });

  $('logout-btn').addEventListener('click', async () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }

    if (realtimeChannel) {
      await db.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }

    await db.auth.signOut();
    rows = [];
    stage = 1;
    questionIndex = 0;
    dashboardStarted = false;

    $('dashboard').hidden = true;
    $('login').hidden = false;
    $('password').value = '';
    $('login-btn').disabled = false;
  });

  db.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Erro ao recuperar sessão:', error);
      return;
    }
    if (data.session) startDashboard();
  });
})();
