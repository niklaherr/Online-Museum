import { Card, Title, Text } from '@tremor/react';

const Impressum = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Impressum</Title>
        <div className="space-y-6">

          {/* Provider information section */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Anbieterinformationen</h2>
            <Text className="mb-2 font-medium">Universitätsprojekt - Online Museum</Text>
            <Text className="mb-2">Studierende der Dualen Hochschule Schleswig-Holstein</Text>
            <Text>Wirtschaftsakademie Schleswig-Holstein GmbH (Gesellschaft mit beschränkter Haftung)</Text>
            <Text>Hans-Detlev-Prien-Str. 10</Text>
            <Text>24106 Kiel</Text>
            <Text>Deutschland</Text>
          </div>

          {/* Contact details section */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Kontakt</h2>
            <Text className="mb-2">E-Mail: niklas.herrmann@std.dhsh.de</Text>
            <Text>Website: www.museum-frontend-production.up.railway.app</Text>
          </div>

          {/* Project team members section */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Projektverantwortliche</h2>
            <Text className="mb-2">Niklas Herrmann (Projektleitung/Entwicklung)</Text>
            <Text className="mb-2">Hendrik Steen (Projektleitung/Entwicklung)</Text>
            <Text>Malte Beissel (Entwicklung)</Text>
            <Text className="mt-2 text-sm text-gray-600">
              Studierende im Studiengang Wirtschaftsinformatik an der DHSH
            </Text>
          </div>

          {/* Academic context of the project */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Akademischer Kontext</h2>
            <Text className="mb-2">Betreuende Hochschule: DHSH</Text>
            <Text className="mb-2">Fachbereich: Webtechnologien</Text>
            <Text className="mb-2">Art des Projekts: Klausurersatzleistung / Studienprojekt</Text>
            <Text className="mb-2">Semester: 4. Fachsemester</Text>
            <Text>Betreuende Dozent:in: Prof. Dr. Sven Niemand</Text>
          </div>

          {/* Purpose of the application */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Zweck der Anwendung</h2>
            <Text className="mb-2">
              Diese Webanwendung wurde im Rahmen eines Studienprojekts entwickelt und dient 
              ausschließlich Lehr- und Lernzwecken an der DHSH.
            </Text>
            <Text className="mb-2">
              Das Projekt ist eine Klausurersatzleistung und hat keinen kommerziellen Hintergrund.
            </Text>
            <Text>
              Die Anwendung demonstriert die praktische Umsetzung von Webentwicklungskonzepten 
              und Datenbankmanagement.
            </Text>
          </div>

          {/* Disclaimer for liability */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Haftungsausschluss</h2>
            <Text className="mb-2">
              Diese Anwendung wurde zu Bildungszwecken erstellt. Wir übernehmen keine Gewähr 
              für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Inhalte.
            </Text>
            <Text className="mb-2">
              Die Nutzung erfolgt auf eigene Verantwortung. Eine kommerzielle Nutzung ist 
              nicht vorgesehen.
            </Text>
            <Text>
              Hochgeladene Inhalte dienen ausschließlich Demonstrationszwecken und spiegeln 
              nicht zwangsläufig die Meinung der Entwickler oder der Hochschule wider.
            </Text>
          </div>

          {/* Data protection notice */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Datenschutz</h2>
            <Text>
              Informationen zum Umgang mit personenbezogenen Daten finden Sie in unserer 
              Datenschutzerklärung. Diese Anwendung verarbeitet Daten ausschließlich im Rahmen 
              des Studienprojekts und zu Lernzwecken.
            </Text>
          </div>

          {/* Hosting provider information */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Hosting</h2>
            <Text className="mb-2">Diese Anwendung wird gehostet über:</Text>
            <Text className="mb-2">Railway Corp.</Text>
            <Text className="mb-2">Cloud-Hosting-Service</Text>
            <Text>
              Der Hosting-Dienst dient ausschließlich der technischen Bereitstellung 
              der Lehr-/Lernanwendung.
            </Text>
          </div>

          {/* Footer with current date and last update */}
          <Text className="text-sm text-gray-500 mt-6">
            Stand: {new Date().toLocaleDateString('de-DE')} | 
            Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Impressum;