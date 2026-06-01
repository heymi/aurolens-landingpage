import { type CSSProperties, useMemo, useState } from 'react'
import './App.css'

type PhotoCard = {
  id: string
  src: string
  alt: string
  note: string
  date: string
  tone: 'fuji' | 'polaroid' | 'gold' | 'cool' | 'faded' | 'mono'
  base: {
    x: number
    y: number
    r: number
    s: number
  }
}

type ScatterPose = {
  x: number
  y: number
  r: number
  s: number
}

type StyleVars = CSSProperties & Record<`--${string}`, string | number>

const downloadUrl = 'https://apps.apple.com/'

const photos: PhotoCard[] = [
  {
    id: 'couple-anniversary',
    src: '/assets/photos/couple-anniversary.jpg',
    alt: 'A couple photo rendered as an AuroLens instant film print',
    note: '3rd anniversary - Kyoto',
    date: 'Apr 12, 2026',
    tone: 'polaroid',
    base: { x: 0, y: 0, r: 4, s: 1 },
  },
  {
    id: 'beach-trip',
    src: '/assets/photos/beach-trip.jpg',
    alt: 'A beach travel memory rendered as an AuroLens instant film print',
    note: 'first morning in Maui',
    date: 'Jun 03, 2026',
    tone: 'fuji',
    base: { x: -18, y: 16, r: -9, s: 0.96 },
  },
  {
    id: 'weekend-dogs',
    src: '/assets/photos/weekend-dogs.jpg',
    alt: 'Two dogs rendered as a warm instant film print',
    note: 'Sunday walk with Mochi',
    date: 'May 18, 2026',
    tone: 'gold',
    base: { x: 20, y: 12, r: 10, s: 0.95 },
  },
  {
    id: 'friends-birthday',
    src: '/assets/photos/friends-birthday.jpg',
    alt: 'Friends celebrating together rendered as an instant film print',
    note: 'Lena birthday dinner',
    date: 'Aug 27, 2026',
    tone: 'faded',
    base: { x: -30, y: -12, r: -15, s: 0.9 },
  },
  {
    id: 'dinner-friends',
    src: '/assets/photos/dinner-friends.jpg',
    alt: 'Friends having dinner rendered as an instant film print',
    note: 'after-work noodles',
    date: 'Jul 21, 2026',
    tone: 'gold',
    base: { x: 12, y: -34, r: 7, s: 0.86 },
  },
  {
    id: 'home-cat',
    src: '/assets/photos/home-cat.jpg',
    alt: 'A cat at home rendered as a clean instant film print',
    note: 'rainy afternoon at home',
    date: 'Sep 09, 2026',
    tone: 'cool',
    base: { x: 32, y: -18, r: 14, s: 0.9 },
  },
  {
    id: 'coffee-date',
    src: '/assets/photos/coffee-date.jpg',
    alt: 'A coffee date rendered as an instant film print',
    note: 'tiny cafe near the station',
    date: 'Nov 14, 2026',
    tone: 'polaroid',
    base: { x: -38, y: 18, r: -18, s: 0.84 },
  },
  {
    id: 'road-trip',
    src: '/assets/photos/road-trip.jpg',
    alt: 'A road trip landscape rendered as an instant film print',
    note: 'the long way north',
    date: 'Oct 02, 2026',
    tone: 'mono',
    base: { x: -6, y: -28, r: -4, s: 0.88 },
  },
  {
    id: 'city-walk',
    src: '/assets/photos/city-walk.jpg',
    alt: 'A city walk photo rendered as an instant film print',
    note: 'Shibuya before rain',
    date: 'Dec 05, 2026',
    tone: 'faded',
    base: { x: 42, y: 8, r: 18, s: 0.82 },
  },
  {
    id: 'home-corner',
    src: '/assets/photos/home-corner.jpg',
    alt: 'A quiet home corner rendered as an instant film print',
    note: 'new apartment, first night',
    date: 'Jan 08, 2027',
    tone: 'cool',
    base: { x: -12, y: 34, r: -7, s: 0.8 },
  },
]

