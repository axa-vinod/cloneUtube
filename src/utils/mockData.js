export const CATEGORIES = [
  'All',
  'Tech',
  'Music',
  'Gaming',
  'Movies',
  'Science',
  'Comedy',
  'Lofi'
];

export const CHANNELS = {
  mkbhd: {
    id: 'mkbhd',
    name: 'Marques Brownlee',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=1200&auto=format&fit=crop&q=80',
    subscribers: '18.2M',
    subscribersCount: 18200000,
    verified: true,
    description: 'MKBHD: Quality Tech Videos | Reviews | News | Podcasts'
  },
  chillhop: {
    id: 'chillhop',
    name: 'Chillhop Music',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    subscribers: '3.4M',
    subscribersCount: 3400000,
    verified: true,
    description: 'Your daily dose of chill study beats, lofi hip hop, and relaxing vibes.'
  },
  gaminghub: {
    id: 'gaminghub',
    name: 'Gaming Hub',
    avatar: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    subscribers: '1.2M',
    subscribersCount: 1200000,
    verified: false,
    description: 'Daily gaming walkthroughs, news, and highlights from your favorite creators.'
  },
  blender: {
    id: 'blender',
    name: 'Blender Studio',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80',
    subscribers: '850K',
    subscribersCount: 850000,
    verified: true,
    description: 'Official Blender open-source animations, short movies, and CGI visual effects showcase.'
  },
  sciencefun: {
    id: 'sciencefun',
    name: 'Curious Mind',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    subscribers: '4.7M',
    subscribersCount: 4700000,
    verified: true,
    description: 'Exploring the weird, wonderful, and physics-defying mysteries of the universe.'
  }
};

