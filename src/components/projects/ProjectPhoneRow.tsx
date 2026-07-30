import Image from 'next/image'

/**
 * Three phone plates side by side.
 *
 * Each plate is 4036x4570 with the phone occupying only the middle 51% — roughly 24% of
 * transparent padding down each side. Laid out raw, the gaps between the phones would be
 * nearly as wide as the phones themselves, so each is cropped back to its device box in CSS
 * (`.project-page__phone`) and the visible spacing comes from the row's own gap instead.
 *
 * That crop is a fixed set of offsets, which holds because all three plates share one device
 * box — x 981..3050, y 178..4389, measured. Re-exporting a phone with different padding is
 * the one thing that breaks it.
 */
const ProjectPhoneRow = ({ phones }: { phones: { src: string; alt: string }[] }) => (
  <div className="project-page__phones">
    {phones.map((phone) => (
      <div key={phone.src} className="project-page__phone">
        <Image
          src={phone.src}
          alt={phone.alt}
          width={4036}
          height={4570}
          sizes="(max-width: 599px) 90vw, (max-width: 899px) 30vw, 26rem"
        />
      </div>
    ))}
  </div>
)

export default ProjectPhoneRow
