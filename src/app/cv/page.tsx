import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Globe2, Mail, MapPin } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { FiInstagram } from 'react-icons/fi'
import FloatingStars from '@/components/floating-stars'

type Experience = {
  company: string
  role: string
  dates: string
  logo: ReactNode
  logoClass?: string
  activeDate?: boolean
  tags: string[]
  bullets: string[]
}

const experiences: Experience[] = [
  {
    company: 'Wolt',
    role: 'Support associate',
    dates: 'Oct 2024 - present',
    activeDate: true,
    logo: <span className="text-[20px] font-black italic text-white">Wolt</span>,
    logoClass: 'bg-[#45b8e9]',
    tags: ['Customer support', 'Communication', 'Operations Tasks', 'Problem solving'],
    bullets: [
      'Handling chats with customers',
      'Assisting with various internal operations tasks',
      'Quickly resolving issues with expertise and precision',
      'Working closely with colleagues to ensure smooth operations',
    ],
  },
  {
    company: 'Cafe Bistro Kerma',
    role: 'Frontend Developer & Worker',
    dates: 'Nov 2023 - Apr 2024',
    logo: <Image src="/assets/projects/kerma.png" alt="" width={58} height={58} className="h-full w-full rounded-full object-cover" />,
    logoClass: 'bg-black',
    tags: ['Web & Graphic design', 'Frontend development', 'React.js', 'Business branding', 'Customer service', 'Restaurant operations'],
    bullets: [
      'Designed and developed a user-friendly website to enhance the customer experience & branding.',
      'Delivered top-notch service to guests, ensuring a positive and welcoming environment.',
    ],
  },
  {
    company: 'Vello',
    role: 'Frontend Developer Intern',
    dates: 'Nov 2022 - Apr 2023',
    logo: <span className="text-[20px] font-black tracking-[-0.06em] text-black">Vello</span>,
    logoClass: 'bg-white',
    tags: ['Frontend development', 'Team collaboration', 'Backbone.js', 'Web & Graphic design', 'Bug testing', 'Professional work'],
    bullets: [
      'Gained hands-on experience in professional frontend development',
      'Collaborated with the team on web projects and UI design',
      'Learned coding best practices from senior developers',
      'Gained insight into team workflows and company processes',
    ],
  },
  {
    company: 'Ostra Gymnasiet',
    role: 'Web Developer Intern',
    dates: 'Feb 2021 - May 2021',
    logo: <span className="text-[24px] font-black text-black">O</span>,
    logoClass: 'bg-white',
    tags: ['Frontend development', 'Backend', 'Team Communication', 'Problem solving', 'Agile working', 'Three.js'],
    bullets: [
      'Built responsive & optimized UI across all devices',
      'Developed scalable APIs and optimized queries',
      'Broke down complex tasks into manageable chunks to deliver faster',
      'Developed great communication skills with teammates',
    ],
  },
]

const skillRows = [
  ['Underline indicators', 'Frequently Used', 'Occasionally'],
  ['UI related', 'Bootstrap', 'Sass', 'WordPress'],
  ['FE related', 'HTML5', 'CSS', 'Javascript', 'React', 'Backbone.js'],
  ['Coder related', 'VS Code', 'Node.js', 'Git', 'Cypress', 'Node.js'],
  ['Designer related', 'Figma', 'Illustrator', 'Photoshop'],
]

const education = [
  ['KYH Yrkeshogskola', 'Frontend Developer', '2021 - 2023', 'Nacka, Sweden', '>kyh'],
  ['Ostra gymnasiet', 'High school engineer', '2020 - 2021', 'Huddinge, Sweden', 'O'],
  ['Huddinge gymnasium', 'Information & media technology', '2016 - 2019', 'HGY'],
]

const card = 'rounded-[22px] bg-[#f2f2f2]'
const tag = 'rounded-[5px] bg-white px-[7px] py-[3px] text-[11px] leading-none text-[#333]'

