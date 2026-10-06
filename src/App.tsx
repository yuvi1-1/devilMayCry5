import { useCallback } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { ExperienceProvider, useExperience } from './context/Experience'
import { useBodyLock } from './hooks/useBodyLock'
import { Loader } from './components/Loader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CharacterShowcase } from './components/CharacterShowcase'
import { StyleRank } from './components/StyleRank'
import { WeaponShowcase } from './components/WeaponShowcase'
import { Bestiary } from './components/Bestiary'
import { LoreTimeline } from './components/LoreTimeline'
import { BloodyPalace } from './components/BloodyPalace'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { SlashLayer } from './components/SlashLayer'
import { ScrollHUD } from './components/ScrollHUD'
import { SectionTransition } from './components/SectionTransition'
import { StoryScroll } from './components/StoryScroll'
import { MediaSection } from './components/MediaSection'
import { Gallery } from './components/Gallery'

function Site() {
  const { ready, setReady } = useExperience()
  useBodyLock(!ready)
  const done = useCallback(() => setReady(true), [setReady])

  return (
    <>
      <AnimatePresence>{!ready && <Loader key="loader" onDone={done} />}</AnimatePresence>

      <Navbar />
      <ScrollHUD />

      <main>
        <Hero />
        <CharacterShowcase />
        <SectionTransition chapter="Chapter II" title="Style is everything" />
        <StyleRank />
        <StoryScroll />
        <WeaponShowcase />
        <Bestiary />
        <SectionTransition chapter="Chapter VI" title="The history of blood" phrase="Sparda · Mundus · Temen-ni-gru · Fortuna · Qliphoth · " />
        <LoreTimeline />
        <MediaSection />
        <Gallery />
        <BloodyPalace />
      </main>
      <Footer />

      {/* atmosphere */}
      <div className="vignette" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
        <div className="grain" />
      </div>
      <SlashLayer />
      <CustomCursor />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ExperienceProvider>
        <Site />
      </ExperienceProvider>
    </MotionConfig>
  )
}
