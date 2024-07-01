// src/content.ts

interface Content {
  header: {
    contactUs: string;
  };
  categories: {
    [id: number]: Category;
  };
  cards: {
    [id: number]: Card;
  };
  footer: {
    copyright: string;
    links: {
      href: string;
      label: string;
    }[];
  };
}

export interface CardVersion {
  category: number; // Category ID of the card for this version
  title: string; // Title of the card for this version
  description: string; // Description for this version
  detailedDescription: string; // More detailed description for this version
  diffs?: string; // Optional serialized diff data between this and the previous version
  editedBy: number; // Identifier of the user who made the edit
  editDate: string; // Timestamp of when the edit was made
  changes?: string[]; // Array of change descriptions
  archived: boolean; // Flag to indicate if the card is archived
  staffOnly: boolean; // Flag to indicate if the card is only visible to staff
  slug: string; // URL slug for the card
  showImage?: boolean; // Optional flag to show or hide the image in UI
  imgSrc: string; // Source URL for the card's image
}

export interface Card {
  versions: {
    [id: number]: CardVersion;
  };
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
}

export interface CategoryVersion {
  versionId: number; // Unique identifier for this version
  title: string; // Title of the category for this version
  diffs?: string; // Optional serialized diff data between this and the previous version
  editedBy: number; // Identifier of the user who made the edit
  editDate: string; // Timestamp of when the edit was made
  changes?: string[]; // Array of change descriptions
}

export interface Category {
  versions: CategoryVersion[]; // Array of version objects, including the initial and all edits
}

