import { useState } from 'react';

const AIToolsNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const aiTools = [
    {
      name: 'Prompt Elevate',
      description: 'AI Prompt Enhancement',
      url: '/',
      icon: '🧠',
      isActive: true
    },
    {
      name: 'InnovaChat',
      description: 'Advanced AI Conversations',
      url: 'https://innovachat.vercel.app/',
      icon: '🤖',
      isActive: false
    },
    {
      name: 'AI Tools Galaxy',
      description: 'Complete AI Toolkit',
      url: 'https://aitoolsgalaxy.vercel.app/',
      icon: '🛠️',
      isActive: false
    }
  ];

  return (
    <div className="relative">
      {/* AI Tools Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full hover:bg-white/20 transition-all duration-300"
      >
        <span className="text-base sm:text-lg">🚀</span>
        <span className="hidden sm:block font-medium text-sm">AI Tools</span>
        <svg 
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4">
              <h3 className="font-bold text-base sm:text-lg">AI Tools Ecosystem</h3>
              <p className="text-purple-100 text-xs sm:text-sm">Explore our integrated AI platforms</p>
            </div>

            {/* Tools List */}
            <div className="py-2">
              {aiTools.map((tool, index) => (
                <a
                  key={index}
                  href={tool.url}
                  target={tool.isActive ? '_self' : '_blank'}
                  rel={tool.isActive ? '' : 'noopener noreferrer'}
                  className={`block px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors ${
                    tool.isActive ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-semibold text-sm sm:text-base truncate ${tool.isActive ? 'text-purple-700' : 'text-gray-800'}`}>
                          {tool.name}
                        </h4>
                        {tool.isActive && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            Current
                          </span>
                        )}
                        {!tool.isActive && (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{tool.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Seamlessly switch between AI tools to enhance your workflow
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIToolsNavigation;
