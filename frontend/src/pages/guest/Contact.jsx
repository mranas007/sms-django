import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FaPaperPlane, FaEnvelope, FaUser, FaTag, FaCommentAlt, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight sm:text-5xl">Contact Administration</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Reach out to the administrative office for admissions, support, or general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-indigo-600 text-white border-none h-full">
              <h3 className="text-xl font-bold mb-6">Contact Info</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-indigo-300 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-indigo-100 text-sm">123 Academic Way,<br />Knowledge City, ED 45678</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="text-indigo-300 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-indigo-100 text-sm">+1 (555) 123-4567</p>
                    <p className="text-indigo-200 text-xs mt-1">Mon-Fri, 9am - 5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-indigo-300 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-indigo-100 text-sm">admin@institute.edu</p>
                    <p className="text-indigo-100 text-sm">support@institute.edu</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card title="Send a Message">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    id="department"
                    name="department"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>General Inquiry</option>
                    <option>Admissions</option>
                    <option>Student Affairs</option>
                    <option>IT Support</option>
                    <option>Faculty/HR</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FaCommentAlt className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center"
                    icon={<FaPaperPlane />}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;