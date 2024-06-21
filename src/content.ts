interface Card {
  link: string;
  imgSrc: string;
  title: string;
  description: string;
  detailedDescription: string;
}

interface Section {
  title: string;
  cards: Card[];
}

interface Content {
  header: {
    contactUs: string;
  };
  sections: {
    inGameFeatures: Section;
    websiteResources: Section;
    rulesSupport: Section;
  };
  footer: {
    copyright: string;
    links: {
      href: string;
      label: string;
    }[];
  };
}

export const content: Content = {
  header: {
    contactUs: "Contact",
  },
  sections: {
    inGameFeatures: {
      title: "In-Game Features",
      cards: [
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=Surf+Maps",
          title: "Surf Maps",
          description:
            "Catch the wave with our custom surf maps. No sunscreen required!",
          detailedDescription:
            "Surf Maps are custom-designed maps that challenge players to navigate complex environments using surfing techniques. These maps require precision and skill, offering a unique way to improve your control and timing in games.",
        },
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=SharpTimer",
          title: "SharpTimer",
          description:
            "Time flies when you're having fun. Learn to keep track with SharpTimer!",
          detailedDescription:
            "SharpTimer is an in-game tool that helps you manage your gaming sessions efficiently. It provides real-time updates and alerts to ensure you maintain a healthy balance between gaming and other activities.",
        },
      ],
    },
    websiteResources: {
      title: "Website Resources",
      cards: [
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=Perks+Subscriptions",
          title: "Perks and Subscriptions",
          description:
            "Subscribe for perks that make you part of a perfect club.",
          detailedDescription:
            "Our subscription plans offer various perks such as early access to new games, exclusive skins, and additional in-game content. These benefits enhance your gaming experience and provide added enjoyment.",
        },
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=Infractions+Stats",
          title: "Infractions and Stats",
          description: "Keep your stats cleaner than your room.",
          detailedDescription:
            "This feature allows you to track your gaming statistics and review any infractions you may have incurred. By analyzing this data, you can identify areas for improvement and refine your strategies for better performance.",
        },
      ],
    },
    rulesSupport: {
      title: "Rules & Support",
      cards: [
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=Server+Rules",
          title: "Server Rules",
          description: "Rules to follow, because not everyone can be a rebel.",
          detailedDescription:
            "Understanding the server rules is crucial for maintaining a respectful and enjoyable gaming environment. These rules are designed to ensure fair play and prevent disruptive behavior among players.",
        },
        {
          link: "#",
          imgSrc: "https://placehold.co/100x100.png?text=Support",
          title: "Support",
          description: "Stuck? We're here to help, just like a good neighbor.",
          detailedDescription:
            "If you encounter any problems or have questions about our games, our support team is ready to help. We strive to provide timely and effective assistance to ensure a smooth gaming experience.",
        },
      ],
    },
  },
  footer: {
    copyright: "© 2024 Imperfect Gamers. All rights reserved.",
    links: [
      { href: "#", label: "Forums" },
      { href: "#", label: "Contact Us" },
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
    ],
  },
};
