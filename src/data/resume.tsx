import { Icons } from "@/components/icons";

export const DATA = {
  name: "Hitesh Rohira",
  initials: "HR",
  url: "https://www.linkedin.com/in/hiteshrohira/",
  description: "A web developer and a problem solver :)",
  summary: `Since graduating in 2021, I’ve been working as a software developer focusing on React, Next.js, and TypeScript.
  \n Over the past 4+ years, I’ve had the opportunity to help launch two products, one of them as a project lead.
  \n I love crafting intuitive and engaging user experiences and enjoy working in fast-paced environments where I can learn, grow, and make an impact.`,
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Javascript",
    "Remix",
    "Python",
    "Django",
    "SQL",
    "TailwindCSS",
    "Zod",
    "ShadCn",
    "Tanstack Query",
    "Playwright",
    "Tanstack Table",
    "Figma",
    "Git/Github",
    "Webflow",
  ],
  contact: {
    email: "hiteshrohira15@gmail.com",
    tel: "+919621740111",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/HiteshRohira",
        icon: Icons.github,
        navbar: true,
        posthogEvent: "github_clicked",
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/hiteshrohira/",
        icon: Icons.linkedin,
        navbar: true,
        posthogEvent: "linkedin_clicked",
      },
      email: {
        name: "Email",
        url: "mailto:hiteshrohira15@gmail.com",
        icon: Icons.email,
        navbar: true,
        posthogEvent: "email_clicked",
      },
      Twitter: {
        name: "X.com",
        url: "https://x.com/HiteshRohira15",
        icon: Icons.x,
        navbar: true,
        posthogEvent: "twitter_clicked",
      },
    },
  },

  work: [
    {
      company: "Astra Security",
      href: "https://www.getastra.com/",
      badges: [],
      location: "Remote",
      title: "SDE-1 Design & Front-end",
      logoUrl: "/astra.png",
      start: "October 2022",
      end: "May 2025",
      description:
        "Led end-to-end development of a product in React & NextJS from concept to launch. Read more [here](https://www.getastra.com/blog/astra-product/astra-orbitx/)",
    },
    {
      company: "Astra Security",
      badges: [],
      href: "https://www.getastra.com/",
      location: "Remote",
      title: "SDE-1 Front-end",
      logoUrl: "/astra.png",
      start: "February 2021",
      end: "October 2022",
      description: `Played a key role in developing the initial version of the company's frontend dashboard.`,
    },
  ],
  education: [
    {
      school: "Delhi University",
      href: "https://www.du.ac.in/",
      degree: "Bachelors",
      logoUrl: "/du.png",
      start: "2018",
      end: "2021",
    },
  ],
  projects: [
    // {
    //   title: "OpenDraw",
    //   href: "https://opendraw.vercel.app/",
    //   dates: "Dec 2025 - Jan 2025",
    //   active: true,
    //   description: "Opensource Excalidraw with local file management.",
    //   technologies: ["React", "Vite", "Typescript", "TailwindCSS", "ShadCn"],
    //   links: [
    //     {
    //       type: "Website",
    //       href: "https://opendraw.vercel.app/",
    //       icon: <Icons.globe className="size-3" />,
    //     },
    //     {
    //       type: "Source",
    //       href: "https://github.com/HiteshRohira/opendraw",
    //       icon: <Icons.github className="size-3" />,
    //     },
    //   ],
    //   image: "/opendraw.png",
    //   video: "",
    // },
    // {
    //   title: "Django Tasks App",
    //   href: "https://github.com/HiteshRohira/django-todo-app",
    //   dates: "Dec 2025 - Jan 2025",
    //   active: true,
    //   description:
    //     "A backend-only Django project demonstrating CRUD functionality with a Task model. Includes endpoints for creating, reading, updating, and deleting tasks, with a simple SQLite database.",
    //   technologies: ["Django", "Python", "HTML"],
    //   links: [
    //     {
    //       type: "Source",
    //       href: "https://github.com/HiteshRohira/django-todo-app",
    //       icon: <Icons.github className="size-3" />,
    //     },
    //   ],
    //   image: "/django-tasks-app.png",
    //   video: "",
    // },
    // {
    //   title: "Whatsapp Chat Opener",
    //   href: "https://wcl.vercel.app/",
    //   dates: "Jan 2024 - Feb 2024",
    //   active: true,
    //   description:
    //     "Before whatsapp had this native functionality, I felt the need for a tool to open a whatsapp chat for a new number",
    //   technologies: ["Next.js", "React", "TailwindCSS"],
    //   links: [
    //     {
    //       type: "Website",
    //       href: "https://wcl.vercel.app/",
    //       icon: <Icons.globe className="size-3" />,
    //     },
    //     {
    //       type: "Source",
    //       href: "https://github.com/HiteshRohira/whats-chat-linker/",
    //       icon: <Icons.github className="size-3" />,
    //     },
    //   ],
    //   image: "/wcl.png",
    //   video: "",
    // },
    // {
    //   title: "Movie Watchlist App",
    //   href: "https://movielisterbyhr.netlify.app/",
    //   dates: "June 2023 - Present",
    //   active: true,
    //   description:
    //     "An app that makes request to the tMDB API and gets movies and lets user add it to his watching list. Just simple practice website I made to learn React",
    //   technologies: ["React", "Axios", "Context API"],
    //   links: [
    //     {
    //       type: "Website",
    //       href: "https://movielisterbyhr.netlify.app/",
    //       icon: <Icons.globe className="size-3" />,
    //     },
    //     {
    //       type: "Source",
    //       href: "https://github.com/HiteshRohira/movie-list-maker/",
    //       icon: <Icons.github className="size-3" />,
    //     },
    //   ],
    //   image: "/movie-watchlist.png",
    //   video: "",
    // },
  ],
} as const;
