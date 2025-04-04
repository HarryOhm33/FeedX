import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-20 px-6 lg:px-32 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 animate__animated animate__fadeInUp animate__duration-1000">
        <div>
          <h2 className="text-3xl font-bold mb-6">About FeedX</h2>
          <p className="text-sm leading-relaxed mb-4">
            FeedX is an innovative feedback management platform aimed at
            streamlining communication, enhancing teamwork, fostering leadership
            skills, and promoting continuous improvement.
          </p>
          <p className="text-sm leading-relaxed">
            Our goal is to simplify feedback processes for organizations,
            enhancing productivity and collaboration through insightful data
            analysis.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
          <ul className="space-y-4">
            <li>
              <a
                href="#home"
                className="hover:text-yellow-300 transition-all duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#blog"
                className="hover:text-yellow-300 transition-all duration-300"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#feedback"
                className="hover:text-yellow-300 transition-all duration-300"
              >
                Feedback System
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-yellow-300 transition-all duration-300"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#careers"
                className="hover:text-yellow-300 transition-all duration-300"
              >
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-sm mb-4">
            Have questions, suggestions, or business inquiries? Reach out to us
            through any of the channels below:
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <Mail className="w-6 h-6 text-red-500" />
            <a
              href="mailto:support@feedx.com"
              className="hover:text-yellow-300 transition-all duration-300"
            >
              support@feedx.com
            </a>
          </div>
          <div className="mt-6 text-sm leading-relaxed">
            Address: 123 FeedX Lane, Innovation City, IN 400056
            <br />
            Phone: +91 98765 43210
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Follow Us</h2>
          <div className="flex space-x-6 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-8 h-8 text-blue-600 hover:text-blue-700 transition-all duration-300" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-8 h-8 text-pink-500 hover:text-pink-600 transition-all duration-300" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-8 h-8 text-sky-400 hover:text-sky-500 transition-all duration-300" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-8 h-8 text-blue-800 hover:text-blue-900 transition-all duration-300" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-8 h-8 text-gray-300 hover:text-gray-400 transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-200 pt-8 text-center text-sm text-white/80 flex flex-col md:flex-row justify-between items-center">
        <div>© 2025 FeedX. All rights reserved.</div>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <a
            href="#privacy"
            className="hover:text-yellow-300 transition-all duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="hover:text-yellow-300 transition-all duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#faq"
            className="hover:text-yellow-300 transition-all duration-300"
          >
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
