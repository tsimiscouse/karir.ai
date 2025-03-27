import Layout from "@/components/Layout/Layout";
import Image from 'next/image';

interface TeamMemberProps {
  image: string;
  name: string;
  role: string;
  description: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ image, name, role, description, instagram, linkedin, github }) => (
  <div className="relative overflow-hidden transition duration-300 transform rounded shadow-lg lg:hover:-translate-y-2 hover:shadow-2xl">
    <Image
      className="object-cover w-full h-56 md:h-64 xl:h-80"
      src={image}
      alt={name}
    />
    <div className="absolute inset-0 flex flex-col justify-center px-5 py-4 text-center transition-opacity duration-300 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
      <p className="mb-1 text-lg font-bold text-gray-100">{name}</p>
      <p className="mb-4 text-xs text-gray-100">{role}</p>
      <p className="mb-4 text-xs tracking-wide text-gray-400">{description}</p>
      <div className="flex items-center justify-center space-x-3">
        <a href={instagram} className="text-white transition-colors duration-300 hover:text-teal-accent-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.[...]">
            </path>
          </svg>
        </a>
        <a href={linkedin} className="text-white transition-colors duration-300 hover:text-teal-accent-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225z[...">
            </path>
          </svg>
        </a>
        <a href={github} className="text-white transition-colors duration-300 hover:text-teal-accent-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-[...]">
            </path>
          </svg>
        </a>
      </div>
    </div>
  </div>
);

export default function Team() {
  const teamMembers = [
    {
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
      name: "Oliver Aguilerra",
      role: "Product Manager",
      description: "Vincent Van Gogh’s most popular painting, The Starry Night."
    },
    {
      image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      name: "Marta Clermont",
      role: "Design Team Lead",
      description: "Amet I love liquorice jujubes pudding croissant I love pudding."
    },
    {
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      name: "Anthony Geek",
      role: "CTO, Lorem Inc.",
      description: "Apple pie macaroon toffee jujubes pie tart cookie caramels."
    }
  ];

  return (
    <Layout>
      <div className="px-4 pt-[8vw] h-screen mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <span className="relative">Welcome</span>
            </span>{' '}
            our talented team of professionals
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque rem aperiam, eaque ipsa quae.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-1 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </Layout>
  );
}