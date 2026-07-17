"use client";

const studios = [
  {
    title: "Guitar Studio",
    description:
      "Learn worship guitar techniques, chords, tones and arrangements.",
  },
  {
    title: "Piano Studio",
    description:
      "Build worship piano skills, chord progressions and atmosphere.",
  },
  {
    title: "Vocal Studio",
    description:
      "Develop vocal confidence, harmony and worship expression.",
  },
  {
    title: "Rhythm Studio",
    description:
      "Master drums, timing, grooves and worship foundations.",
  },
];


export default function WorshipStudio() {
  return (
    <section className="px-6 py-32">

      <div className="mx-auto max-w-6xl">


        <div className="max-w-2xl">

          <h2 className="text-5xl font-bold tracking-tight">
            Worship Studio
          </h2>

          <p className="mt-5 text-lg text-neutral-400">
            A creative space for musicians to grow,
            practise and serve with excellence.
          </p>

        </div>



        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">


          {studios.map((studio) => (

            <div
              key={studio.title}
              className="
              group

              rounded-3xl

              border
              border-white/10

              bg-white/5

              p-8

              backdrop-blur-xl

              transition-all
              duration-500

              hover:-translate-y-4

              hover:border-purple-400/40

              hover:bg-white/10

              hover:shadow-[0_30px_80px_rgba(168,85,247,0.15)]
              "
            >

              <h3
                className="
                text-2xl
                font-semibold

                transition
                group-hover:text-purple-300
                "
              >
                {studio.title}
              </h3>


              <p className="mt-4 text-sm leading-6 text-neutral-400">
                {studio.description}
              </p>


              <button
                className="
                mt-8

                text-sm
                text-purple-300

                transition

                hover:text-white
                "
              >
                Explore →
              </button>


            </div>

          ))}


        </div>


      </div>


    </section>
  );
}