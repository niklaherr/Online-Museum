const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              {new Date().getFullYear()} Heritage Story
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a className="text-sm text-gray-600 hover:text-blue-600" href="#">Datenschutz</a>
            <a className="text-sm text-gray-600 hover:text-blue-600" href="#">Nutzungsbedingungen</a>
            <a className="text-sm text-gray-600 hover:text-blue-600" href="#">Hilfe & Support</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;