const features = [
  {
    eyebrow: '01',
    title: 'Instant paper, real depth',
    body: 'AuroLens renders the whole print as one object, preserving the quiet tension between paper, light, shadow, and image.',
  },
  {
    eyebrow: '02',
    title: 'Film recipes that hold together',
    body: 'Portraits stay alive. Landscapes keep air. Skin, grain, color, and contrast are tuned as a system instead of a preset list.',
  },
  {
    eyebrow: '03',
    title: 'A wall that feels collected',
    body: 'Finished prints gather into a tactile photo wall with overlap, rotation, and the feeling of something made by hand.',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeScatterPoses(bounds?: DOMRect, cardWidth = 300): ScatterPose[] {
  if (typeof window === 'undefined' || !bounds) {
    return photos.map((photo) => photo.base)
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const stackCenterX = bounds.left + bounds.width / 2
  const stackCenterY = bounds.top + bounds.height / 2
  const cardHalfWidth = cardWidth * 0.43
  const cardHalfHeight = cardWidth * 0.52
  const safeX = [44 + cardHalfWidth, viewportWidth - 44 - cardHalfWidth]
  const safeY = [86 + cardHalfHeight, viewportHeight - 60 - cardHalfHeight]

  const zones = [
    { x: [0.08, 0.24], y: [0.14, 0.3] },
    { x: [0.75, 0.93], y: [0.12, 0.3] },
    { x: [0.06, 0.24], y: [0.62, 0.84] },
    { x: [0.74, 0.93], y: [0.62, 0.84] },
    { x: [0.05, 0.2], y: [0.36, 0.58] },
    { x: [0.8, 0.95], y: [0.36, 0.58] },
    { x: [0.34, 0.62], y: [0.1, 0.24] },
    { x: [0.34, 0.62], y: [0.72, 0.88] },
    { x: [0.23, 0.38], y: [0.24, 0.43] },
    { x: [0.62, 0.78], y: [0.5, 0.72] },
  ]

  return photos.map((_, index) => {
    const zone = zones[index % zones.length]
    const targetX = clamp(randomBetween(zone.x[0], zone.x[1]) * viewportWidth, safeX[0], safeX[1])
    const targetY = clamp(randomBetween(zone.y[0], zone.y[1]) * viewportHeight, safeY[0], safeY[1])
    const scale = randomBetween(0.68, 0.84)

    return {
      x: Math.round(targetX - stackCenterX),
      y: Math.round(targetY - stackCenterY),
      r: Math.round(randomBetween(-31, 31)),
      s: Number(scale.toFixed(2)),
    }
  })
}

function PolaroidCard({
  photo,
  index,
  scattered,
  pose,
}: {
  photo: PhotoCard
  index: number
  scattered: boolean
  pose: ScatterPose
}) {
  const activePose = scattered ? pose : photo.base

  return (
    <figure
      className={`polaroid-card tone-${photo.tone}`}
      style={
        {
          '--x': `${activePose.x}px`,
          '--y': `${activePose.y}px`,
          '--r': `${activePose.r}deg`,
          '--s': activePose.s,
          '--z': photos.length - index,
        } as StyleVars
      }
    >
      <img className="polaroid-image" src={photo.src} alt={photo.alt} />
      <img className="polaroid-frame" src="/assets/polaroid/photo-bg.png" alt="" />
      <figcaption>
        <span>{photo.note}</span>
        <span>{photo.date}</span>
      </figcaption>
    </figure>
  )
}

function PolaroidStack() {
  const [scattered, setScattered] = useState(false)
  const [poses, setPoses] = useState<ScatterPose[]>(() => makeScatterPoses())
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function scatter(target: HTMLElement) {
    const bounds = target.getBoundingClientRect()
    const card = target.querySelector<HTMLElement>('.polaroid-card')
    const cardWidth = card?.getBoundingClientRect().width ?? 300
    setPoses(makeScatterPoses(bounds, cardWidth))
    setScattered(true)
  }

  return (
    <div
      className={`stack-hit-area ${scattered ? 'is-scattered' : ''}`}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') scatter(event.currentTarget)
      }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
        setTilt({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) })
      }}
      onPointerLeave={() => {
        setScattered(false)
        setTilt({ x: 0, y: 0 })
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== 'mouse') {
          if (scattered) {
            setScattered(false)
          } else {
            scatter(event.currentTarget)
          }
        }
      }}
    >
      <div
        className="polaroid-stack"
        style={
          {
            '--tilt-x': `${tilt.y * -4}deg`,
            '--tilt-y': `${tilt.x * 5}deg`,
        } as StyleVars
        }
        aria-label="Interactive stack of AuroLens instant film prints"
      >
        <img className="camera-plate camera-plate-bottom" src="/assets/polaroid/p-bg-bottom.png" alt="" />
        {photos.map((photo, index) => (
          <PolaroidCard
            key={photo.id}
            photo={photo}
            index={index}
            scattered={scattered}
            pose={poses[index]}
          />
        ))}
        <img className="camera-plate camera-plate-top" src="/assets/polaroid/p-bg-top.png" alt="" />
      </div>
    </div>
  )
}

