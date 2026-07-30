import FloatingStars from '@/components/floating-stars'
import AtmosphereController from '@/components/AtmosphereController'

/**
 * The backdrop: meteors and the three parallax star bands.
 *
 * Lifted out of the home page so `/work/[slug]` renders the identical backdrop rather than an
 * approximation of it. One definition, two routes.
 *
 * There is no sky layer here. The background is a single flat colour, `--sky`, painted on
 * `body` in globals.css — nothing about it changes with scroll, so it needs no element and no
 * per-frame work.
 *
 * data-parallax is vh of travel across the full page, resolved to px by AtmosphereController.
 * Nearer bands travel further, and are sized and brightened to match in LAYER_CONFIG. Each
 * band's bottom overscan must exceed its own travel or its lower edge scrolls into view — see
 * the .star-band--* rules.
 */
const SiteAtmosphere = () => (
  <>
    <AtmosphereController />

    <div className="space-background-meteor space-background-meteor--a pointer-events-none fixed z-0" />
    <div className="space-background-meteor space-background-meteor--b pointer-events-none fixed z-0" />
    <div className="space-background-meteor space-background-meteor--c pointer-events-none fixed z-0" />
    <div className="space-background-meteor space-background-meteor--d pointer-events-none fixed z-0" />

    <div
      data-atmosphere="stars"
      data-parallax="-18"
      className="star-band star-band--far pointer-events-none fixed z-0 overflow-hidden"
    >
      <FloatingStars className="absolute inset-0" layer="far" count={26} mobileCount={10} />
    </div>
    <div
      data-atmosphere="stars"
      data-parallax="-55"
      className="star-band star-band--mid pointer-events-none fixed z-0 overflow-hidden"
    >
      <FloatingStars className="absolute inset-0" layer="mid" count={18} mobileCount={0} />
    </div>
    <div
      data-atmosphere="stars"
      data-parallax="-120"
      className="star-band star-band--near pointer-events-none fixed z-0 overflow-hidden"
    >
      <FloatingStars className="absolute inset-0" layer="near" count={10} mobileCount={0} />
    </div>
  </>
)

export default SiteAtmosphere
