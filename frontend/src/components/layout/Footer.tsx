import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Footer = () => {

  const footerLinks = [
    {
      title: 'Rechtliches',
      icon: ShieldCheckIcon,
      links: [
        { name: 'Datenschutz', href: '/privacy' },
        { name: 'Nutzungsbedingungen', href: '/termsofuse' },
        { name: 'Impressum', href: '/impressum' },
      ]
    },
    {
      title: 'Support',
      icon: QuestionMarkCircleIcon,
      links: [
        { name: 'Hilfe & Support', href: '/helpsupport' },
        { name: 'Roadmap', href: '/roadmap' },
      ]
    },
    {
      title: 'Plattform',
      icon: GlobeAltIcon,
      links: [
        { name: 'Über uns', href: '/impressum' },
        { name: 'Features', href: '/roadmap' },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Online-Museum
                </div>
                <div className="text-xs text-gray-500">
                  Digitale Erinnerungsräume
                </div>
              </div>
            </Link>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Erstellen Sie persönliche digitale Sammlungen und teilen Sie Ihre Erinnerungen 
              in einer modernen, interaktiven Plattform.
            </p>
            
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <HeartIcon className="w-4 h-4 mx-1 text-red-500" />
              <span>in Deutschland</span>
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <div className="flex items-center space-x-2 mb-4">
                <section.icon className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;