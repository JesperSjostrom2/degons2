export default function StoryBridge() {
  return (
    <section className="story-bridge relative -mb-8 -mt-12 bg-transparent py-10 md:-mb-10 md:-mt-16 md:py-14" aria-label="From selected work to my story">
      <div className="container relative mx-auto h-16 px-6">
        <svg
          className="story-bridge-route"
          viewBox="0 0 180 165"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="story-route-path"
            d="M20 8C20 25 20 32 34 43C53 59 75 65 99 69C127 74 145 89 145 116C145 132 145 144 145 154"
          />
          <image
            className="story-bridge-rocket"
            href="/assets/rocket-icon.svg"
            x="132"
            y="136.5"
            width="28"
            height="34.65"
            transform="rotate(170 145 154)"
          />
        </svg>
      </div>
    </section>
  )
}
