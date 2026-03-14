import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ORBS_LIGHT = [
  { size: 700, x: '-8%', y: '-15%', from: 'rgba(99,102,241,0.35)', to: 'rgba(167,139,250,0.2)' },
  { size: 550, x: '60%', y: '10%',  from: 'rgba(244,114,182,0.3)', to: 'rgba(99,102,241,0.18)' },
  { size: 480, x: '10%', y: '50%',  from: 'rgba(167,139,250,0.3)', to: 'rgba(103,232,249,0.15)' },
  { size: 400, x: '72%', y: '60%',  from: 'rgba(99,102,241,0.25)', to: 'rgba(244,114,182,0.2)' },
]

const ORBS_DARK = [
  { size: 700, x: '-8%', y: '-15%', from: 'rgba(99,102,241,0.5)', to: 'rgba(167,139,250,0.3)' },
  { size: 550, x: '60%', y: '10%',  from: 'rgba(244,114,182,0.4)', to: 'rgba(99,102,241,0.25)' },
  { size: 480, x: '10%', y: '50%',  from: 'rgba(167,139,250,0.45)', to: 'rgba(103,232,249,0.2)' },
  { size: 400, x: '72%', y: '60%',  from: 'rgba(99,102,241,0.35)', to: 'rgba(244,114,182,0.3)' },
]

const ANIM_PATHS = [
  { x: [0, 80, -50, 30, 0],  y: [0, -60, 80, -30, 0],  s: [1, 1.12, 0.93, 1.06, 1], dur: 18 },
  { x: [0, -70, 50, -20, 0], y: [0, 50, -70, 40, 0],   s: [1, 0.95, 1.1, 0.97, 1],  dur: 22 },
  { x: [0, 60, -80, 20, 0],  y: [0, -40, 60, -50, 0],  s: [1, 1.08, 0.94, 1.04, 1], dur: 20 },
  { x: [0, -50, 70, -30, 0], y: [0, 70, -50, 30, 0],   s: [1, 1.06, 0.96, 1.08, 1], dur: 16 },
]

export default function GlobalBackground() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const orbs = isDark ? ORBS_DARK : ORBS_LIGHT

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#0f0e17]' : 'bg-slate-50'}`} />

      {/* Slow-moving mesh gradient */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(244,114,182,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(167,139,250,0.12) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(244,114,182,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(167,139,250,0.09) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated orbs */}
      {orbs.map((orb, i) => {
        const path = ANIM_PATHS[i]
        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: `radial-gradient(circle, ${orb.from} 0%, ${orb.to} 60%, transparent 100%)`,
            }}
            animate={{ x: path.x, y: path.y, scale: path.s }}
            transition={{ duration: path.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
    </div>
  )
}
