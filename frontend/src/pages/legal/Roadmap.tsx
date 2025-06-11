import { Card, Title, Text, Divider } from '@tremor/react';

const Roadmap = () => {

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Online-Museum Roadmap 2025-2026</Title>
        
        {/* Introductory text about the roadmap */}
        <Text className="mb-6">
          Das Online-Museum strebt danach, eine umfassende digitale Plattform für kulturelle und kreative Inhalte zu sein. 
          Diese Roadmap zeigt unsere geplanten Entwicklungen für die kommenden 12-18 Monate. 
          Wir freuen uns auf Ihr Feedback zu diesen Plänen!
        </Text>
        
        <Divider />
        
        {/* Q2 2025: Current phase features */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q2 2025</div>
            <Text className="text-gray-500 italic">Aktuelle Phase</Text>
          </div>
          
          {/* Advanced search features */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🔍</span>
              <h3 className="text-lg font-semibold">Erweiterte Suchfunktionen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Implementierung einer Volltextsuche für alle Inhalte</li>
              <li>Filter nach mehreren Kriterien (Datum, Kategorie, Benutzer)</li>
              <li>Speicherbare Suchfilter für registrierte Benutzer</li>
            </ul>
          </div>
          
          {/* Data management improvements */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">💾</span>
              <h3 className="text-lg font-semibold">Verbesserungen der Datenverwaltung</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Erhöhung der maximalen Bildgröße auf 10MB</li>
              <li>Unterstützung für zusätzliche Dateiformate (GIF, SVG)</li>
              <li>Batch-Upload für mehrere Items gleichzeitig</li>
            </ul>
          </div>
          
          {/* Security enhancements */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🔐</span>
              <h3 className="text-lg font-semibold">Sicherheitsverbesserungen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Zwei-Faktor-Authentifizierung für Konten</li>
              <li>Verbesserter Schutz vor Cross-Site-Scripting (XSS)</li>
              <li>Erweiterte Passwortrichtlinien und -validierung</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        {/* Q3 2025: Social, UI/UX, and statistics features */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q3 2025</div>
          </div>
          
          {/* Social features */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🌐</span>
              <h3 className="text-lg font-semibold">Soziale Funktionen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Kommentarfunktion für Items und Listen</li>
              <li>"Gefällt mir"-Funktion für Inhalte</li>
              <li>Öffentliche Benutzerprofile mit anpassbaren Datenschutzeinstellungen</li>
            </ul>
          </div>
          
          {/* UI/UX improvements */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎨</span>
              <h3 className="text-lg font-semibold">UI/UX Verbesserungen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Überarbeitetes Dashboard mit personalisierten Widgets</li>
              <li>Dunkler Modus für die gesamte Plattform</li>
              <li>Verbesserte mobile Ansicht und Responsivität</li>
            </ul>
          </div>
          
          {/* Advanced statistics */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">📊</span>
              <h3 className="text-lg font-semibold">Erweiterte Statistiken</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Detaillierte Nutzungsanalysen für Administratoren</li>
              <li>Persönliche Aktivitätsstatistiken für Benutzer</li>
              <li>Visualisierung von Trends und beliebten Inhalten</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        {/* Q4 2025: API, integrations, internationalization, AI features */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q4 2025</div>
          </div>
          
          {/* API and integrations */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🔄</span>
              <h3 className="text-lg font-semibold">API und Integrationen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Öffentliche API für Entwickler (Beta)</li>
              <li>Integration mit gängigen sozialen Medien</li>
              <li>Anbindung an externe Datenquellen für kulturelle Referenzen</li>
            </ul>
          </div>
          
          {/* Internationalization */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🌍</span>
              <h3 className="text-lg font-semibold">Internationalisierung</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Mehrsprachige Benutzeroberfläche (Englisch, Französisch, Spanisch)</li>
              <li>Lokalisierte Inhalte und regionale Empfehlungen</li>
              <li>Internationale Zahlungsmöglichkeiten für Premium-Funktionen</li>
            </ul>
          </div>
          
          {/* AI-powered features */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🤖</span>
              <h3 className="text-lg font-semibold">KI-gestützte Funktionen (Beta)</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Verbesserte KI-Beschreibungsgenerierung</li>
              <li>Automatische Kategorisierung von hochgeladenen Inhalten</li>
              <li>KI-gestützte Empfehlungen basierend auf Benutzerinteressen</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        {/* Q1-Q2 2026: Mobile apps, virtual exhibitions, premium features */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q1-Q2 2026</div>
          </div>
          
          {/* Native mobile apps */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">📱</span>
              <h3 className="text-lg font-semibold">Native Mobile Apps</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>iOS und Android Apps mit Offline-Funktionalität</li>
              <li>Push-Benachrichtigungen für wichtige Aktivitäten</li>
              <li>Mobile-spezifische Features (Kamera-Integration, GPS-Tagging)</li>
            </ul>
          </div>
          
          {/* Virtual exhibitions */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🎭</span>
              <h3 className="text-lg font-semibold">Virtuelle Ausstellungen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>3D-Galerieansicht für Sammlungen</li>
              <li>Virtuelle Rundgänge durch kuratierte Ausstellungen</li>
              <li>Möglichkeit, eigene virtuelle Räume zu gestalten</li>
            </ul>
          </div>
          
          {/* Premium features */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">💫</span>
              <h3 className="text-lg font-semibold">Premium-Funktionen</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Erweiterte Speicherkapazität für zahlende Mitglieder</li>
              <li>Exklusive Designvorlagen und Anpassungsoptionen</li>
              <li>Priorisierter Support und früher Zugang zu neuen Features</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        {/* Long-term vision: 2026+ */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Langfristige Vision (2026+)</div>
          </div>
          
          {/* Blockchain integration */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🔗</span>
              <h3 className="text-lg font-semibold">Blockchain-Integration</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>NFT-Unterstützung für digitale Originalwerke</li>
              <li>Verifizierte Urheberschaft und Provenienz</li>
              <li>Dezentralisierte Speicheroptionen für dauerhafte Archivierung</li>
            </ul>
          </div>
          
          {/* AR/VR experiences */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🥽</span>
              <h3 className="text-lg font-semibold">AR/VR-Erlebnisse</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Augmented Reality-Ansicht von Objekten im eigenen Raum</li>
              <li>VR-kompatible Ausstellungen und Sammlungen</li>
              <li>Kollaborative virtuelle Räume für gemeinsame Erlebnisse</li>
            </ul>
          </div>
          
          {/* Community-driven development */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🌱</span>
              <h3 className="text-lg font-semibold">Community-gesteuerte Entwicklung</h3>
            </div>
            <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
              <li>Open-Source-Komponenten für Community-Beiträge</li>
              <li>Benutzervoting für Prioritäten bei neuen Features</li>
              <li>Community-kuratierte Inhalte und Ausstellungen</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        {/* Feedback section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Feedback</h3>
          <Text>
            Wir freuen uns über Ihre Ideen und Vorschläge zu unserer Roadmap! Nutzen Sie das Kontaktformular auf unserer Hilfe & Support-Seite, um uns Ihr Feedback mitzuteilen.
          </Text>
        </div>
        
        {/* Footer with last update info */}
        <div className="text-sm text-gray-500 mt-8">
          <Text className="text-sm text-gray-500 mt-6">
            Stand: {new Date().toLocaleDateString('de-DE')} | 
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
          </Text>
          <p className="mt-1 italic">
            Hinweis: Diese Roadmap stellt unsere aktuellen Pläne dar und kann sich basierend auf Nutzerfeedback, technologischen Entwicklungen und Ressourcenverfügbarkeit ändern.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Roadmap;