export const VIDEOS = [
  {
    id: 'vid1',
    title: 'The Ultimate Tech Setup Tour - 2026 Edition',
    description: 'We are looking at the most modern, clean, and productive desk setups for coding, video editing, and gaming in 2026. Feat. new OLED monitors, custom keyboards, and smart home lighting integrations. Let me know which one is your favorite in the comments!',
    videoUrl: 'https://www.youtube.com/watch?v=V38ZtTskK_g', // MKBHD setup style
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    views: '840,320 views',
    viewsCount: 840320,
    likes: 42000,
    dislikes: 120,
    duration: '12:45',
    uploadedAt: '2 days ago',
    category: 'Tech',
    channel: CHANNELS.mkbhd,
    comments: [
      { id: 'c1', username: 'AlexCoder', time: '1 day ago', text: 'This setup is absolutely insane! Love the cable management.', likes: 320 },
      { id: 'c2', username: 'JaneDoe', time: '18 hours ago', text: 'Where did you get that desk mat? Looks gorgeous.', likes: 45 },
      { id: 'c3', username: 'TechFan', time: '4 hours ago', text: 'MKBHD never disappoints with the video quality.', likes: 12 }
    ]
  },
  {
    id: 'vid2',
    title: 'Lofi Beats to Study/Relax To ☕ 24/7 Study Session',
    description: 'Grab a warm coffee, open your IDE, and sink into this cozy lofi hip hop mix. Perfect for programmers, writers, and students who need a smooth vibe in the background.',
    videoUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi Girl / chillhop style
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    views: '1,204,908 views',
    viewsCount: 1204908,
    likes: 89000,
    dislikes: 300,
    duration: '2:15:30',
    uploadedAt: '1 week ago',
    category: 'Music',
    channel: CHANNELS.chillhop,
    comments: [
      { id: 'c4', username: 'StudyModeOn', time: '5 days ago', text: 'Literally code to this daily. It helps me focus so much.', likes: 1205 },
      { id: 'c5', username: 'NightOwl', time: '3 days ago', text: 'This stream is a lifesaver for finals week. Thank you!', likes: 412 }
    ]
  },
  {
    id: 'vid3',
    title: 'Cyberpunk 2077 - Next-Gen Ray Reconstruction Gameplay',
    description: 'Running Cyberpunk 2077 on an RTX 5090 with Ray Tracing Overdrive Mode, DLSS 4, and Frame Generation. Experiencing fully simulated paths of light at 4K resolution.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', // Visual sci-fi sample
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    views: '340,950 views',
    viewsCount: 340950,
    likes: 18000,
    dislikes: 420,
    duration: '14:20',
    uploadedAt: '5 days ago',
    category: 'Gaming',
    channel: CHANNELS.gaminghub,
    comments: [
      { id: 'c6', username: 'GamerGuy', time: '4 days ago', text: 'Graphics look cleaner than real life. Unreal!', likes: 88 },
      { id: 'c7', username: 'NvidiaSimp', time: '2 days ago', text: 'My graphics card started sweating just watching this video.', likes: 231 }
    ]
  },
  {
    id: 'vid4',
    title: 'Sintel - Official Open Source Animated Short Film',
    description: 'Sintel is an independently produced short film, initiated by the Blender Foundation. The film follows a girl searching for a baby dragon she nurtured. Enjoy the high quality CGI and cinematography.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    views: '4,560,780 views',
    viewsCount: 4560780,
    likes: 245000,
    dislikes: 1100,
    duration: '8:48',
    uploadedAt: '1 year ago',
    category: 'Movies',
    channel: CHANNELS.blender,
    comments: [
      { id: 'c8', username: 'AnimEditor', time: '11 months ago', text: 'A masterpiece created entirely in Blender. Shows what open source can do!', likes: 2341 },
      { id: 'c9', username: 'CGIArtist', time: '8 months ago', text: 'The dragon design is so beautiful. Ending always makes me cry.', likes: 984 }
    ]
  },
  {
    id: 'vid5',
    title: 'Why Time Dilation Actually Happens Near Black Holes',
    description: 'We explore Einstein’s General Theory of Relativity and visually demonstrate how gravitational fields warp the fabric of spacetime, causing time to tick slower near extreme masses like black holes.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Sci-fi surreal physics feel
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    views: '2,310,400 views',
    viewsCount: 2310400,
    likes: 178000,
    dislikes: 890,
    duration: '18:12',
    uploadedAt: '3 weeks ago',
    category: 'Science',
    channel: CHANNELS.sciencefun,
    comments: [
      { id: 'c10', username: 'NolanFan', time: '2 weeks ago', text: 'This explains Interstellar so much better than my college physics prof did.', likes: 1402 },
      { id: 'c11', username: 'SpacetimeWarp', time: '1 week ago', text: 'If you fall in, does time stop for you or everyone else? Fascinating stuff.', likes: 890 }
    ]
  },
  {
    id: 'vid6',
    title: 'The Funniest Tech Support Disasters of all Time!',
    description: 'From users plugging power strips into themselves to programmers deleting production databases on their first day, we recount some of the funniest, most jaw-dropping tech support stories.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Funny cartoon vibe
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    views: '670,400 views',
    viewsCount: 670400,
    likes: 31000,
    dislikes: 450,
    duration: '10:05',
    uploadedAt: '4 days ago',
    category: 'Comedy',
    channel: CHANNELS.mkbhd,
    comments: [
      { id: 'c12', username: 'SysAdmin77', time: '3 days ago', text: 'I once had a user complain their wireless mouse wasn’t working... it was unplugged from the USB.', likes: 789 },
      { id: 'c13', username: 'CodeNewbie', time: '2 days ago', text: 'Deleting prod database is a rite of passage! Glad I haven’t done it... yet.', likes: 213 }
    ]
  },
  {
    id: 'vid7',
    title: 'Relaxing Coffee Shop Jazz Music & Rain Ambient Noise',
    description: 'Chill morning jazz playlist in a cozy coffee shop with gentle rain sounds outside. Perfect background soundtrack for deep coding, learning, or falling asleep.',
    videoUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    views: '945,000 views',
    viewsCount: 945000,
    likes: 54000,
    dislikes: 120,
    duration: '3:00:00',
    uploadedAt: '2 weeks ago',
    category: 'Music',
    channel: CHANNELS.chillhop,
    comments: [
      { id: 'c14', username: 'JazzLover', time: '1 week ago', text: 'This and rain - name a better duo. I’ll wait.', likes: 320 }
    ]
  },
  {
    id: 'vid8',
    title: 'iPhone 17 Ultra Pro Max - Honest Review',
    description: 'We have been testing the brand-new iPhone 17 Ultra Pro Max for a full month. Here is my breakdown of the battery, the new under-screen cameras, and why you probably shouldn’t upgrade yet.',
    videoUrl: 'https://www.youtube.com/watch?v=V38ZtTskK_g',
    thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
    views: '1,450,000 views',
    viewsCount: 1450000,
    likes: 95000,
    dislikes: 2400,
    duration: '15:10',
    uploadedAt: '6 days ago',
    category: 'Tech',
    channel: CHANNELS.mkbhd,
    comments: [
      { id: 'c15', username: 'AppleSheep', time: '5 days ago', text: 'The design is gorgeous but the price is astronomical.', likes: 890 }
    ]
  },
  {
    id: 'vid9',
    title: 'Elden Ring - Speedrun World Record (Any% Glitchless)',
    description: 'Watch the full run of the current world record speedrun of Elden Ring, completing the entire main questline in record time under 50 minutes without using any map glitches.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&auto=format&fit=crop&q=80',
    views: '540,000 views',
    viewsCount: 540000,
    likes: 32000,
    dislikes: 90,
    duration: '48:32',
    uploadedAt: '3 days ago',
    category: 'Gaming',
    channel: CHANNELS.gaminghub,
    comments: []
  },
  {
    id: 'vid10',
    title: 'Quantum Computing Explained for Beginners',
    description: 'What is a qubit? How does superposition actually work, and will quantum computers really break modern cybersecurity cryptography? We explain in simple terms with zero complex math.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    views: '3,200,000 views',
    viewsCount: 3200000,
    likes: 210000,
    dislikes: 800,
    duration: '22:15',
    uploadedAt: '1 month ago',
    category: 'Science',
    channel: CHANNELS.sciencefun,
    comments: []
  }
];

export const NOTIFICATIONS = [
  { id: 'n1', channel: CHANNELS.mkbhd, text: 'uploaded: Apple Vision Pro 2 Review - The Future?', time: '2 hours ago', read: false },
  { id: 'n2', channel: CHANNELS.chillhop, text: 'is live: ☕ Cozy Morning Radio - Lofi Hip Hop Study Beats', time: '5 hours ago', read: false },
  { id: 'n3', channel: CHANNELS.sciencefun, text: 'uploaded: What Happens If You Fall Into a Liquid Mirror?', time: '1 day ago', read: true }
];
