import { Card, Title, Text } from '@tremor/react';

const Roadmap = () => {

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Online-Museum Roadmap 2025-2026</Title>
        
        {/* Introductory text about the roadmap */}
        <Text className="mb-6">
          Das Online-Museum hat sich zu einer umfassenden digitalen Plattform für kulturelle und kreative Inhalte entwickelt. Diese aktualisierte Roadmap zeigt unsere bereits umgesetzten Erfolge und geplanten Entwicklungen für die kommenden 12-18 Monate.
        </Text>
        
        <div className="space-y-6">
          
          {/* Q2 2025: Successfully implemented */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-semibold mr-3">Q2 2025</div>
              <Text className="text-green-600 italic font-medium">✅ Erfolgreich umgesetzt</Text>
            </div>
            
            {/* Extended search functions */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🔍</span>
                <h3 className="text-lg font-semibold">Erweiterte Suchfunktionen [ERLEDIGT]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>✅ Implementierung einer Volltextsuche für alle Inhalte</li>
                <li>✅ Filter nach mehreren Kriterien (Datum, Kategorie, Benutzer)</li>
                <li>✅ Kategoriebasierte Navigation und Filterung</li>
              </ul>
            </div>
            
            {/* Data management improvements */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">💾</span>
                <h3 className="text-lg font-semibold">Verbesserungen der Datenverwaltung [ERLEDIGT]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>✅ Unterstützung für Bildformate (JPG, PNG, GIF)</li>
                <li>✅ Benutzerfreundlicher Upload-Prozess mit Vorschau</li>
                <li>✅ Batch-Verwaltung von Items in Listen</li>
              </ul>
            </div>
            
            {/* Security enhancements */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🔐</span>
                <h3 className="text-lg font-semibold">Sicherheitsverbesserungen [ERLEDIGT]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>✅ JWT-basierte Authentifizierung</li>
                <li>✅ Sicherheitsfragen für Passwort-Reset</li>
                <li>✅ Admin-Panel mit Benutzerrechteverwaltung</li>
              </ul>
            </div>

            {/* AI-powered features */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🤖</span>
                <h3 className="text-lg font-semibold">KI-gestützte Funktionen [ERLEDIGT]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>✅ KI-Beschreibungsgenerierung für Items und Listen</li>
                <li>✅ Integration mit Mistral AI API</li>
                <li>✅ Intelligente Content-Vorschläge</li>
              </ul>
            </div>

            {/* Admin dashboard */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">📊</span>
                <h3 className="text-lg font-semibold">Admin-Dashboard und Management [ERLEDIGT]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>✅ Umfassendes Admin-Panel</li>
                <li>✅ Benutzerverwaltung und Rechtezuweisung</li>
                <li>✅ Support-Anfragen-Verwaltung</li>
                <li>✅ Redaktionelle Listen-Verwaltung</li>
              </ul>
            </div>
          </div>
          
          {/* Q3 2025: In development */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q3 2025</div>
              <Text className="text-blue-600 italic font-medium">🚀 In Entwicklung</Text>
            </div>
            
            {/* Enhanced social features */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🌐</span>
                <h3 className="text-lg font-semibold">Erweiterte Soziale Funktionen</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Kommentarfunktion für Items und Listen</li>
                <li>"Gefällt mir"-Funktion für Inhalte</li>
                <li>Öffentliche Benutzerprofile mit anpassbaren Datenschutzeinstellungen</li>
                <li>Follower-System zwischen Benutzern</li>
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
                <li>Verbesserte mobile Ansicht und PWA-Unterstützung</li>
                <li>Animationen und Micro-Interactions</li>
              </ul>
            </div>
            
            {/* Advanced statistics */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">📊</span>
                <h3 className="text-lg font-semibold">Erweiterte Statistiken und Analytics</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Detaillierte Nutzungsanalysen für Administratoren</li>
                <li>Persönliche Aktivitätsstatistiken für Benutzer</li>
                <li>Visualisierung von Trends und beliebten Inhalten</li>
                <li>Export-Funktionen für Daten</li>
              </ul>
            </div>

            {/* Extended admin functions */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🗑️</span>
                <h3 className="text-lg font-semibold">Erweiterte Verwaltungsfunktionen [NEU]</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li><strong>Benutzer-Löschfunktion über Admin-Interface</strong></li>
                <li><strong>Support-Anfragen-Löschung über Oberfläche</strong></li>
                <li>Bulk-Aktionen für Admin-Operationen</li>
                <li>Erweiterte Moderationstools</li>
              </ul>
            </div>
          </div>
          
          {/* Q4 2025: Planned features */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q4 2025</div>
              <Text className="text-blue-600 italic font-medium">📱 Geplante Features</Text>
            </div>
            
            {/* API and integrations */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🔄</span>
                <h3 className="text-lg font-semibold">API und Integrationen</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Öffentliche REST API für Entwickler (Beta)</li>
                <li>Integration mit gängigen sozialen Medien</li>
                <li>Anbindung an externe Datenquellen für kulturelle Referenzen</li>
                <li>Webhook-System für externe Anwendungen</li>
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
                <li>Mehrwährungsunterstützung</li>
                <li>RTL-Sprachen-Support</li>
              </ul>
            </div>
            
            {/* Performance optimizations */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚡</span>
                <h3 className="text-lg font-semibold">Performance-Optimierungen</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Code-Splitting und Lazy Loading</li>
                <li>CDN-Integration für Bilder</li>
                <li>Caching-Strategien implementieren</li>
                <li>Bundle-Size Optimierung</li>
              </ul>
            </div>

            {/* Extended content features */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🎯</span>
                <h3 className="text-lg font-semibold">Erweiterte Content-Features</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Video-Upload und -Streaming</li>
                <li>Audio-Guides für Listen</li>
                <li>360°-Bildunterstützung</li>
                <li>QR-Code-Generator für Items/Listen</li>
              </ul>
            </div>
          </div>
          
          {/* Q1-Q2 2026: Future vision */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Q1-Q2 2026</div>
              <Text className="text-blue-600 italic font-medium">🌟 Zukunftsvision</Text>
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
                <li>Augmented Reality für mobile Geräte</li>
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
                <li>WebXR-Integration für immersive Erlebnisse</li>
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
                <li>White-Label-Lösungen für Institutionen</li>
              </ul>
            </div>

            {/* Extended AI features */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🤖</span>
                <h3 className="text-lg font-semibold">Erweiterte KI-Features</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Automatische Kategorisierung von hochgeladenen Inhalten</li>
                <li>KI-gestützte Empfehlungen basierend auf Benutzerinteressen</li>
                <li>Bilderkennung und Metadaten-Extraktion</li>
                <li>Chatbot für Benutzerunterstützung</li>
              </ul>
            </div>
          </div>
          
          {/* Long-term vision: 2026+ */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold mr-3">Langfristige Vision (2026+)</div>
              <Text className="text-blue-600 italic font-medium">🔮 Zukunftsperspektiven</Text>
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
                <li>Smart Contracts für Content-Lizenzierung</li>
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
                <li>Haptisches Feedback für immersive Interaktionen</li>
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
                <li>Plugin-System für Drittanbieter-Erweiterungen</li>
              </ul>
            </div>

            {/* Global networking */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🌐</span>
                <h3 className="text-lg font-semibold">Globale Vernetzung</h3>
              </div>
              <ul className="list-disc ml-10 mt-2 text-gray-700 space-y-1">
                <li>Museumspartnerschaftsprogramm</li>
                <li>Internationale Content-Austauschplattform</li>
                <li>Mehrsprachige KI-Übersetzungen in Echtzeit</li>
                <li>Kultureller Austausch und Kooperationsprojekte</li>
              </ul>
            </div>
          </div>
          
          {/* Feedback section */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">💬 Feedback und Community</h3>
            <Text className="mb-4">
              Wir freuen uns über Ihre Ideen und Vorschläge zu unserer Roadmap! Nutzen Sie das Kontaktformular auf unserer Hilfe & Support-Seite, um uns Ihr Feedback mitzuteilen.
            </Text>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text className="font-medium mb-2">Besonders interessiert sind wir an:</Text>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>Benutzerfreundlichkeits-Feedback</li>
                <li>Feature-Wünsche aus der Community</li>
                <li>Technische Verbesserungsvorschläge</li>
                <li>Partnerschaften mit Museen und Kultureinrichtungen</li>
              </ul>
            </div>
          </div>
          
          {/* Footer with last update info */}
          <Text className="text-sm text-gray-500 mt-6">
            Stand: 19.06.2025 |
            Letzte Aktualisierung: 19.06.2025
          </Text>
          <p className="mt-1 text-sm italic text-gray-500">
            Hinweis: Diese Roadmap stellt unsere aktuellen Pläne dar und kann sich basierend auf Nutzerfeedback, technologischen Entwicklungen und Ressourcenverfügbarkeit ändern. Bereits umgesetzte Features sind mit ✅ markiert.
          </p>
          
        </div>
      </Card>
    </div>
  );
};

export default Roadmap;