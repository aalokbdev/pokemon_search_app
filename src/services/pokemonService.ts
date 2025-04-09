const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const FETCH_TYPES = process.env.NEXT_PUBLIC_FETCH_TYPES!;

export const fetchAllPokemon = async (offset: number, limit: number) => {
  const res = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch all Pokémon");
  return res.json();
};

export const fetchTypes = async () => {
  const res = await fetch(`${FETCH_TYPES}`);
  if (!res.ok) throw new Error("Failed to fetch types");
  const data = await res.json();
  return data.results.map((t: { name: string }) => t.name);
};

export const fetchPokemonByType = async (type: string) => {
  const res = await fetch(`${FETCH_TYPES}/${type}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon by type");
  const data = await res.json();
  const urls = data.pokemon.map(
    (p: { pokemon: { url: string } }) => p.pokemon.url
  );
  return Promise.all(
    urls.map((url: string) => fetch(url).then((res) => res.json()))
  );
};

export const searchPokemonByName = async (name: string) => {
  const res = await fetch(`${BASE_URL}/${name.toLowerCase()}`);
  if (!res.ok) throw new Error("Pokémon not found");
  return res.json();
};

export const getPokemon = async (name: string) => {
  const res = await fetch(`${BASE_URL}/${name}`);
  return res.json();
};
