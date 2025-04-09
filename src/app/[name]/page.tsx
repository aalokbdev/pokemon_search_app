import Image from "next/image";
import Link from "next/link";
import { getPokemon } from "../../services/pokemonService";

export default async function PokemonDetail({
  params,
}: {
  params: { name: string };
}) {
  const pokemon = await getPokemon(params.name);

  const types = pokemon.types
    .map((t: { type: { name: string } }) => t.type.name)
    .join(", ");
  const stats = pokemon.stats
    .map((s: { stat: { name: string } }) => s.stat.name)
    .join(", ");
  const abilities = pokemon.abilities
    .map((a: { ability: { name: string } }) => a.ability.name)
    .join(", ");
  const moves = pokemon.moves
    .slice(0, 6)
    .map((m: { move: { name: string } }) => m.move.name)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="flex mb-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-green-600 hover:underline "
              >
                <svg
                  className="w-3 h-3 me-2.5 text-green-600 font-semibold hover:underline block "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-green-600 font-semibold hover:underline mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ms-1 text-sm font-medium text-green-600  hover:underline md:ms-2 capitalize">
                  {pokemon.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <Link
          href="/"
          className="text-green-600 font-semibold hover:underline block mb-4"
        >
          &lt; Back
        </Link>

        <div className="flex justify-center items-center  min-h-[80vh]">
          <div className="w-full sm:w-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-teal-300 flex justify-center p-6">
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt="card"
                width={200}
                height={200}
              />
            </div>

            <div className="bg-yellow-200 text-gray-800 p-6 text-sm sm:text-base space-y-2">
              <p>
                <strong>Name:</strong> {pokemon.name}
              </p>
              <p>
                <strong>Type:</strong> {types}
              </p>
              <p>
                <strong>Stats:</strong> {stats}
              </p>
              <p>
                <strong>Abilities:</strong> {abilities}
              </p>
              <p>
                <strong>Some Moves:</strong> {moves}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
