import Image from 'next/image'

interface StaticPhone {
  src: string
  alt: string
  label: string
}

const ProjectStaticPhoneGallery = ({
  title,
  phones,
}: {
  title: string
  phones: StaticPhone[]
}) => (
  <section className="project-page__static-phones" aria-labelledby="project-static-phones-title">
    <div className="project-page__static-phones-heading">
      <h2 id="project-static-phones-title" className="project-page__section-title">
        {title}
      </h2>
    </div>

    <div className="project-page__static-phone-rail">
      {phones.map((phone) => (
        <figure key={phone.src} className="project-page__static-phone">
          <Image
            src={phone.src}
            alt={phone.alt}
            width={1242}
            height={2527}
            sizes="(max-width: 599px) 58vw, (max-width: 899px) 16rem, 18vw"
          />
          <figcaption>{phone.label}</figcaption>
        </figure>
      ))}
    </div>
  </section>
)

export default ProjectStaticPhoneGallery
