"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up once and unlock your personal Music Space dashboard.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Choose a music tool",
    description:
      "Open chord tools, ear training, practice tools, instrument labs and more.",
    icon: "♫",
  },
  {
    number: "03",
    title: "Practice and create",
    description:
      "Learn, experiment and build musical ideas without jumping between different apps.",
    icon: "⌁",
  },
  {
    number: "04",
    title: "Keep everything together",
    description:
      "Return to one organised space designed around your music journey.",
    icon: "◈",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="
        relative
        isolate
        overflow-hidden
        bg-black
        px-6
        py-28
        text-white
        sm:py-32
        lg:py-40
      "
    >
      {/* Background glows */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-20
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-600/10
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[10%]
          -z-20
          h-[320px]
          w-[320px]
          rounded-full
          bg-blue-500/10
          blur-[130px]
        "
      />

      {/* Grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-30
          opacity-[0.16]
          bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:54px_54px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]
        "
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div
            className="
              mx-auto
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2
              text-xs
              uppercase
              tracking-[0.24em]
              text-neutral-400
              backdrop-blur-xl
            "
          >
            <span className="text-purple-300">✦</span>
            Simple from the start
          </div>

          <h2
            className="
              text-4xl
              font-extrabold
              tracking-[-0.04em]
              sm:text-5xl
              md:text-6xl
            "
          >
            How Music Space works
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-8
              text-neutral-400
              sm:text-lg
            "
          >
            Everything is designed to help you move from an idea to real
            practice without making the process complicated.
          </p>
        </motion.div>

        {/* Steps */}
        <div
          className="
            relative
            mt-16
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* Connecting line on desktop */}
          <div
            className="
              pointer-events-none
              absolute
              left-[8%]
              right-[8%]
              top-12
              hidden
              h-px
              bg-gradient-to-r
              from-transparent
              via-purple-400/30
              to-transparent
              xl:block
            "
          />

          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.97,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -8,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/10
                bg-white/[0.035]
                p-7
                shadow-[0_20px_70px_rgba(0,0,0,0.35)]
                backdrop-blur-2xl
                transition
                duration-300
                hover:border-purple-400/25
                hover:bg-white/[0.055]
                sm:p-8
              "
            >
              {/* Hover glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-36
                  w-36
                  rounded-full
                  bg-purple-500/0
                  blur-[60px]
                  transition
                  duration-500
                  group-hover:bg-purple-500/20
                "
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-purple-300/15
                      bg-purple-500/10
                      text-2xl
                      text-purple-200
                      shadow-[0_0_30px_rgba(168,85,247,0.12)]
                    "
                  >
                    {step.icon}
                  </div>

                  <span
                    className="
                      text-sm
                      font-medium
                      tracking-[0.2em]
                      text-neutral-600
                    "
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="
                    mt-8
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  {step.title}
                </h3>

                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-neutral-400
                    sm:text-base
                  "
                >
                  {step.description}
                </p>

                <div
                  className="
                    mt-8
                    h-px
                    w-12
                    bg-gradient-to-r
                    from-purple-400
                    to-transparent
                    transition-all
                    duration-500
                    group-hover:w-24
                  "
                />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom summary */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            mt-14
            flex
            max-w-3xl
            flex-col
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            px-6
            py-5
            text-center
            backdrop-blur-xl
            sm:flex-row
            sm:text-left
          "
        >
          <span className="text-xl text-purple-300">♫</span>

          <p className="text-sm leading-6 text-neutral-400 sm:text-base">
            One account. Multiple music tools. One place to keep learning,
            practising and creating.
          </p>
        </motion.div>
      </div>
    </section>
  );
}