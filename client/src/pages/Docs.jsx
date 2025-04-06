import React, { useState } from 'react';

const Docs = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('backend');
  
  // Environment variables
  const backendEnv = `# ===== Backend Environment Variables =====
# Atom HR Integration
ATOM_HR_BASE_URL="https://api.atomhr.com/v1"

# JWT Configuration
JWT_SECRET="your_jwt_signing_secret_here"

# Database Configuration
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/otp_db?retryWrites=true&w=majority"

# Email Service (For OTP)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_app_specific_password"

# Gemini AI Integration
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-pro" # Default model`;

const frontendEnv = `# ===== Frontend Environment Variables =====
# API Configuration
REACT_APP_API_BASE_URL="https://api.yourdomain.com/v1"
VITE_API_KEY="YOUR_VITE_API_KEY"`;

  const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans mt-15 bg-white">
      {/* Header with Aqua Green Theme */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-teal-600 mb-4 flex items-center justify-center">
          <span className="mr-3">🧠</span>
          <span className="border-b-2 border-teal-400 pb-2">FeedX: AI-Powered HR SaaS Platform</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Transforming workforce management for startups and MSMEs with AI-driven HR solutions
        </p>
      </header>

      {/* Introduction with Aqua Green Accents */}
      <section className="mb-12 bg-white rounded-xl shadow-md p-6 border border-teal-100">
        <p className="text-gray-700 mb-4">
          FeedX is an AI-enabled Human Resource (HR) Software as a Service (SaaS) platform, crafted to transform and streamline workforce management.
        </p>
        <p className="text-gray-700 mb-6">
          Our solution empowers HR departments with robust tools to assess, monitor, and improve employee performance efficiently.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
            <h3 className="font-semibold text-teal-800 mb-2">✅ Structured Performance Reviews</h3>
            <p className="text-gray-700">Standardized evaluation processes to assess employee strengths and progress.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
            <h3 className="font-semibold text-teal-800 mb-2">✅ Real-Time 360° Feedback</h3>
            <p className="text-gray-700">Multi-source feedback from peers, managers, and self-evaluations.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
            <h3 className="font-semibold text-teal-800 mb-2">✅ AI-Driven Career Insights</h3>
            <p className="text-gray-700">Personalized development insights aligned with career growth.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
            <h3 className="font-semibold text-teal-800 mb-2">✅ Goal Tracking & Analytics</h3>
            <p className="text-gray-700">SMART goal creation with interactive dashboards.</p>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200 flex items-center">
          <span className="mr-2">🏗️</span>
          System Architecture
        </h2>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Three-Tier Architecture ensures modularity, scalability, and better maintenance.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">Tech Stack</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">Key Features</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">🎨</div>
                        <div>
                          <div className="font-medium text-gray-900">Frontend: React.js, Redux, Chart.js,Tailwind Css</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Dynamic UI, Real-Time Dashboards</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">⚙️</div>
                        <div>
                          <div className="font-medium text-gray-900">Backend: Node.js, Express.js</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">REST APIs, JWT Auth, Rate Limiting</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">🗃️</div>
                        <div>
                          <div className="font-medium text-gray-900">Database: MongoDB (Atlas)</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">Document Storage, Aggregation Pipelines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Core Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200">🔹 Core Components</h2>
        
        <div className="space-y-6">
          {/* Authentication Service */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
                <span className="mr-2">🔐</span>
                Authentication Service
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>JWT-based secure login:</strong> JSON Web Token for authenticated requests.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Role-Based Access Control:</strong> Distinct access levels for different roles.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Session Management:</strong> Optimized handling for concurrent users.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>OTP Verification:</strong> Extra security layer during signup.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Performance Dashboard
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Real-time KPI Tracking:</strong> Monitor ongoing performance metrics.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>AI-Generated Insights:</strong> Analyze patterns to suggest improvements.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Data Visualization:</strong> Interactive graphs and charts.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feedback System */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
                <span className="mr-2">🔄</span>
                Feedback System
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>360° Feedback:</strong> Multi-directional evaluations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Auto-Feedback Triggers:</strong> Set days between automatic feedback requests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Manually-Feedback Triggers:</strong> Send feedback request manually to the person you want to send it to.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Anonymous Feedback:</strong> Honest responses without bias.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Sentiment Analysis:</strong> NLP for qualitative reports.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Goal Management */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Goal Management
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>SMART Goal Setting:</strong> Specific, measurable objectives.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Progress Tracking:</strong> Real-time updates.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span className="text-gray-700"><strong>Approval Workflows:</strong> Maintain quality and alignment.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Alerts & Notifications */}
<div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
  <div className="p-6">
    <h3 className="text-xl font-semibold text-amber-600 mb-4 flex items-center">
      <span className="mr-2">🔔</span>
      Alerts & Notifications
    </h3>
    <ul className="space-y-3">
      <li className="flex items-start">
        <span className="text-amber-500 mr-2">•</span>
        <span className="text-gray-700"><strong>Daily Goal Reminders:</strong> Notifications for assigned goals completion.</span>
      </li>
      <li className="flex items-start">
        <span className="text-amber-500 mr-2">•</span>
        <span className="text-gray-700"><strong>Email Alerts:</strong> Important updates sent directly to your inbox.</span>
      </li>
      <li className="flex items-start">
        <span className="text-amber-500 mr-2">•</span>
        <span className="text-gray-700"><strong>Real-time Updates:</strong> Instant notifications for goal progress.</span>
      </li>
      
      <li className="flex items-start">
        <span className="text-amber-500 mr-2">•</span>
        <span className="text-gray-700"><strong>Escalation Alerts:</strong> Get notified when deadlines approach.</span>
      </li>
    </ul>
  </div>
</div>
        </div>
      </section>

      {/* Integration Approach */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200 flex items-center">
          <span className="mr-2">⚡</span>
          Integration Approach
        </h2>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-teal-100">
          <h3 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
            <span className="mr-2">🛠️</span>
            Integration Strategy with Atom HR
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✅</span>
              <span className="text-gray-700"><strong>OTP Verification</strong> -- Email code for registration.</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✅</span>
              <span className="text-gray-700"><strong>JWT-Based Sessions</strong> -- Stateless session management.</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">✅</span>
              <span className="text-gray-700"><strong>Role-Based Access</strong> -- Respects Atom HR's standards.</span>
            </li>
          </ul>
          
          <h4 className="font-medium text-teal-700 mb-3">🔹 Current Routes (Standalone)</h4>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">API Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">API_BASE_URL/api/auth/signup</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HR initiates account creation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">API_BASE_URL/api/auth/verify-otp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Authenticates credentials</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">API_BASE_URL/api/auth/verify-session</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session verification</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">API_BASE_URL/api/auth/login</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">User authentication</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h4 className="font-medium text-teal-700 mb-3">Integrated Routes (Atom HR)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">API Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">YOUR_API_BASE_URL/api/auth/signup</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HR initiates account creation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">YOUR_API_BASE_URL/api/auth/verify-otp</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Authenticates credentials</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">YOUR_API_BASE_URL/api/auth/verify-session</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session verification</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-600">YOUR_API_BASE_URL/api/auth/login</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">User authentication</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Environment Variables Section */}
        
<div className="bg-white rounded-xl shadow-md p-6 border border-teal-100">
  <h4 className="text-xl font-semibold text-teal-600 mb-4 flex items-center">
    <span className="mr-2">🔒</span>
    Environment Variables Configuration
  </h4>
  
  {/* Tab Navigation */}
  <div className="flex mb-4 border-b border-gray-200">
    <button
      className={`px-4 py-2 font-medium ${activeTab === 'backend' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
      onClick={() => setActiveTab('backend')}
    >
      Backend
    </button>
    <button
      className={`px-4 py-2 font-medium ${activeTab === 'frontend' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
      onClick={() => setActiveTab('frontend')}
    >
      Frontend
    </button>
  </div>
  
  {/* Environment Variables Content */}
  <div className="relative">
    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
      {activeTab === 'backend' ? backendEnv : frontendEnv}
    </pre>
    <button 
      onClick={() => copyToClipboard(activeTab === 'backend' ? backendEnv : frontendEnv)}
      className="absolute top-2 right-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm transition-colors"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  </div>
</div>
      </section>

      {/* Future Enhancements */}
      <section className="mb-12 bg-white rounded-xl shadow-md p-6 border border-teal-100">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200 flex items-center">
          <span className="mr-2">📈</span>
          Future Enhancements
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-700 mb-2">✅ AI Career Paths</h3>
            <p className="text-gray-700">AI-powered career trajectory suggestions.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-700 mb-2">✅ LMS Integration</h3>
            <p className="text-gray-700">Connect learning management systems.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-700 mb-2">✅ Engagement Surveys</h3>
            <p className="text-gray-700">Quarterly employee satisfaction tracking.</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-700 mb-2">✅ Performance Gamification</h3>
            <p className="text-gray-700">Badges and rewards to motivate employees.</p>
          </div>
        </div>
      </section>

      {/* Deployment Strategy */}
      <section className="mb-12 bg-white rounded-xl shadow-md p-6 border border-teal-100">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200 flex items-center">
          <span className="mr-2">🚀</span>
          Deployment Strategy
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            <span className="text-gray-700"><strong>Frontend</strong> --Netlify for frontend deployment</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            <span className="text-gray-700"><strong>Backend</strong> -- Render for backend deployment</span>
          </li>
          <li className="flex items-start">
            <span className="text-teal-500 mr-2">•</span>
            <span className="text-gray-700"><strong>Database</strong> -- MongoDB Atlas</span>
          </li>
        </ul>
      </section>

      {/* Why Choose Our Module */}
      <section className="mb-12 bg-teal-50 rounded-xl p-6 border border-teal-200">
        <h2 className="text-2xl font-bold text-teal-700 mb-6 pb-2 border-b border-teal-300 flex items-center">
          <span className="mr-2">🎯</span>
          Why Choose Our Module?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
            <h3 className="font-semibold text-teal-700 mb-2 flex items-center">
              <span className="mr-2">🔹</span>
              Seamless Interface
            </h3>
            <p className="text-gray-700">Intuitive UI synced with Atom HR.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
            <h3 className="font-semibold text-teal-700 mb-2 flex items-center">
              <span className="mr-2">🔹</span>
              AI Decision Making
            </h3>
            <p className="text-gray-700">Real-time data for better decisions.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
            <h3 className="font-semibold text-teal-700 mb-2 flex items-center">
              <span className="mr-2">🔹</span>
              Scalable Architecture
            </h3>
            <p className="text-gray-700">Supports thousands of users securely.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100">
            <h3 className="font-semibold text-teal-700 mb-2 flex items-center">
              <span className="mr-2">🔹</span>
              Custom Dashboards
            </h3>
            <p className="text-gray-700">Views that adapt to workflows.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-teal-100 md:col-span-2">
            <h3 className="font-semibold text-teal-700 mb-2 flex items-center">
              <span className="mr-2">🔹</span>
              Fully Integrated
            </h3>
            <p className="text-gray-700">Works effortlessly within Atom HR.</p>
          </div>
        </div>
      </section>

      {/* Authors & Team Info */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-teal-100">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 pb-2 border-b border-teal-200 flex items-center">
          <span className="mr-2">👨‍💻</span>
          Authors & Team Info
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2">Team Information</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="font-medium text-teal-700 w-32">Team Name:</span>
                <span className="text-gray-600">Mark II</span>
              </li>
              <li className="flex">
                <span className="font-medium text-teal-700 w-32">Hackathon:</span>
                <span className="text-gray-600">IIT Dhanbad Hackfest 2025</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2">👥 Team Members:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                <span className="font-medium text-gray-700">Hari Om</span>
                
              </li>
              <li className="flex items-center">
                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                <span className="font-medium text-gray-700">Sakshi Kumari</span>
              </li>
              <li className="flex items-center">
                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                <span className="font-medium text-gray-700">Rajnish Kumar</span>
              </li>
              <li className="flex items-center">
                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">4</span>
                <span className="font-medium text-gray-700">Rohit Kumar</span>
              </li>
              <li className="flex items-center">
                <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">5</span>
                <span className="font-medium text-gray-700">Prince Kumar</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;