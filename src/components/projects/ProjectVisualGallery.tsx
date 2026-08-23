import type { ProjectVisual } from '@/data/projects'
import ProjectAppDemos from './ProjectAppDemos'
import ProjectMacFrame from './ProjectMacFrame'
import ProjectPhoneRow from './ProjectPhoneRow'
import ProjectShot from './ProjectShot'
import ProjectStaticPhoneGallery from './ProjectStaticPhoneGallery'

const ProjectVisualGallery = ({
  visuals,
  projectName,
  liveLabel,
  variant,
}: {
  visuals: ProjectVisual[]
  projectName: string
  liveLabel: string
  variant?: 'lead' | 'supporting'
}) => {
  if (visuals.length === 0) return null

  const variantClass = variant ? ` project-page__visuals--${variant}` : ''

  return (
    <section
      className={`project-page__visuals${variantClass}`}
      aria-label={`${projectName} screenshots`}
    >
      {visuals.map((visual, index) => {
        if (visual.frame === 'mac') {
          return (
            <ProjectMacFrame
              key={visual.videoSrc}
              videoSrc={visual.videoSrc}
              posterSrc={visual.posterSrc}
              alt={visual.alt}
            />
          )
        }

        if (visual.frame === 'phones') {
          return <ProjectPhoneRow key={visual.phones[0]?.src ?? index} phones={visual.phones} />
        }

        if (visual.frame === 'app-demos') {
          return <ProjectAppDemos key={visual.demos[0]?.videoSrc ?? index} demos={visual.demos} />
        }

        if (visual.frame === 'phone-gallery') {
          return (
            <ProjectStaticPhoneGallery
              key={visual.phones[0]?.src ?? index}
              title={visual.title}
              phones={visual.phones}
            />
          )
        }

        return (
          <ProjectShot
            key={visual.src}
            shot={visual}
            liveLabel={liveLabel}
            sizes="(max-width: 899px) 92vw, 84rem"
            priority={index === 0}
          />
        )
      })}
    </section>
  )
}

export default ProjectVisualGallery