function App() {
  const samplePhotos = useMemo(() => photos.slice(0, 5), [])

  return (
    <main>
      <section className="hero-section" id="top">
        <header className="site-header" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="AuroLens home">
            <img src="/assets/appicon.png" alt="" />
            <span>AuroLens®</span>
          </a>
          <nav>
            <a href="#features">Features</a>
            <a href="#prints">Prints</a>
            <a href="#download">Download</a>
          </nav>
        </header>

        <p className="hero-copy">
          <strong>AuroLens®</strong> turns everyday frames into tactile instant film: clean color, paper depth, and a gallery that feels collected.
        </p>

        <div className="hero-meta" aria-hidden="true">
          <span>© 2026</span>
          <span>iPhone Camera / Instant Print</span>
        </div>

        <h1>AuroLens®</h1>
        <PolaroidStack />

        <a className="download-pill" href={downloadUrl} target="_blank" rel="noreferrer">
          <span>Download App</span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="feature-band" id="features">
        <div className="section-kicker">Built for people who notice light</div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-item" key={feature.eyebrow}>
              <span>{feature.eyebrow}</span>
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="prints-section" id="prints">
        <div>
          <p className="section-kicker">Output wall</p>
          <h2>People, places, and the little flaws that make a print feel kept.</h2>
        </div>
        <div className="sample-rail" aria-label="AuroLens sample prints">
          {samplePhotos.map((photo, index) => (
            <figure className="sample-print" key={photo.id} style={{ '--sample-r': `${[-5, 3, -2, 5, -4][index]}deg` } as StyleVars}>
              <img src={photo.src} alt={photo.alt} />
              <figcaption>{photo.note}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="workflow-copy">
          <p className="section-kicker">Workflow</p>
          <h2>Pick a frame. Let the paper breathe. Save the print.</h2>
        </div>
        <ol>
          <li>
            <span>Capture</span>
            <p>Start from camera or library without losing the original image character.</p>
          </li>
          <li>
            <span>Tune</span>
            <p>Choose film tone, grain, color, and text styling with a focused editor.</p>
          </li>
          <li>
            <span>Keep</span>
            <p>Export high-resolution prints and collect them in a living photo wall.</p>
          </li>
        </ol>
      </section>

      <section className="closing-section" id="download">
        <img src="/assets/appicon.png" alt="" />
        <p>AUROLENS FOR IPHONE</p>
        <h2>Instant film without pretending the world is perfect.</h2>
        <a className="primary-cta" href={downloadUrl} target="_blank" rel="noreferrer">
          Download App
        </a>
      </section>
    </main>
  )
}

export default App
