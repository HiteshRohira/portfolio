import { Icons } from "@/components/icons";

export const DATA = {
  name: "Hitesh Rohira",
  initials: "HR",
  url: "https://www.linkedin.com/in/hiteshrohira/",
  description:
    "A self taught web developer passionate about building great UX experiences.",
  summary:
    "By the end of my graduation in 2021, I realised my love for web development and made the switch. Since then I have been working for the last 3.9+ years at Astra Security. I have helped ship 2 products, the latest one being our Saas dashboard where I helped architect and build an effective foundation.",
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Javascript",
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
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/hiteshrohira/",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Email",
        url: "mailto:hiteshrohira15@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Astra Security",
      href: "getastra.com",
      badges: ['Current'],
      location: "Remote",
      title: "SDE-1 Design & Front-end",
      logoUrl: "/astra.png",
      start: "October 2022",
      end: "Present",
      description:
        `Led end-to-end development of a product in React & NextJS from concept to launch, including architectural decisions.`,
    },
    {
      company: "Astra Security",
      badges: [],
      href: "getastra.com",
      location: "Remote",
      title: "Frontend Web Developer",
      logoUrl: "/astra.png",
      start: "February 2021",
      end: "October 2022",
      description:
        `Played a key role in developing the initial version of the company's frontend dashboard, focusing on performance and usability.`,
    },
  ],
  education: [
    {
      school: "Delhi University",
      href: "https://www.du.ac.in/",
      degree: "Bachelor's in Management Studies (BMS)",
      logoUrl: "/du.png",
      start: "2018",
      end: "2021",
    },
  ],
  projects: [
    {
      title: "Django Tasks App",
      href: "https://github.com/HiteshRohira/django-todo-app",
      dates: "Dec 2025 - Jan 2025",
      active: true,
      description:
        "A backend-only Django project demonstrating CRUD functionality with a Task model. Includes endpoints for creating, reading, updating, and deleting tasks, with a simple SQLite database.",
      technologies: [
        "Django",
        "Python",
        "HTML",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/django-todo-app",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/django-tasks-app.png",
      video: "",
    },
    {
      title: "Whatsapp Chat Opener",
      href: "https://wcl.vercel.app/",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "Before whatsapp had this native functionality, I felt the need for a tool to open a whatsapp chat for a new number",
      technologies: [
        "Next.js",
        "React",
        "TailwindCSS",
      ],
      links: [
        {
          type: "Website",
          href: "https://wcl.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/whats-chat-linker/",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/wcl.png",
      video: "",
    },
    {
      title: "Movie Watchlist App",
      href: "https://movielisterbyhr.netlify.app/",
      dates: "June 2023 - Present",
      active: true,
      description:
        "An app that makes request to the tMDB API and gets movies and lets user add it to his watching list. Just simple practice website I made to learn React",
      technologies: [
        "React",
        "Axios",
        "Context API",
      ],
      links: [
        {
          type: "Website",
          href: "https://movielisterbyhr.netlify.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/movie-list-maker/",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/movie-watchlist.png",
      video: "",
    },
  ],
} as const;