function ExperienceCard({ item }: { item: Experience }) {
  return (
    <article className={`${card} h-[223px] p-[18px]`}>
      <div className="flex gap-[16px]">
        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-white">
          <div className={`flex h-[54px] w-[54px] items-center justify-center rounded-full ${item.logoClass ?? 'bg-white'}`}>
            {item.logo}
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-[20px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[21px] font-extrabold leading-[0.95] tracking-[-0.045em] text-black">{item.company}</h3>
              <p className="mt-[5px] text-[13px] leading-none text-[#676767]">{item.role}</p>
            </div>
            <div className={`-mt-[10px] shrink-0 rounded-[7px] px-[12px] py-[9px] text-[10px] font-medium ${item.activeDate ? 'border-2 border-[#168ce5] bg-white text-[#168ce5]' : 'bg-white text-[#777]'}`}>
              {item.activeDate && <CalendarDays className="mr-1 inline h-[12px] w-[12px]" />}
              {item.dates}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {item.tags.map((label) => (
          <span key={label} className={tag}>{label}</span>
        ))}
      </div>

      <ul className="mt-[14px] space-y-[5px] text-[11px] leading-[1.15] text-black">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-[10px]">
            <span className="mt-[3px] h-[7px] w-[7px] shrink-0 rounded-[2px] bg-white" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function CVPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--site-bg)] px-4 py-8 text-black sm:px-6 sm:py-10">
      <div className="space-background-meteor pointer-events-none fixed z-0" />
      <FloatingStars className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80 invert-0" count={34} mobileCount={10} />

      <Link
        href="/"
        aria-label="Back to home"
        className="fixed left-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:bg-black print:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <section className="relative z-10 mx-auto w-full max-w-[891px] bg-[#ececec] px-[22px] pb-[28px] pt-[34px] shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:px-[54px] sm:pb-[38px] sm:pt-[62px]">
        <header>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-0">
            <div>
              <h1 className="text-[36px] font-black leading-none tracking-[-0.045em]">Jesper Sjostrom</h1>
              <p className="mt-[11px] text-[16px] font-medium leading-none">Front-End Developer · IT Support</p>
            </div>

            <div className="mt-[8px] flex flex-wrap items-center gap-x-[16px] gap-y-2 text-[11px] font-medium">
              <span className="inline-flex items-center gap-[4px]"><MapPin className="h-[13px] w-[13px] fill-black" />25 years old, Swedish</span>
              <span className="inline-flex items-center gap-[5px]"><Mail className="h-[13px] w-[13px] fill-black" />jespersjostrom2@gmail.com</span>
              <span className="inline-flex items-center gap-[5px]"><Globe2 className="h-[13px] w-[13px]" />jespersjostrom.se</span>
            </div>
          </div>

          <div className="mt-[19px] grid grid-cols-1 gap-[16px] sm:grid-cols-[210px_312px_203px] sm:gap-[29px]">
            <div className="h-[128px] overflow-hidden rounded-[18px] bg-[#e6e6e6]">
              <Image
                src="/assets/portrait.jpg"
                alt="Portrait of Jesper Sjostrom"
                width={210}
                height={128}
                priority
                className="h-full w-full object-cover object-[50%_31%]"
              />
            </div>

            <section className={`${card} h-[128px] px-[28px] py-[24px]`}>
              <h2 className="text-[20px] font-extrabold leading-none tracking-[-0.04em]">Biography</h2>
              <p className="mt-[14px] text-[13px] leading-[1.06] text-[#555]">
                Tech-savvy Junior Web Developer with a passion for design, UI, creativity, and problem-solving.
                Always exploring new ways to learn, build and innovate.
              </p>
            </section>

            <section className={`${card} h-[128px] px-[18px] py-[26px]`}>
              <h2 className="text-[20px] font-extrabold leading-none tracking-[-0.04em]">Interests</h2>
              <div className="mt-[19px] grid grid-cols-3 gap-x-[6px] gap-y-[10px]">
                {['Coding', 'UI & UX', 'IT & Tech', 'Learning', 'Gaming', 'Gym'].map((interest) => (
                  <span key={interest} className="rounded-full bg-white px-[7px] py-[4px] text-[10px] leading-none text-black">{interest}</span>
                ))}
              </div>
            </section>
          </div>
        </header>

        <section className="mt-[30px]">
          <h2 className="mb-[13px] pl-[6px] text-[24px] font-black leading-none tracking-[-0.045em]">Work Experience</h2>
          <div className="grid grid-cols-1 gap-x-[18px] gap-y-[25px] sm:grid-cols-2">
            {experiences.map((item) => (
              <ExperienceCard key={item.company} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-[19px] grid grid-cols-1 gap-[25px] sm:grid-cols-[380px_1fr]">
          <div>
            <h2 className="mb-[9px] pl-[8px] text-[16px] font-extrabold leading-none">Featured projects</h2>
            <div className="grid grid-cols-2 gap-[25px]">
              <div className="h-[92px] overflow-hidden rounded-[19px] bg-[#fb0067]">
                <div className="flex h-[70px] items-center justify-center text-[45px] font-black tracking-[-0.12em] text-white">JS</div>
                <div className="flex h-[22px] items-center justify-center bg-[#d40059] text-[10px] font-medium tracking-[0.22em] text-white">Portfolio</div>
              </div>
              <div className="h-[92px] overflow-hidden rounded-[19px] bg-black">
                <Image src="/assets/projects/kerma.png" alt="Cafe Bistro Kerma" width={177} height={92} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[25px] pt-0 sm:pt-[25px]">
            <section className={`${card} h-[92px] px-[28px] py-[20px] text-center`}>
              <h3 className="text-[16px] font-extrabold leading-none">Languages</h3>
              <div className="mt-[20px] flex justify-center gap-[12px] text-[14px] font-semibold text-[#4f4f4f]">
                <span>SE</span>
                <span>GB</span>
                <span>FI</span>
              </div>
            </section>
            <section className={`${card} h-[92px] px-[28px] py-[20px] text-center`}>
              <h3 className="text-[16px] font-extrabold leading-none">Socials</h3>
              <div className="mt-[18px] flex justify-center gap-[15px]">
                <FaLinkedin className="h-[24px] w-[24px] text-[#0a66c2]" />
                <FaGithub className="h-[24px] w-[24px] text-[#333]" />
                <FiInstagram className="h-[24px] w-[24px] text-[#ff744c]" />
              </div>
            </section>
          </div>
        </section>

        <section className="mt-[23px] grid grid-cols-1 gap-[25px] sm:grid-cols-[380px_1fr]">
          <div>
            <h2 className="mb-[8px] pl-[8px] text-[16px] font-extrabold leading-none">Skills & Tools</h2>
            <div className={`${card} h-[217px] overflow-hidden`}>
              {skillRows.map((row, rowIndex) => (
                <div
                  key={row[0]}
                  className={`grid grid-cols-[128px_1fr] px-[15px] text-[11px] ${rowIndex === 0 ? 'h-[63px] items-center' : 'min-h-[32px] items-center'} ${rowIndex === 1 ? 'border-t border-white pt-[14px]' : ''}`}
                >
                  <span className="text-black">{row[0]}</span>
                  <div className="flex flex-wrap gap-x-[7px] gap-y-[5px]">
                    {row.slice(1).map((skill, skillIndex) => (
                      <span key={`${row[0]}-${skill}-${skillIndex}`} className="border-b border-[#168ce5] bg-white px-[5px] leading-[1.25] text-[#555]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-[8px] pl-[3px] text-[16px] font-extrabold leading-none">Education</h2>
            <div className="space-y-[17px]">
              {education.map(([school, program, dates, location, mark]) => (
                <article key={school} className={`${card} flex h-[64px] items-center gap-[16px] px-[24px]`}>
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-black text-[#e45750]">
                    {mark}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-extrabold leading-none tracking-[-0.03em]">{school}</h3>
                    <p className="mt-[4px] text-[9px] leading-none text-[#666]">{program}</p>
                  </div>
                  <div className="flex h-[38px] w-[112px] shrink-0 flex-col items-center justify-center rounded-[7px] bg-white text-center">
                    <p className="text-[10px] font-bold leading-none text-[#168ce5]">{dates}</p>
                    <p className="mt-[6px] inline-flex items-center gap-[3px] text-[8px] leading-none text-[#777]">
                      <MapPin className="h-[9px] w-[9px] fill-[#777]" />
                      {location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
