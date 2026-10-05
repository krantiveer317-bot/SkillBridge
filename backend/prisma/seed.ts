import { PrismaClient, SkillCategory } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  { name: 'HTML', category: SkillCategory.FRONTEND, description: 'HTML and web page structure' },
  { name: 'CSS', category: SkillCategory.FRONTEND, description: 'CSS and responsive web styling' },
  { name: 'JavaScript', category: SkillCategory.FRONTEND, description: 'JavaScript programming for web applications' },
  { name: 'TypeScript', category: SkillCategory.FRONTEND, description: 'Type-safe JavaScript development' },
  { name: 'React', category: SkillCategory.FRONTEND, description: 'React frontend development' },
  { name: 'Next.js', category: SkillCategory.FRONTEND, description: 'Next.js full-stack React development' },

  { name: 'Node.js', category: SkillCategory.BACKEND, description: 'Node.js backend development' },
  { name: 'Express.js', category: SkillCategory.BACKEND, description: 'Express.js API development' },
  { name: 'NestJS', category: SkillCategory.BACKEND, description: 'NestJS backend development' },
  { name: 'Java', category: SkillCategory.BACKEND, description: 'Java programming and backend development' },
  { name: 'C++', category: SkillCategory.BACKEND, description: 'C++ programming and software development' },
  { name: 'Python', category: SkillCategory.BACKEND, description: 'Python programming and backend development' },

  { name: 'PostgreSQL', category: SkillCategory.BACKEND, description: 'PostgreSQL relational database development' },
  { name: 'MySQL', category: SkillCategory.BACKEND, description: 'MySQL relational database development' },
  { name: 'MongoDB', category: SkillCategory.BACKEND, description: 'MongoDB NoSQL database development' },
  { name: 'Prisma', category: SkillCategory.BACKEND, description: 'Prisma ORM and database access' },

  { name: 'Git', category: SkillCategory.DEVOPS_CLOUD, description: 'Git version control' },
  { name: 'GitHub', category: SkillCategory.DEVOPS_CLOUD, description: 'GitHub collaboration and source control' },
  { name: 'Docker', category: SkillCategory.DEVOPS_CLOUD, description: 'Docker containerization' },
  { name: 'AWS', category: SkillCategory.DEVOPS_CLOUD, description: 'Amazon Web Services cloud development' },

  { name: 'Machine Learning', category: SkillCategory.AI_ML, description: 'Machine learning model development' },
  { name: 'Deep Learning', category: SkillCategory.AI_ML, description: 'Deep learning and neural networks' },
  { name: 'Artificial Intelligence', category: SkillCategory.AI_ML, description: 'Artificial intelligence development' },
  { name: 'scikit-learn', category: SkillCategory.AI_ML, description: 'Machine learning with scikit-learn' },
  { name: 'PyTorch', category: SkillCategory.AI_ML, description: 'Deep learning with PyTorch' },

  { name: 'Data Science', category: SkillCategory.DATA_SCIENCE, description: 'Data analysis and data science' },
  { name: 'Pandas', category: SkillCategory.DATA_SCIENCE, description: 'Data manipulation and analysis with Pandas' },
  { name: 'NumPy', category: SkillCategory.DATA_SCIENCE, description: 'Numerical computing with NumPy' },
  { name: 'SQL', category: SkillCategory.DATA_SCIENCE, description: 'SQL data querying and analysis' },

  { name: 'Flutter', category: SkillCategory.MOBILE, description: 'Cross-platform mobile development with Flutter' },
  { name: 'React Native', category: SkillCategory.MOBILE, description: 'Cross-platform mobile development with React Native' },

  { name: 'Figma', category: SkillCategory.DESIGN_UX, description: 'UI/UX design with Figma' },
  { name: 'UI/UX Design', category: SkillCategory.DESIGN_UX, description: 'User interface and experience design' },

  { name: 'Solana', category: SkillCategory.BLOCKCHAIN, description: 'Solana blockchain development' },
  { name: 'Ethereum', category: SkillCategory.BLOCKCHAIN, description: 'Ethereum blockchain development' },
  { name: 'Web3', category: SkillCategory.BLOCKCHAIN, description: 'Web3 and decentralized application development' },
];

async function main() {
  console.log('Seeding skills...');

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {
        category: skill.category,
        description: skill.description,
        isActive: true,
      },
      create: {
        name: skill.name,
        category: skill.category,
        description: skill.description,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${skills.length} skills.`);
}

main()
  .catch((error) => {
    console.error('Skill seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
