import { Icons } from "@/components/icons";

export const DATA = {
  name: "Hitesh Rohira",
  initials: "HR",
  url: "https://www.linkedin.com/in/hiteshrohira/",
  description: "A web developer and a problem solver :)",
  summary: `Since graduating in 2021, I’ve been working as a software developer focusing on React, TypeScript, Python & Django.
  \n Over the past 4.5 years, I’ve had the opportunity to help launch two products, one of them as a project lead.
  \n I love crafting intuitive and engaging user experiences and enjoy working in fast-paced environments where I can learn, grow, and make an impact.`,
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Typescript",
    "Python",
    "Django",
    "Next.js",
    "Javascript",
    "SQL",
    "TailwindCSS",
    "Zod",
    "ShadCn",
    "Tanstack Query",
    "Playwright",
    "Figma",
    "Git/Github",
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
      company: "Fractal Analytics",
      href: "https://fractal.ai/",
      badges: [],
      location: "Gurugram",
      title: "Engineer",
      logoUrl: "/fractal.jpeg",
      start: "Sept 2025",
      end: "Present",
      description:
        "Working as a full-stack developer, helping fortune 500 clients integrate AI into their products.",
    },
    {
      company: "Astra Security",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Software Development Engineer",
      logoUrl: "/astra.png",
      start: "Feb 2021",
      end: "May 2025",
      description:
        "Led end-to-end development of 2 products in React & NextJS from concept to launch.",
    },
    // {
    //   company: "Astra Security",
    //   badges: [],
    //   href: "https://www.getastra.com/",
    //   location: "Remote",
    //   title: "SDE-1 Front-end",
    //   logoUrl: "/astra.png",
    //   start: "February 2021",
    //   end: "October 2022",
    //   description: `Played a key role in developing the initial version of the company's frontend dashboard.`,
    // },
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
    {
      title: "ReVLC",
      href: "https://revlc.vercel.app",
      description:
        "A modern, lightweight media player built on libVLC, working toward full VLC feature parity with a cleaner, faster UI. Alpha builds available.",
      technologies: ["Rust", "Tauri", "Svelte"],
      image: "/projects/revlc.png",
      links: [
        {
          type: "Website",
          href: "https://revlc.vercel.app",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/ReVLC",
        },
      ],
    },
    {
      title: "Loadside",
      href: "https://github.com/HiteshRohira/loadside",
      description:
        "Sideload iPhone apps from a Mac with your own Apple ID, no Xcode, and keep them signed: a background service re-signs them over Wi-Fi before they expire. Guided setup, menu bar panel, tweak injection and a CLI.",
      technologies: ["Rust", "Swift", "SwiftUI"],
      image: "/projects/loadside.png",
      links: [
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/loadside",
        },
      ],
    },
    {
      title: "Mirage",
      href: "https://github.com/HiteshRohira/Mirage",
      description:
        "A fast, quiet Android TV home screen with AirPlay built in. iPhone and Mac can mirror, play video and stream music to the TV, and any phone becomes a remote. No ads, accounts or telemetry.",
      technologies: ["Java", "Kotlin", "C"],
      image: "/projects/mirage.png",
      links: [
        {
          type: "Download",
          href: "https://github.com/HiteshRohira/Mirage/releases/latest",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/Mirage",
        },
      ],
    },
    {
      title: "Mettro",
      href: "https://github.com/HiteshRohira/mettro",
      description:
        "A fast, modern metro companion for iOS, starting with Delhi Metro. Save a trip once, then take it in one tap.",
      technologies: ["React Native", "Expo", "TypeScript"],
      image: "/projects/mettro.png",
      links: [
        {
          type: "Download",
          href: "https://github.com/HiteshRohira/mettro/releases/latest",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/mettro",
        },
      ],
    },
    {
      title: "Farebi",
      href: "https://farebi.vercel.app/",
      description:
        "Realtime party games for solo play or 3–20 player rooms: Who's That?, Truth or Lie, and Impostor. Share a six-character code and play.",
      technologies: ["React", "TypeScript", "Convex", "Better Auth"],
      image: "/projects/farebi.png",
      links: [
        {
          type: "Play",
          href: "https://farebi.vercel.app/",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/farebi",
        },
      ],
    },
    {
      title: "Heple",
      href: "https://www.npmjs.com/package/heple",
      description:
        "A CLI that turns a structured JSON plan into a well-designed, self-contained HTML page, so coding agents produce good-looking plans with far fewer tokens.",
      technologies: ["TypeScript", "Node.js", "JSON Schema", "Vitest"],
      image: "/projects/heple.png",
      links: [
        {
          type: "npm",
          href: "https://www.npmjs.com/package/heple",
        },
        {
          type: "Platform demo",
          href: "https://heple.vercel.app/demo",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/heple",
        },
      ],
    },
    {
      title: "OpenDraw",
      href: "https://opendraw.vercel.app/",
      description:
        "Excalidraw with multiple saved drawings, autosave, and local browser storage.",
      technologies: ["React", "TypeScript", "Excalidraw", "IndexedDB"],
      image: "/projects/opendraw.png",
      links: [
        {
          type: "Website",
          href: "https://opendraw.vercel.app/",
        },
        {
          type: "Source",
          href: "https://github.com/HiteshRohira/opendraw",
        },
      ],
    },
  ],
} as const;

export const FEATURED_PROJECTS = ["ReVLC", "Mirage", "Mettro"] as const;
