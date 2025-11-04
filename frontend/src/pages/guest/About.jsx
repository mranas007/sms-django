import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">About Us</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to revolutionize school management by providing an intuitive, comprehensive, and efficient system that empowers educators, engages students, and connects parents. We believe in fostering an environment where administrative tasks are simplified, allowing more focus on quality education and student development.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a future where every educational institution, regardless of its size or location, has access to cutting-edge technology that streamlines operations, enhances communication, and promotes academic excellence. We strive to be the leading provider of school management solutions globally.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li><strong>Innovation:</strong> Continuously seeking new and better ways to serve our users.</li>
            <li><strong>Integrity:</strong> Operating with honesty, transparency, and ethical practices.</li>
            <li><strong>Excellence:</strong> Committed to delivering high-quality products and services.</li>
            <li><strong>Collaboration:</strong> Working together with schools to understand and meet their unique needs.</li>
            <li><strong>User-Centricity:</strong> Designing solutions with the user experience at the forefront.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
          <p className="text-gray-700 leading-relaxed">
            We are a dedicated team of passionate developers, designers, and educational experts committed to making a difference in the education sector. Our diverse backgrounds and shared vision drive us to create impactful solutions.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;