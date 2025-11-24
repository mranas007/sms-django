import React from 'react';
import Card from '../../components/common/Card';
import { FaUniversity, FaHistory, FaGlobe, FaUserGraduate } from 'react-icons/fa';

function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight sm:text-5xl">About Excellence Institute</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Fostering academic excellence and innovation since 1995.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-full border-t-4 border-t-indigo-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaUniversity className="text-indigo-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To provide a transformative educational experience that empowers students with knowledge, skills, and values to become global leaders. We are dedicated to maintaining high academic standards and fostering a supportive learning environment.
            </p>
          </Card>

          <Card className="h-full border-t-4 border-t-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaGlobe className="text-purple-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be a premier institution recognized for excellence in teaching, research, and community engagement. We aim to cultivate a diverse and inclusive campus culture that inspires creativity and innovation.
            </p>
          </Card>
        </div>

        <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaHistory className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our History</h2>
          </div>
          <div className="prose prose-indigo text-gray-600">
            <p>
              Established in 1995, Excellence Institute has grown from a small college to a renowned center of learning. Over the past three decades, we have expanded our academic programs, modernized our campus facilities, and built a strong alumni network.
            </p>
            <p className="mt-4">
              Today, we offer a wide range of undergraduate and postgraduate programs across various disciplines, supported by state-of-the-art laboratories, libraries, and digital resources.
            </p>
          </div>
        </Card>

        <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUserGraduate className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Student Life</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Life at Excellence Institute goes beyond the classroom. Our vibrant campus offers numerous clubs, sports teams, and cultural events. We believe in holistic development and encourage students to explore their passions and leadership potential.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default About;