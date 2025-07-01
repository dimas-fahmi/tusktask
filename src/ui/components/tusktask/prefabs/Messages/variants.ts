// Animation variants
export const containerVariants = {
  open: {
    maxWidth: "900px",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  closed: {
    maxWidth: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
};

export const sidebarVariants = containerVariants;

export const chatRoomVariants = containerVariants;

export const contactVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  }),
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const emptyStateVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.4,
    },
  },
};

export const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export const contacts = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "2:30 PM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "Thanks for the help!",
    time: "1:15 PM",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Team Project",
    lastMessage: "Meeting at 3 PM",
    time: "12:45 PM",
    unread: 5,
    online: false,
  },
  {
    id: 4,
    name: "Mom",
    lastMessage: "Don't forget dinner tonight",
    time: "11:30 AM",
    unread: 1,
    online: true,
  },
  {
    id: 5,
    name: "Alex Wilson",
    lastMessage: "Sure, sounds good!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
];
