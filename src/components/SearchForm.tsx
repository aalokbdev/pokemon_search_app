"use client";

import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  fetchAllPokemon,
  fetchPokemonByType,
  fetchTypes,
  searchPokemonByName,
} from "../services/pokemonService";
import { Pokemon, RowProps } from "../types/types";
import PokemonCard from "./PokemonCard";

export default function SearchForm() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string>("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const LIMIT = 20;

  useEffect(() => {
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

  // Handle search
  useEffect(() => {
    if (!searchValue) {
      setSearchSubmitted(false);
      setFilteredPokemonList(pokemonList);
      setPokemon([]);
    }
  }, [searchValue, pokemonList]);

  const loadMorePokemon = async () => {
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
    } catch (err ) {
      setPokemon([]); 
      console.error(err)
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsRendered = (
    { visibleStopIndex }: { visibleStopIndex: number },
    rowCount: number
  ) => {
    if (visibleStopIndex >= rowCount - 1 && hasMore && !isLoading) {
      loadMorePokemon();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const ROW_HEIGHT = 450;

  const Row = ({ index, style, data }: RowProps) => {
    const { itemsPerRow, list } = data;
    const startIndex = index * itemsPerRow;
    const rowItems = [];

    for (let i = 0; i < itemsPerRow; i++) {
      const p = list[startIndex + i];
      rowItems.push(
        <div
          key={p?.id || `empty-${i}`}
          className="w-full sm:w-1/2 lg:w-1/3 p-2"
        >
          {p ? <PokemonCard pokemon={p} /> : null}
        </div>
      );
    }

    return (
      <div style={style} className="flex flex-wrap w-full">
        {rowItems}
      </div>
    );
  };

  return (
    <div className="bg-gray-200 mb-6 p-4 rounded-lg">
      <form
        className="sticky top-0 z-10 bg-gray-200 p-4 flex flex-col gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="relative w-[40%]">
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
            <option value="all">Select...</option>
            {types.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-[60%]">
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
            className="block p-2.5 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg"
          />
          <button
            type="submit"
            className="absolute top-0 end-0 h-full px-4 text-sm font-medium text-white bg-[#143D60] rounded-e-lg"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-center text-2xl text-gray-500">Loading...</p>
      ) : searchSubmitted && pokemon.length === 0 ? (
        <p className="text-center text-xl text-red-300 mt-6">
          No Pokémon Found
        </p>
      ) : pokemon.length > 0 || error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 min-h-screen">
          {pokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      ) : !searchSubmitted ? (
        <div className="h-[80vh] w-full overflow-auto scrollbar-hide">
          <AutoSizer>
            {({ height, width }) => {
              const itemsPerRow = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
              const rowCount = Math.ceil(
                filteredPokemonList.length / itemsPerRow
              );

              return (
                <List
                  height={height}
                  width={width}
                  itemCount={rowCount}
                  itemSize={ROW_HEIGHT}
                  onItemsRendered={(props) =>
                    handleItemsRendered(props, rowCount)
                  }
                  itemData={{ itemsPerRow, list: filteredPokemonList }}
                >
                  {Row}
                </List>
              );
            }}
          </AutoSizer>
        </div>
      ) : null}
    </div>
  );
}
