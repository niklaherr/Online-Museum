import { Card, Title, Text } from '@tremor/react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Datenschutzerklärung</Title>
        <div className="space-y-6">

          {/* Section 1 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Einleitung und Übersicht</h2>
            <Text className="mb-2">
              Der Schutz Ihrer persönlichen Daten ist uns wichtig. In dieser Datenschutzerklärung erfahren Sie,
              welche Daten wir erfassen, wie wir sie verwenden und welche Rechte Sie haben.
            </Text>
            <Text className="mb-2">
              Die Grundlage dafür bildet die Datenschutz-Grundverordnung (EU) 2016/679 (DSGVO) sowie geltendes nationales Recht.
            </Text>
            <Text>Alle Formulierungen gelten geschlechtsneutral.</Text>
          </div>

          {/* Section 2 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Anwendungsbereich</h2>
            <Text className="mb-2">
              Diese Datenschutzerklärung gilt für alle personenbezogenen Daten, die wir innerhalb unseres Unternehmens verarbeiten.
              Dazu gehören auch Daten, die durch beauftragte Dienstleister in unserem Auftrag verarbeitet werden.
            </Text>
            <Text>
              Personenbezogene Daten sind Informationen wie Ihr Name, Ihre E-Mail-Adresse oder Ihr Nutzerverhalten.
            </Text>
          </div>

          {/* Section 3 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Rechtsgrundlagen</h2>
            <Text className="mb-2">Die Verarbeitung Ihrer Daten erfolgt auf Basis folgender Rechtsgrundlagen:</Text>
            <Text className="mb-2">
              <span className="font-medium">Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</span> Sie haben uns Ihre Zustimmung zur Verarbeitung gegeben.
            </Text>
            <Text className="mb-2">
              <span className="font-medium">Vertrag (Art. 6 Abs. 1 lit. b DSGVO):</span> Die Verarbeitung ist zur Vertragserfüllung oder vorvertraglicher Maßnahmen erforderlich.
            </Text>
            <Text>
              <span className="font-medium">Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO):</span> Wir haben ein berechtigtes Interesse an der Verarbeitung, das Ihre Interessen nicht überwiegt.
            </Text>
          </div>

          {/* Section 4 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Welche Daten wir erheben und wie lange sie gespeichert werden</h2>
            <Text className="mb-2">
              <span className="font-medium">Erhobene Daten:</span> Wir erfassen unter anderem folgende personenbezogene Daten:
            </Text>
            <ul className="list-disc pl-6 mb-4 text-sm text-gray-700">
              <li>Benutzernamen</li>
              <li>Anmeldeinformationen (verschlüsselte Passwörter)</li>
              <li>Sicherheitsfragen und -antworten</li>
              <li>Informationen zu erstellten Inhalten (z. B. Listen, Einträge)</li>
              <li>Nutzungsdaten wie Zugriffszeiten und Häufigkeit</li>
            </ul>
            <Text>
              <span className="font-medium">Speicherdauer:</span> Ihre Daten werden nur so lange gespeichert, wie es für die
              Bereitstellung unserer Dienste notwendig oder gesetzlich vorgeschrieben ist. Anschließend werden sie gelöscht oder anonymisiert.
            </Text>
          </div>

          {/* Section 5 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Ihre Rechte</h2>
            <Text className="mb-2">Laut DSGVO haben Sie folgende Rechte:</Text>
            <ul className="list-disc pl-6 mb-4 text-sm text-gray-700">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
            </ul>
            <Text>
              Wenn Sie der Meinung sind, dass wir Ihre Daten unrechtmäßig verarbeiten, können Sie sich bei der
              zuständigen Datenschutzbehörde beschweren.
            </Text>
          </div>

          {/* Section 6 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Kontakt</h2>
            <Text className="mb-2">
              Sie haben Fragen zum Datenschutz oder möchten eines Ihrer Rechte ausüben? Schreiben Sie uns gerne:
            </Text>
            <Text className="font-medium">datenschutz@online-museum.com</Text>
          </div>

          {/* Section 7 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Änderungen dieser Datenschutzerklärung</h2>
            <Text className="mb-2">
              Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, wenn sich rechtliche Vorgaben oder
              unser Angebot ändern. Über wesentliche Änderungen informieren wir Sie auf unserer Website.
            </Text>
          </div>
             <Text className="text-sm text-gray-500 mb-6">Stand: 07. Mai 2025</Text>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
