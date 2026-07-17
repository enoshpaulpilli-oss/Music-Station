"use client";

const features = [
  {
    title: "Create Your Band",
    description:
      "Build your worship team space and bring everyone together.",
  },
  {
    title: "Invite Members",
    description:
      "Share an invite link and collaborate with your musicians.",
  },
  {
    title: "Prepare Worship Sets",
    description:
      "Organise songs, keys, arrangements and rehearsal plans.",
  },
];


export default function BandWorkspace() {
  return (
    <section className="px-6 py-32">

      <div
        className="
        mx-auto
        max-w-6xl

        rounded-3xl

        border
        border-white/10

        bg-gradient-to-br
        from-white/10
        to-white/5

        p-10
        md:p-16

        backdrop-blur-xl
        "
      >


        <div className="max-w-3xl">

          <h2 className="text-5xl font-bold tracking-tight">
            Band Workspace
          </h2>


          <p className="mt-6 text-lg text-neutral-400">
            A collaborative space built for worship teams
            to create, communicate and prepare together.
          </p>


        </div>



        <div className="mt-12 grid gap-6 md:grid-cols-3">


          {features.map((feature) => (

            <div
              key={feature.title}

              className="
              rounded-2xl

              border
              border-white/10

              bg-black/20

              p-6

              transition-all
              duration-500

              hover:-translate-y-3

              hover:border-purple-400/40

              hover:bg-white/5
              "
            >


              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>


              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {feature.description}
              </p>


            </div>

          ))}


        </div>


        <button
          className="
          mt-12

          rounded-full

          bg-purple-600

          px-8
          py-4

          font-semibold

          transition-all
          duration-300

          hover:scale-105

          hover:bg-purple-500

          hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]
          "
        >
          Start Your Band
        </button>


      </div>


    </section>
  );
}