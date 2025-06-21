import React from 'react';

const features = [
  {
    title: 'Real-Time Data',
    desc: 'Live stock price updates with minimal delay.',
    icon: (
      <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 17l6-6 4 4 8-8v11H3z" />
      </svg>
    ),
  },
  {
    title: 'Advanced Security',
    desc: 'Your data is protected with top-tier encryption.',
    icon: (
      <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
    ),
  },
  {
    title: 'Custom Alerts',
    desc: 'Set personalized alerts for stock performance.',
    icon: (
      <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a6 6 0 00-6 6v5H5v2h14v-2h-1V8a6 6 0 00-6-6zm0 20a2 2 0 002-2H10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Portfolio Analysis',
    desc: 'Visual breakdown of your stock performance.',
    icon: (
      <svg className="w-8 h-8 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 2v20c-5-1-9-6-9-11S6 3 11 2zm2 0c5 1 9 6 9 11s-4 10-9 11V2z" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white px-6">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-md flex items-center space-x-4"
          >
            {feature.icon}
            <div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
