import { motion } from 'framer-motion'
import { useExperience } from '../context/Experience'

export function SoundToggle({ className = '' }: { className?: string }) {
  const { soundOn, toggleSound } = useExperience()
  return (
    <button
      type="button"
      onClick={toggleSound}
      data-cursor={soundOn ? 'Mute' : 'Sound'}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
      className={`group flex items-center gap-2.5 font-ui text-[0.68rem] font-medium tracking-[0.28em] text-ash uppercase transition-colors hover:text-bone ${className}`}
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0.6, 1, 0.45, 0.8].map((h, i) => (
          <motion.span
            key={i}
            className={`w-[2px] ${soundOn ? 'bg-crimson' : 'bg-ash/60'}`}
            animate={soundOn ? { height: ['30%', `${h * 100}%`, '45%', '100%', '30%'] } : { height: '30%' }}
            transition={soundOn ? { duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span>
        Sound: <span className={soundOn ? 'text-bone' : ''}>{soundOn ? 'On' : 'Off'}</span>
      </span>
    </button>
  )
}
