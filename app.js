app.js
const artists = [
  { name: 'Artriana', flag: '🇩🇪' },
  { name: 'Womb', flag: '🇮🇹' },
  { name: 'Stats (Spilled)', flag: '🇵🇱' },
  { name: 'Yourfavflopsender', flag: '🇺🇸' },
  { name: 'Princess Glambur', flag: '🇫🇷' },
  { name: 'Billoga', flag: '🇧🇪' },
  { name: 'Ariclocksurfavs', flag: '🇮🇱' },
  { name: 'Bigacie Floprams', flag: '🇬🇧' }
];

const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
const HAS_SUPABASE = !(SUPABASE_URL.includes('YOUR-PROJECT-ID') || SUPABASE_ANON_KEY.includes('YOUR-ANON-KEY'));

let currentArtist = null;
let score = 1;

const ss = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  read(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
};

function createArtistCard(artist) {
  const card = document.createElement('article');
  card.className = 'artist-card';
  card.dataset.artist = artist.name;
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Voter pour ${artist.name}`);

  card.innerHTML = `
    <div>
      <div class="flag">${artist.flag}</div>
      <h3>${artist.name}</h3>
    </div>
    <div class="artist-meta">
      <span class="dot"></span>
      <span>Vote</span>
    </div>
  `;

  card.addEventListener('click', () => openVoteModal(artist.name));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openVoteModal(artist.name);
    }
  });

  return card;
}

function openVoteModal(artistName) {
  currentArtist = artistName;
  score = 1;
  const modal = document.getElementById('vote-modal');
  const title = document.getElementById('modal-title');
  const scoreValue = document.getElementById('score-value');

  title.textContent = artistName;
  scoreValue.textContent = score;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeVoteModal() {
  const modal = document.getElementById('vote-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function updateScoreValue() {
  const scoreValue = document.getElementById('score-value');
  scoreValue.textContent = score;
}

function bindModalControls() {
  const modal = document.getElementById('vote-modal');
  const minus = document.querySelector('.score-button.minus');
  const plus = document.querySelector('.score-button.plus');
  const closeBtn = document.querySelector('.modal-close');

  minus.addEventListener('click', () => {
    score = Math.max(1, score - 1);
    updateScoreValue();
  });

  plus.addEventListener('click', () => {
    score = Math.min(3, score + 1);
    updateScoreValue();
  });

  closeBtn.addEventListener('click', closeVoteModal);

  modal.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') {
      closeVoteModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeVoteModal();
    }
  });
}

function saveVoteToStorage(artistName, points) {
  const votes = ss.read('endervision-votes') || [];
  votes.push({ artistName, points, createdAt: new Date().toISOString() });
  ss.save('endervision-votes', votes);
}

async function saveVoteToSupabase(artistName, points) {
  if (!HAS_SUPABASE) {
    saveVoteToStorage(artistName, points);
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { error } = await supabase.from('votes').insert([
    {
      artist_name: artistName,
      points,
      created_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error(error);
    saveVoteToStorage(artistName, points);
    alert('Le vote a été enregistré localement car la base de données n’est pas encore configurée.');
  }
}

async function submitVote() {
  if (!currentArtist) return;

  await saveVoteToSupabase(currentArtist, score);
  closeVoteModal();
  alert(`Merci ! Votre vote pour ${currentArtist} a bien été pris en compte.`);
}

function initVotes() {
  const grid = document.getElementById('artist-grid');
  artists.forEach((artist) => {
    grid.appendChild(createArtistCard(artist));
  });

  bindModalControls();
  document.getElementById('submit-vote').addEventListener('click', submitVote);
}

window.addEventListener('DOMContentLoaded', initVotes);