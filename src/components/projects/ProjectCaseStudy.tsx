import Image from 'next/image'
import type { ProjectCaseStudy as ProjectCaseStudyData } from '@/data/projects'
import ProjectThemeShowcase from './ProjectThemeShowcase'

const ProjectCaseStudyDetails = ({ study }: { study: ProjectCaseStudyData }) => (
  <>
    {study.pwaNote ? (
      <aside className="project-page__pwa-note">
        <div>
          <h2>Designed for the home screen.</h2>
          <p>{study.pwaNote}</p>
        </div>
        <div className="project-page__pwa-mark">
          <Image
            src="/assets/projects/pikku-pulla/logoarms.png"
            alt=""
            aria-hidden="true"
            width={500}
            height={500}
          />
          <span>Installed PWA</span>
        </div>
      </aside>
    ) : null}

    {study.themes ? <ProjectThemeShowcase themes={study.themes} /> : null}

  </>
)

export { ProjectCaseStudyDetails }
