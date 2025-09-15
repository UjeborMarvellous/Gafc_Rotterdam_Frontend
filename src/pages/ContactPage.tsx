import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      href: '#',
      icon: '📱',
      description: 'Chat with us on WhatsApp',
    },
    {
      name: 'Instagram',
      href: '#',
      icon: '📷',
      description: 'Follow us on Instagram',
    },
    {
      name: 'Facebook',
      href: '#',
      icon: '👥',
      description: 'Connect with us on Facebook',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - GAFC Rotterdam</title>
        <meta name="description" content="Get in touch with GAFC Rotterdam community. Join us and be part of something amazing." />
      </Helmet>

      <div className="py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to be part of something amazing? Connect with us and join our growing community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 text-lg">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Rotterdam, Netherlands</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 text-lg">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@gafcrotterdam.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 text-lg">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+31 123 456 789</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="card hover:shadow-lg transition-shadow duration-300 group text-center"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                        {social.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {social.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {social.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Join Us CTA */}
            <div className="space-y-8">
              <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <h2 className="text-2xl font-semibold mb-4">
                  Ready to Join?
                </h2>
                <p className="text-primary-100 mb-6">
                  Join our community and be part of amazing events, meet new people, and create lasting memories.
                </p>
                <div className="space-y-4">
                  <Link
                    to="/events"
                    className="block w-full btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center"
                  >
                    Browse Events
                  </Link>
                  <Link
                    to="/gallery"
                    className="block w-full btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-center"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What We Offer
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">Regular community events and activities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">Networking opportunities with like-minded people</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">Educational workshops and seminars</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">Social gatherings and cultural events</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">Volunteer opportunities and community service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
