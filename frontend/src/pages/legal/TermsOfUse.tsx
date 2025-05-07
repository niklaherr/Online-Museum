import React from 'react';
import { Card, Title, Text } from '@tremor/react';

const TermsOfUse = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Nutzungsbedingungen</Title>
        <Text className="text-sm text-gray-500 mb-6">Stand: 07. Mai 2025</Text>

        <div className="space-y-6">
          {/* Abschnitt 1 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Geltungsbereich</h2>
            <Text>
              Diese Nutzungsbedingungen regeln die Nutzung der HeritageStory-Plattform durch registrierte Benutzer. Durch die Registrierung und/oder Nutzung unserer Plattform erklären Sie sich mit diesen Nutzungsbedingungen einverstanden.
            </Text>
          </div>

          {/* Abschnitt 2 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Registrierung und Benutzerkonto</h2>
            <Text className="mb-2">
              Für die vollständige Nutzung unserer Plattform ist die Erstellung eines Benutzerkontos erforderlich. Bei der Registrierung müssen Sie wahrheitsgemäße Angaben machen und diese bei Änderungen aktualisieren.
            </Text>
            <Text>
              Sie sind für die Geheimhaltung Ihrer Zugangsdaten verantwortlich und für alle Aktivitäten, die unter Verwendung Ihres Benutzerkontos vorgenommen werden. Bei unbefugter Nutzung oder Sicherheitsverletzungen müssen Sie uns umgehend informieren.
            </Text>
          </div>

          {/* Abschnitt 3 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Nutzungsrechte</h2>
            <Text className="mb-2">
              Wir gewähren Ihnen ein beschränktes, nicht-exklusives, nicht-übertragbares Recht zur Nutzung unserer Plattform gemäß diesen Nutzungsbedingungen.
            </Text>
            <Text>
              Sie dürfen unsere Plattform nicht zu rechtswidrigen Zwecken oder in einer Weise nutzen, die die Plattform, deren Funktionalität oder die Rechte anderer Nutzer beeinträchtigt.
            </Text>
          </div>

          {/* Abschnitt 4 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Nutzerinhalte</h2>
            <Text className="mb-2">
              Sie behalten alle Rechte an den Inhalten, die Sie auf unserer Plattform hochladen oder erstellen. Sie gewähren uns jedoch eine weltweite, nicht-exklusive, gebührenfreie Lizenz zur Nutzung, Reproduktion, Verarbeitung, Anpassung, Veröffentlichung und Übertragung dieser Inhalte, soweit dies für die Bereitstellung und den Betrieb unserer Plattform erforderlich ist.
            </Text>
            <Text>
              Sie dürfen keine Inhalte hochladen, die rechtswidrig sind, die Rechte Dritter verletzen oder gegen diese Nutzungsbedingungen verstoßen.
            </Text>
          </div>

          {/* Abschnitt 5 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Verfügbarkeit und Änderungen der Plattform</h2>
            <Text>
              Wir bemühen uns, unsere Plattform ständig verfügbar zu halten, können jedoch keine ununterbrochene Verfügbarkeit garantieren. Wir behalten uns das Recht vor, Funktionen der Plattform jederzeit zu ändern, zu ergänzen oder einzustellen.
            </Text>
          </div>

          {/* Abschnitt 6 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Datenschutz</h2>
            <Text>
              Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß unserer Datenschutzerklärung, die einen integralen Bestandteil dieser Nutzungsbedingungen darstellt. Die Datenschutzerklärung finden Sie unter dem Link "Datenschutz" im Footer unserer Website.
            </Text>
          </div>

          {/* Abschnitt 7 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Kündigung und Sperrung</h2>
            <Text className="mb-2">
              Sie können Ihr Benutzerkonto jederzeit kündigen. Wir behalten uns das Recht vor, Benutzerkonten bei Verstößen gegen diese Nutzungsbedingungen vorübergehend oder dauerhaft zu sperren.
            </Text>
            <Text>
              Nach Kündigung Ihres Benutzerkontos werden Ihre Daten gemäß unserer Datenschutzerklärung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </Text>
          </div>

          {/* Abschnitt 8 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Haftungsbeschränkung</h2>
            <Text className="mb-2">
              Unsere Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit es sich nicht um die Verletzung wesentlicher Vertragspflichten, um Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit oder um Garantien handelt.
            </Text>
            <Text>
              Wir haften nicht für Inhalte, die von Benutzern auf unserer Plattform hochgeladen oder erstellt werden.
            </Text>
          </div>

          {/* Abschnitt 9 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Geistiges Eigentum</h2>
            <Text>
              Alle Rechte an der Plattform, einschließlich Urheberrechte, Markenrechte und andere geistige Eigentumsrechte, stehen uns oder unseren Lizenzgebern zu. Ohne unsere ausdrückliche schriftliche Zustimmung dürfen Sie keine Teile unserer Plattform vervielfältigen, modifizieren oder anderweitig nutzen.
            </Text>
          </div>

          {/* Abschnitt 10 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Änderungen der Nutzungsbedingungen</h2>
            <Text className="mb-2">
              Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Die aktuelle Version der Nutzungsbedingungen ist stets auf unserer Website verfügbar. Bei wesentlichen Änderungen werden wir Sie vor deren Inkrafttreten informieren.
            </Text>
            <Text>
              Durch die fortgesetzte Nutzung unserer Plattform nach einer Änderung der Nutzungsbedingungen erklären Sie sich mit den geänderten Bedingungen einverstanden.
            </Text>
          </div>

          {/* Abschnitt 11 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Anwendbares Recht und Gerichtsstand</h2>
            <Text>
              Diese Nutzungsbedingungen unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen Nutzungsbedingungen ist, soweit gesetzlich zulässig, München.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TermsOfUse;
