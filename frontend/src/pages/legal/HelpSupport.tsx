import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Divider, Button, TextInput, Textarea } from '@tremor/react';
import { Link } from 'react-router-dom';
import NotyfService from '../../services/NotyfService';
import { contactFormService, ContactFormData } from '../../services/ContactFormService';
import SnakeGameModal from '../../components/easter-eggs/SnakeGameModal';

const HelpSupport = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSnakeGameOpen, setIsSnakeGameOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      NotyfService.showError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      NotyfService.showError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit the form to the backend
      const success = await contactFormService.submitContactForm(contactForm);
      
      if (success) {
        NotyfService.showSuccess('Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.');
        setFormSubmitted(true);
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler für Easter Egg
  const handleOpenSnakeGame = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsSnakeGameOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <div className="space-y-6">
        <Title className="text-2xl mb-6">Hilfe & Support</Title>
          <Text>Wir sind für Sie da. Finden Sie Antworten auf häufig gestellte Fragen oder kontaktieren Sie uns direkt.</Text>
          
          <section>
            <h2 id="haeufigGestellteFragen" className="text-xl font-semibold text-gray-900 mb-4">Häufig gestellte Fragen</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-blue-600">Wie kann ich ein Konto erstellen?</h3>
                <Text className="mt-2">
                  Klicken Sie auf "Registrieren" in der oberen rechten Ecke der Startseite. Geben Sie Ihren Benutzernamen, ein sicheres Passwort und beantworten Sie die Sicherheitsfrage. Nachdem Sie sich registriert haben, können Sie sich anmelden und mit dem Erstellen von Inhalten beginnen.
                </Text>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-blue-600">Wie lade ich Bilder hoch?</h3>
                <Text className="mt-2">
                  Gehen Sie zu "Galerie" im Navigationsmenü und klicken Sie auf "+ Neues Item". Füllen Sie die erforderlichen Felder aus und wählen Sie die Bilddatei aus, die Sie hochladen möchten. Klicken Sie anschließend auf "Liste erstellen", um den Upload abzuschließen.
                </Text>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-blue-600">Wie erstelle ich einen Erinnerungsraum?</h3>
                <Text className="mt-2">
                  Gehen Sie zu "Listen" im Navigationsmenü und klicken Sie auf "+ Neuer Raum". Geben Sie einen Titel und eine Beschreibung ein und wählen Sie die Elemente aus, die Sie in diesen Raum aufnehmen möchten. Klicken Sie dann auf "Liste erstellen", um Ihren Erinnerungsraum zu erstellen.
                </Text>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-blue-600">Kann ich mein Passwort zurücksetzen?</h3>
                <Text className="mt-2">
                  Ja, klicken Sie auf der Anmeldeseite auf "Passwort vergessen?". Sie werden aufgefordert, Ihren Benutzernamen einzugeben und Ihre Sicherheitsfrage zu beantworten. Danach können Sie ein neues Passwort festlegen.
                </Text>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="font-medium text-blue-600">Wie kann ich mein Konto löschen?</h3>
                <Text className="mt-2">
                  Gehen Sie zu Ihrem Profil, indem Sie auf Ihren Benutzernamen in der oberen rechten Ecke klicken und dann "Profil" auswählen. Scrollen Sie nach unten zum Abschnitt "Kontoeinstellungen" und klicken Sie auf "Konto löschen". Sie werden aufgefordert, Ihre Entscheidung zu bestätigen, bevor Ihr Konto gelöscht wird.
                </Text>
              </div>
            </div>
          </section>
          
          <Divider />
          
          <section id="contact">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontaktieren Sie uns</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Text>
                  Haben Sie Fragen oder benötigen Sie Hilfe? Zögern Sie nicht, uns zu kontaktieren. Unser Support-Team steht Ihnen von Montag bis Freitag zwischen 9:00 und 17:00 Uhr zur Verfügung.
                </Text>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Text>support@online-museum.de</Text>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <Text>+49 123 456789</Text>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Text>Musterstraße 123, 12345 Musterstadt</Text>
                  </div>
                </div>
              </div>
              
              <div>
                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Vielen Dank für Ihre Nachricht!</h3>
                    <Text>Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</Text>
                    <Button 
                      className="mt-4" 
                      color="blue"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Neue Nachricht senden
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <TextInput
                        id="name"
                        name="name"
                        placeholder="Ihr Name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ihre@email.de"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Betreff</label>
                      <TextInput
                        id="subject"
                        name="subject"
                        placeholder="Betreff Ihrer Nachricht"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Ihre Nachricht an uns..."
                        value={contactForm.message}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      color="blue"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </section>
          
          <Divider />
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Downloads und Ressourcen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <svg className="w-8 h-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="font-medium mb-1">Benutzerhandbuch</h3>
                <Text className="text-sm text-gray-500 mb-3">Umfassendes Handbuch für alle Funktionen.</Text>
                <button
                  onClick={handleOpenSnakeGame} 
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  PDF herunterladen
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <svg className="w-8 h-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="font-medium mb-1">Tipps & Tricks</h3>
                <Text className="text-sm text-gray-500 mb-3">Nützliche Hinweise für neue Benutzer.</Text>
                <a href="#haeufigGestellteFragen" className="text-blue-600 text-sm font-medium hover:underline">Artikel lesen</a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <svg className="w-8 h-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-medium mb-1">Roadmap</h3>
                <Text className="text-sm text-gray-500 mb-3">Erfahren Sie mehr über geplante Funktionen.</Text>
                <Link to="/roadmap" className="text-blue-600 text-sm font-medium hover:underline">Roadmap ansehen</Link>
              </div>
            </div>
          </section>
        </div>
      </Card>
      
      {/* Snake Game Easter Egg Modal */}
      <SnakeGameModal
        isOpen={isSnakeGameOpen}
        onClose={() => setIsSnakeGameOpen(false)}
      />
    </div>
  );
};

export default HelpSupport;