"use client";

import { useEffect, useState, useRef } from "react";
import {
  fetchAllPokemon,
  fetchPokemonByType,
  fetchTypes,
  searchPokemonByName,
} from "../services/pokemonService";
import { Pokemon } from "../types/types";
import PokemonCard from "./PokemonCard";

export default function SearchForm() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string>("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const LIMIT = 20;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const init = async () => {
    setIsLoading(true);
    try {
      const { results, next } = await fetchAllPokemon(0, LIMIT);
      const detailed = await Promise.all(
        results.map((p: { url: string }) =>
          fetch(p.url).then((res) => res.json())
        )
      );
      const allTypes = await fetchTypes();
      setPokemonList(detailed);
      setFilteredPokemonList(detailed);
      setTypes(allTypes);
      setOffset(LIMIT);
      if (!next) setHasMore(false);
    } catch (err) {
      console.error("Init fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetchByType = async () => {
      if (selectedType === "all") {
        setPokemonList([]);
        setOffset(0);
        setHasMore(true);
        await loadMorePokemon();
        return;
      }
      setIsLoading(true);
      try {
        const detailed = await fetchPokemonByType(selectedType);
        setPokemonList(detailed);
        setFilteredPokemonList(detailed);
        setHasMore(false);
      } catch (err) {
        console.error("Error fetching by type:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchByType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  useEffect(() => {
    if (!searchValue) {
      setSearchSubmitted(false);
      setFilteredPokemonList(pokemonList);
      setPokemon([]);
    }
  }, [searchValue, pokemonList]);

  const loadMorePokemon = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const { results, next } = await fetchAllPokemon(offset, LIMIT);
      const detailed = await Promise.all(
        results.map((p: { url: string }) =>
          fetch(p.url).then((res) => res.json())
        )
      );
      setPokemonList((prev) => [...prev, ...detailed]);
      setFilteredPokemonList((prev) => [...prev, ...detailed]);
      setOffset((prev) => prev + LIMIT);
      if (!next) setHasMore(false);
    } catch (err) {
      console.error("Error loading more Pokémon:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchSubmitted) return;
    setError("");
    setSearchSubmitted(true);
    if (!searchValue) {
      setFilteredPokemonList(pokemonList);
      setPokemon([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchPokemonByName(searchValue);
      setPokemon([data]);
    } catch (err) {
      setPokemon([]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !searchSubmitted
        ) {
          loadMorePokemon();
        }
      },
      { threshold: 1.0 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, searchSubmitted]);

  return (
    <div className="bg-gray-200 mb-6 p-4 rounded-lg">
      <form
        className="sticky top-0 z-10 bg-gray-200 p-4 flex flex-col md:flex-col gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="relative w-[40%] md:w-[40%]">
          <div className="absolute inset-y-0 right-5 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <select
            className="appearance-none border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full bg-white text-gray-700 shadow-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all" className="sm:text-2xl lg:text-xl md:text-xl">
              All
            </option>
            {types.map((type) => (
              <option
                key={type}
                value={type}
                className="capitalize sm:text-2xl lg:text-xl md:text-xl"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-[60%]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block p-2.5 pl-10 w-full text-gray-900 bg-white rounded-lg md:text-sm text-xs md:py-2.5 py-2"
          />
          <button
            type="submit"
            className={`absolute top-0 end-0 h-full px-4 text-xs md:text-sm font-medium text-white rounded-e-lg ${
              !searchValue.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#143D60] cursor-pointer"
            }`}
            disabled={!searchValue.trim()}
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && pokemon.length === 0 && !searchSubmitted ? (
        <p className="text-center text-2xl text-gray-500 min-h-screen">
          Loading...
        </p>
      ) : isLoading && pokemon.length === 0 ? (
        <p className="text-center text-xl text-gray-500 mt-6 min-h-screen">
          Searching...
        </p>
      ) : searchSubmitted && pokemon.length === 0 ? (
        <p className="text-center text-xl text-red-300 mt-6 min-h-screen">
          No Pokémon Found
        </p>
      ) : pokemon.length > 0 || error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 min-h-screen">
          {pokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredPokemonList.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
          {hasMore && (
            <div ref={loadMoreRef} className="col-span-full text-center py-6">
              {isLoading ? "Loading more..." : "Scroll to load more"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
