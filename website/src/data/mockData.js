export const categories = [
  { id: 'all', name: 'All' },
  { id: 'figures', name: 'Action Figures' },
  { id: 'home', name: 'Home Decor' },
  { id: 'tools', name: 'Useful Tools' },
  { id: 'art', name: 'Art & Statues' }
];

export const products = [
  {
    id: 'cyber-warrior',
    title: 'Cyber Warrior Action Figure',
    price: 35.00,
    category: 'figures',
    material: 'PLA+ / Resin details',
    dimensions: '15cm x 8cm x 5cm',
    weight: '120g',
    description: 'A highly detailed, fully articulated cyber warrior figure. Perfect for collectors or tabletop gamers. The armor pieces are printed in high-resistance PLA+, while the finer details like the visor are made of resin for maximum clarity.',
    image: 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Cyberpunk', 'Articulated', 'Kids']
  },
  {
    id: 'geometric-planter',
    title: 'Modern Geometric Planter',
    price: 22.00,
    category: 'home',
    material: 'PETG (Water Resistant)',
    dimensions: '12cm x 12cm x 10cm',
    weight: '150g',
    description: 'A sleek, minimalist planter perfect for succulents or small indoor plants. Designed with a Bauhaus-inspired geometric pattern. Includes a hidden drainage tray at the bottom to keep your desk clean.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Decor', 'Minimalist', 'Plants']
  },
  {
    id: 'modular-organizer',
    title: 'Hexagon Modular Desk Organizer',
    price: 18.00,
    category: 'tools',
    material: 'Matte PLA',
    dimensions: 'Piece: 6cm x 6cm x 8cm',
    weight: '45g per piece',
    description: 'Keep your workspace tidy with these magnetic, interlocking hexagonal cups. You can buy them individually and snap them together in any shape you want. Great for pens, SD cards, and tools.',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Desk', 'Organization', 'Modular']
  },
  {
    id: 'dragon-bust',
    title: 'Ancient Dragon Bust',
    price: 60.00,
    category: 'art',
    material: 'Silk PLA',
    dimensions: '20cm x 15cm x 15cm',
    weight: '350g',
    description: 'A stunning, high-definition bust of an ancient mythical dragon. Printed with special "Silk" filament that gives it an incredibly shiny, metallic look without any painting required. An absolute centerpiece for any display shelf.',
    image: 'https://images.unsplash.com/photo-1581481615986-261bdc100dd9?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Fantasy', 'Display', 'Shiny']
  },
  {
    id: 'headphone-stand',
    title: 'Ergonomic Headphone Stand',
    price: 25.00,
    category: 'tools',
    material: 'Carbon Fiber PETG',
    dimensions: '25cm x 12cm x 12cm',
    weight: '200g',
    description: 'A sturdy, beautifully curved stand for your premium headphones. The top curve perfectly matches most headbands to prevent indentations, and the base has anti-slip rubber feet.',
    image: 'https://images.unsplash.com/photo-1599669500515-b3e1d08eacdf?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Tech', 'Audio', 'Setup']
  },
  {
    id: 'abstract-sculpture',
    title: 'Infinite Loop Sculpture',
    price: 45.00,
    category: 'art',
    material: 'Marble PLA',
    description: 'A mesmerizing continuous loop that looks different from every angle. Designed computationally to create an optical illusion. Printed in a special filament that mimics the texture and look of real marble stone.',
    dimensions: '18cm x 18cm x 18cm',
    weight: '400g',
    image: 'https://images.unsplash.com/photo-1544207137-9751e18af291?auto=format&fit=crop&q=80&w=800&h=800',
    tags: ['Modern', 'Illusion', 'Decor']
  }
];

export const faqs = [
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Europe and North America. However, if you have a special request, feel free to contact us and we can try to work something out!"
  },
  {
    question: "How durable are the 3D printed parts?",
    answer: "It depends on the material! For decorative items, we use PLA which is biodegradable and great for indoor use. For functional parts (like tools or headphone stands), we use stronger materials like PETG or Carbon Fiber infused plastics that can withstand heat and stress."
  },
  {
    question: "Can I request a custom color?",
    answer: "Absolutely! If you see a model in our catalog but want it in a different color (e.g., Neon Green or Silk Gold), just send us a message via the Contact page with your request."
  },
  {
    question: "How long does a custom print take?",
    answer: "For custom requests, we generally need 1-2 days to review the .stl file and provide a quote. Once approved, most prints take between 3 to 7 days to print, post-process, and ship."
  }
];
