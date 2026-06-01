import { type CSSProperties, useMemo, useState } from 'react'
import './App.css'

type PhotoCard = {
  id: string
  src: string
  alt: string
  caption: string
  author: string
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
    id: 'portrait-01',
    src: '/assets/photos/portrait-01.jpg',
    alt: 'Portrait rendered as an AuroLens instant film print',
    caption: 'Portrait / NC Skin',
    author: 'Unsplash',
    base: { x: 0, y: 0, r: 4, s: 1 },
  },
  {
    id: 'landscape-01',
    src: '/assets/photos/landscape-01.jpg',
    alt: 'Lake and mountain landscape rendered as an instant film print',
    caption: 'Morning / Fuji 200',
    author: 'Unsplash',
    base: { x: -18, y: 16, r: -9, s: 0.96 },
  },
  {
    id: 'portrait-02',
    src: '/assets/photos/portrait-02.jpg',
    alt: 'Street portrait rendered as a warm instant film print',
    caption: 'Street / KD Gold',
    author: 'Unsplash',
    base: { x: 20, y: 12, r: 10, s: 0.95 },
  },
  {
    id: 'landscape-02',
    src: '/assets/photos/landscape-02.jpg',
    alt: 'Forest landscape rendered as a cool instant film print',
    caption: 'Forest / Classic',
    author: 'Unsplash',
    base: { x: -30, y: -12, r: -15, s: 0.9 },
  },
  {
    id: 'portrait-03',
    src: '/assets/photos/portrait-03.jpg',
    alt: 'Close portrait rendered as a clean instant film print',
    caption: 'Clean / AIR Japan',
    author: 'Unsplash',
    base: { x: 32, y: -18, r: 14, s: 0.9 },
  },
  {
    id: 'landscape-03',
    src: '/assets/photos/landscape-03.jpg',
    alt: 'Desert road and hills rendered as an instant film print',
    caption: 'Vista / BLL',
    author: 'Unsplash',
    base: { x: -6, y: -28, r: -4, s: 0.88 },
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

function makeScatterPoses(): ScatterPose[] {
  const spread = [
    { x: -158, y: -88, r: -20, s: 0.92 },
    { x: 132, y: -98, r: 17, s: 0.94 },
    { x: -180, y: 70, r: 15, s: 0.91 },
    { x: 168, y: 76, r: -18, s: 0.92 },
    { x: -34, y: -168, r: -7, s: 0.9 },
    { x: 42, y: 156, r: 9, s: 0.93 },
  ]

  return spread.map((pose) => ({
    x: pose.x + Math.round((Math.random() - 0.5) * 34),
    y: pose.y + Math.round((Math.random() - 0.5) * 30),
    r: pose.r + Math.round((Math.random() - 0.5) * 8),
    s: pose.s + Number(((Math.random() - 0.5) * 0.04).toFixed(2)),
  }))
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
      className="polaroid-card"
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
        <span>{photo.caption}</span>
        <span>{photo.author}</span>
      </figcaption>
    </figure>
  )
}

function PolaroidStack() {
  const [scattered, setScattered] = useState(false)
  const [poses, setPoses] = useState<ScatterPose[]>(() => makeScatterPoses())
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function scatter() {
    setPoses(makeScatterPoses())
    setScattered(true)
  }

  return (
    <div
      className={`stack-hit-area ${scattered ? 'is-scattered' : ''}`}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') scatter()
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
            scatter()
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
              <figcaption>{photo.caption}</figcaption>
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
