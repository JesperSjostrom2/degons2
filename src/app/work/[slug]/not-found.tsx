import TransitionLink from '@/components/transition/transition-link'
import SiteAtmosphere from '@/components/site-atmosphere'

export default function ProjectNotFound() {
  return (
    <main className="project-page isolate relative flex min-h-screen items-center justify-center">
      <SiteAtmosphere />

      <div className="relative z-10 px-6 text-center">
        <p className="project-page__label">404</p>
        <h1 className="project-page__title mt-3">No such project</h1>
        <p className="project-page__lede mx-auto mt-4 max-w-md">
          That link does not point at anything. The rest of the work is still where you left it.
        </p>

        <TransitionLink href="/#projects" className="project-page__back mt-8 inline-flex">
          All projects
        </TransitionLink>
      </div>
    </main>
  )
}
