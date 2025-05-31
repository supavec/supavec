'use client'

import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const transition = {
  duration: 0.75,
  repeat: Infinity,
  repeatDelay: 1.25,
}

function Rings() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      className={clsx(
        'col-start-1 row-start-1 size-full',
        'mask-intersect mask-[linear-gradient(to_bottom,black_90%,transparent),radial-gradient(circle,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]',
      )}
    >
      {Array.from(Array(42).keys()).map((n) => (
        <motion.circle
          variants={{
            idle: {
              scale: 1,
              strokeOpacity: 0.15,
            },
            active: {
              scale: [1, 1.08, 1],
              strokeOpacity: [0.15, 0.3, 0.15],
              transition: { ...transition, delay: n * 0.05 },
            },
          }}
          key={n}
          cx="250"
          cy="250"
          r={n * 14 + 4}
          className="stroke-white"
        />
      ))}
    </svg>
  )
}

function Checkmark() {
  return (
    <div className="z-10 col-start-1 row-start-1 flex items-center justify-center">
      <motion.div
        variants={{
          idle: { scale: 1 },
          active: {
            scale: [1, 1.15, 1],
            transition: { ...transition, duration: 0.75 },
          },
        }}
        className="flex size-6 items-center justify-center rounded-full bg-linear-to-t from-green-500 to-green-300 shadow-sm"
      >
        <CheckIcon className="size-4 fill-white" />
      </motion.div>
    </div>
  )
}

function Photos() {
  return (
    <div className="z-10 col-start-1 row-start-1">
      <div className="mx-auto flex size-full max-w-md items-center justify-around">
        <img
          alt=""
          src="/linked-avatars/customer.jpg"
          className="size-20 rounded-full bg-white/15 ring-4 ring-white/10"
        />
        <img
          alt=""
          src="/linked-avatars/manager.jpg"
          className="size-20 rounded-full bg-white/15 ring-4 ring-white/10"
        />
      </div>
    </div>
  )
}

export function LinkedAvatars() {
  return (
    <div aria-hidden="true" className="isolate mx-auto grid h-full grid-cols-1">
      <Rings />
      <Photos />
      <Checkmark />
    </div>
  )
}
