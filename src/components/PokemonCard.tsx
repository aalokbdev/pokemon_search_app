import Link from "next/link";
import Image from "next/image";
import { pokemon } from "../types/types";

export default function PokemonCard({ pokemon }: { pokemon: pokemon }) {
  return (
    <div
      className="max-w-sm bg-white  rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700 flex flex-col h-100"
      onClick={() => {
        window.location.href = `/${pokemon.name}`;
      }}
    >
      <div className="flex-1 bg-white flex items-center justify-center p-4 h-40 ">
        <Image
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt="card"
          width={200}
          height={200}
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="flex-1 bg-gray-50 p-5 flex flex-col items-start justify-evenly  gap-y-8 ">
        <h2 className="capitalize text-center font-semibold text-[#143D60] text-lg">
          {pokemon.name}
        </h2>
        <Link
          href={`/${pokemon.name}`}
          className="text-green-800 text-sm mt-6 hover:underline"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}
