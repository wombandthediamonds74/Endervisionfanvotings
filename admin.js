admin.js
const ADMIN_PASSWORD = 'Streamhades032726';
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
const HAS_SUPABASE = !(SUPABASE_URL.includes('YOUR-PROJECT-ID') || SUPABASE_ANON_KEY.includes('YOUR-ANON-KEY'));

const loginBox = document.getElementById('login-box');
const resultsBox = document.getElementById('results-box');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const resultsBody = document.getElementById('results-body');
const passwordInput = document.getElementById('admin-password');

function isLoggedIn() {
  return sessionStorage.getItem('endervision-admin') === 'true';
}

function showResults() {
  loginBox.classList.add('hidden');
  resultsBox.classList.remove('hidden');
}

function hideResults() {
  loginBox.classList.remove('hidden');
  resultsBox.classList.add('hidden');
  sessionStorage.removeItem('endervision-admin');
  passwordInput.value = '';
}

function renderResults(rows) {
  const totals = {};

  rows.forEach((row) => {
    const artist = row.artist_name || row.artistName;
    if (!totals[artist]) {
      totals[artist] = { points: 0, votes: 0 };
    }

    totals[artist].points += Number(row.points || 0);
    totals[artist].votes += 1;
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1].points - a[1].points);

  if (!sorted.length) {
    resultsBody.innerHTML = '<tr><td colspan="3">Aucun vote pour le moment.</td></tr>';
    return;
  }

  resultsBody.innerHTML = sorted
    .map(([artist, data]) => `
      <tr>
        <td>${artist}</td>
        <td>${data.points}</td>
        <td>${data.votes}</td>
      </tr>
    `)
    .join('');
}

async function loadVotes() {
  if (HAS_SUPABASE) {
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('votes').select('*');

    if (!error) {
      renderResults(data);
      return;
    }

    console.error(error);
  }

  const fallback = JSON.parse(localStorage.getItem('endervision-votes') || '[]');
  renderResults(fallback);
}

function handleLogin() {
  const enteredPassword = passwordInput.value.trim();

  if (enteredPassword === ADMIN_PASSWORD) {
    sessionStorage.setItem('endervision-admin', 'true');
    showResults();
    loadVotes();
  } else {
    alert('Mot de passe incorrect.');
  }
}

loginButton.addEventListener('click', handleLogin);
logoutButton.addEventListener('click