export const content: Content = {
  header: {
    contactUs: "Need help? Contact us!",
  },
  categories: {
    1: {
      versions: [
        {
          versionId: 1,
          title: "Server Rules",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    2: {
      versions: [
        {
          versionId: 1,
          title: "VIP Infractions",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    3: {
      versions: [
        {
          versionId: 1,
          title: "Staff Guidelines",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    4: {
      versions: [
        {
          versionId: 1,
          title: "Posting Guidelines",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    5: {
      versions: [
        {
          versionId: 1,
          title: "Admin Panel Guidelines",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    6: {
      versions: [
        {
          versionId: 1,
          title: "Forum and Subscriptions",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    7: {
      versions: [
        {
          versionId: 1,
          title: "Cheating Policy",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    8: {
      versions: [
        {
          versionId: 1,
          title: "Advanced Rules Menu",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    9: {
      versions: [
        {
          versionId: 1,
          title: "Infractions and Stats",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
    10: {
      versions: [
        {
          versionId: 1,
          title: "Server Commands",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          changes: [],
        },
      ],
    },
  },
  cards: {
    1: {
      versions: {
        1: {
          title: "General Conduct",
          description: "Because chaos is only fun in moderation.",
          detailedDescription:
            "These are the current rules shown to players in-game using the command 'sm_rules' in console or !rules in chat.\n\n**No Spamming:** No excessive use of voice or text chat. No ear spam. No sound clips. No voice activation.\n**No interrupting:** Do not interrupt players while they are rapping. No adlibs.\n**No disruptive behavior:** Do not threaten or attack other players or IG staff. Don't be toxic.\n**No discrimination:** Do not attack or target anyone for their ethnicity, religion, sexual preference, or gender.\n**No use of offensive slurs:** Using or baiting offensive racial or homophobic slurs will result in a permanent ban.\n**No doxing:** Attempting to discover or provide the personal information of another player will result in a permanent ban.\n**No advertising:** Don't drop your Soundcloud, Twitch, YouTube, Instagram, etc. here. No links in names (only CS:GO item websites are permitted).",
          diffs: "", // Empty or null for initial version
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          category: 0,
          archived: false,
          staffOnly: false,
          slug: "",
          imgSrc: "https://placehold.co/100x100.png?text=general-rules",
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    2: {
      versions: {
        1: {
          category: 1,
          title: "Extended Mute or Ban",
          description: "For those who really like to push the boundaries.",
          detailedDescription:
            "Severe server disruption; these infractions will result...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "extended-mute-or-ban",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=extended-mute-or-ban",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    3: {
      versions: {
        1: {
          category: 1,
          title: "Minimum 30 Minute Mute",
          description: "When you need a little quiet time to reflect.",
          detailedDescription:
            "General server disruption; these infractions will result...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "minimum-30-minute-mute",
          showImage: true,
          imgSrc:
            "https://placehold.co/100x100.png?text=minimum-30-minute-mute",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    4: {
      versions: {
        1: {
          category: 1,
          title: "Rapping and DJing Rules",
          description: "Because even mics need a break sometimes.",
          detailedDescription: "Everyone is welcome to rap or play beats...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "rapping-and-djing-rules",
          showImage: true,
          imgSrc:
            "https://placehold.co/100x100.png?text=rapping-and-djing-rules",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    5: {
      versions: {
        1: {
          category: 2,
          title: "VIP Infractions",
          description:
            "Some people just want to watch the world burn... but not here.",
          detailedDescription:
            "Abuse of VIP Perks: Examples of abuse include...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "vip-infractions",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=vip-infractions",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    6: {
      versions: {
        1: {
          category: 3,
          title: "Imperfect Gamers Staff Guide Redux (2017)",
          description:
            "A gentle reminder on how not to become a digital tyrant.",
          detailedDescription:
            "Over the past few years, the ban process on Imperfect Gamers has been adjusted...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "staff-guide-redux",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=staff-guide-redux",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    7: {
      versions: {
        1: {
          category: 3,
          title: "Ban Appeals",
          description:
            "Because everyone deserves a second chance... or do they?",
          detailedDescription:
            "Appeals: Every mod is required to participate in the ban appeal discussion thread...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "ban-appeals",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=ban-appeals",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    8: {
      versions: {
        1: {
          category: 4,
          title: "Posting Guidelines",
          description:
            "Spreading your digital wings without crashing into the window.",
          detailedDescription:
            "Anybody with DJ or Rapper status is allowed to create one post...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "posting-guidelines",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=posting-guidelines",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    9: {
      versions: {
        1: {
          category: 5,
          title: "Admin Panel Guide",
          description:
            "Wielding your digital power responsibly... or just recklessly enough.",
          detailedDescription:
            "Here's a rundown of basic admin panel usage for new staff...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "admin-panel-guide",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=admin-panel-guide",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    10: {
      versions: {
        1: {
          category: 6,
          title: "Creating a New Thread",
          description:
            "Crafting your digital soapbox without getting splinters.",
          detailedDescription:
            "Make a new thread in this forum with the following formatting...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "creating-a-new-thread",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=creating-a-new-thread",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    11: {
      versions: {
        1: {
          category: 7,
          title: "Cheating Policy",
          description:
            "Cheaters never prosper, unless they're really good at it.",
          detailedDescription:
            "Cheating in any form is not allowed on any of our servers...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "cheating-policy",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=cheating-policy",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    12: {
      versions: {
        1: {
          category: 8,
          title: "Advanced Rules Menu Example",
          description: "Navigating the bureaucratic labyrinth of server rules.",
          detailedDescription:
            "Example: {% interactive %} > sm_addrule_name No surfing or rapping...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "advanced-rules-menu-example",
          showImage: true,
          imgSrc:
            "https://placehold.co/100x100.png?text=advanced-rules-menu-example",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    13: {
      versions: {
        1: {
          category: 9,
          title: "Infractions and Stats",
          description:
            "Where the rubber meets the road in server law enforcement.",
          detailedDescription:
            "For any moderators or admins, using your STAFF tag is preferred...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "infractions-and-stats",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=infractions-and-stats",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
    },
    14: {
      versions: {
        1: {
          category: 10,
          title: "General Commands",
          description:
            "For when you need to do something but don't know how to do it manually.",
          detailedDescription:
            "sm_avg: Display the average time of the current map...",
          diffs: "",
          editedBy: 1,
          editDate: "2024-01-01T00:00:00Z",
          archived: false,
          staffOnly: false,
          slug: "general-commands",
          showImage: true,
          imgSrc: "https://placehold.co/100x100.png?text=general-commands",
          changes: [],
        },
      },
      matches: {
        title: false,
        description: false,
        detailedDescription: false,
      },
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
