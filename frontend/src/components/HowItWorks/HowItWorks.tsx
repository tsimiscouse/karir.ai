import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    },
    {
      number: 2,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    },
    {
      number: 3,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    },
    {
      number: 4,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    },
    {
      number: 5,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    },
    {
      number: 6,
      title: "LOREM IPSUM DOLOR SIT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus."
    }
  ];
  
  return (
    <section className="my-12 p-4 bg-[#F4EFEB] rounded-lg w-full max-w-[70vw] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-black">BAGAIMANA CARA KARIR.AI BEKERJA?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.number} className="p-6 border-2 rounded-lg bg-white hover:shadow-lg transition-shadow border-[#577C8E]">
            <h3 className="text-lg font-bold flex items-center mb-3 text-black">
              <span className="text-3xl font-extrabold mr-2 text-[#577C8E]">{step.number}</span>
              {step.title}
            </h3>
            <p className="text-gray-600 font-sans">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
