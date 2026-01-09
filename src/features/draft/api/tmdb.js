// NEW: TMDB API helpers (search + poster URL builder)

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getApiKey() {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key) {
    throw new Error('Missing VITE_TMDB_API_KEY in .env');
  }
  return key;
}

// NEW: build a full poster url from poster_path
export function getPosterUrl(posterPath, size = 'w342') {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

// NEW: search movies by text
export async function searchMovies(query) {
  const apiKey = getApiKey();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = new URL(`${TMDB_BASE}/search/movie`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('query', trimmed);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'en-US');
  url.searchParams.set('page', '1');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  const data = await res.json();

  // NEW: normalize to the fields we care about
  return (data.results ?? []).map((m) => {
    const year = m.release_date ? m.release_date.slice(0, 4) : '';
    return {
      tmdbId: m.id,
      title: m.title,
      year,
      posterPath: m.poster_path,
      posterUrl: getPosterUrl(m.poster_path, 'w342'),
    };
  });
}
