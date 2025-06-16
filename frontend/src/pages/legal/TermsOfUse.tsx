import React from 'react';
import { Card, Title, Text } from '@tremor/react';

const TermsOfUse = () => {

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Main card container for the Terms of Use */}
      <Card>
        <Title className="text-2xl mb-6">Nutzungsbedingungen</Title>

        <div className="space-y-6">
          {/* Section 1: Scope of Terms */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Geltungsbereich</h2>
            <Text>
              Diese Nutzungsbedingungen regeln die Nutzung der Online-Museum-Plattform durch registrierte Benutzer. Durch die Registrierung und/oder Nutzung unserer Plattform erklären Sie sich mit diesen Nutzungsbedingungen einverstanden.
            </Text>
          </div>

          {/* Section 2: Registration and User Account */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Registrierung und Benutzerkonto</h2>
            <Text className="mb-2">
              Für die vollständige Nutzung unserer Plattform ist die Erstellung eines Benutzerkontos erforderlich. Bei der Registrierung müssen Sie wahrheitsgemäße Angaben machen und diese bei Änderungen aktualisieren.
            </Text>
            <Text>
              Sie sind für die Geheimhaltung Ihrer Zugangsdaten verantwortlich und für alle Aktivitäten, die unter Verwendung Ihres Benutzerkontos vorgenommen werden. Bei unbefugter Nutzung oder Sicherheitsverletzungen müssen Sie uns umgehend informieren.
            </Text>
          </div>

          {/* Section 3: Usage Rights */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Nutzungsrechte</h2>
            <Text className="mb-2">
              Wir gewähren Ihnen ein beschränktes, nicht-exklusives, nicht-übertragbares Recht zur Nutzung unserer Plattform gemäß diesen Nutzungsbedingungen.
            </Text>
            <Text>
              Sie dürfen unsere Plattform nicht zu rechtswidrigen Zwecken oder in einer Weise nutzen, die die Plattform, deren Funktionalität oder die Rechte anderer Nutzer beeinträchtigt.
            </Text>
          </div>

          {/* Section 4: User Content */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Nutzerinhalte</h2>
            <Text className="mb-2">
              Sie behalten alle Rechte an den Inhalten, die Sie auf unserer Plattform hochladen oder erstellen. Sie gewähren uns jedoch eine weltweite, nicht-exklusive, gebührenfreie Lizenz zur Nutzung, Reproduktion, Verarbeitung, Anpassung, Veröffentlichung und Übertragung dieser Inhalte, soweit dies für die Bereitstellung und den Betrieb unserer Plattform erforderlich ist.
            </Text>
            <Text>
              Sie dürfen keine Inhalte hochladen, die rechtswidrig sind, die Rechte Dritter verletzen oder gegen diese Nutzungsbedingungen verstoßen.
            </Text>
          </div>

          {/* Section 5: Platform Availability and Changes */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Verfügbarkeit und Änderungen der Plattform</h2>
            <Text>
              Wir bemühen uns, unsere Plattform ständig verfügbar zu halten, können jedoch keine ununterbrochene Verfügbarkeit garantieren. Wir behalten uns das Recht vor, Funktionen der Plattform jederzeit zu ändern, zu ergänzen oder einzustellen.
            </Text>
          </div>

          {/* Section 6: Data Protection */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Datenschutz</h2>
            <Text>
              Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß unserer Datenschutzerklärung, die einen integralen Bestandteil dieser Nutzungsbedingungen darstellt. Die Datenschutzerklärung finden Sie unter dem Link "Datenschutz" im Footer unserer Website.
            </Text>
          </div>

          {/* Section 7: Termination and Suspension */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Kündigung und Sperrung</h2>
            <Text className="mb-2">
              Sie können Ihr Benutzerkonto jederzeit kündigen. Wir behalten uns das Recht vor, Benutzerkonten bei Verstößen gegen diese Nutzungsbedingungen vorübergehend oder dauerhaft zu sperren.
            </Text>
            <Text>
              Nach Kündigung Ihres Benutzerkontos werden Ihre Daten gemäß unserer Datenschutzerklärung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </Text>
          </div>

          {/* Section 8: Limitation of Liability */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Haftungsbeschränkung</h2>
            <Text className="mb-2">
              Unsere Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit es sich nicht um die Verletzung wesentlicher Vertragspflichten, um Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit oder um Garantien handelt.
            </Text>
            <Text>
              Wir haften nicht für Inhalte, die von Benutzern auf unserer Plattform hochgeladen oder erstellt werden.
            </Text>
          </div>

          {/* Section 9: Intellectual Property */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Geistiges Eigentum</h2>
            <Text>
              Alle Rechte an der Plattform, einschließlich Urheberrechte, Markenrechte und andere geistige Eigentumsrechte, stehen uns oder unseren Lizenzgebern zu. Ohne unsere ausdrückliche schriftliche Zustimmung dürfen Sie keine Teile unserer Plattform vervielfältigen, modifizieren oder anderweitig nutzen.
            </Text>
          </div>

          {/* Section 10: Changes to Terms of Use */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Änderungen der Nutzungsbedingungen</h2>
            <Text className="mb-2">
              Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Die aktuelle Version der Nutzungsbedingungen ist stets auf unserer Website verfügbar. Bei wesentlichen Änderungen werden wir Sie vor deren Inkrafttreten informieren.
            </Text>
            <Text>
              Durch die fortgesetzte Nutzung unserer Plattform nach einer Änderung der Nutzungsbedingungen erklären Sie sich mit den geänderten Bedingungen einverstanden.
            </Text>
          </div>

          {/* Section 11: Governing Law and Jurisdiction */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Anwendbares Recht und Gerichtsstand</h2>
            <Text>
              Diese Nutzungsbedingungen unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen Nutzungsbedingungen ist, soweit gesetzlich zulässig, München.
            </Text>
          </div>
          {/* Footer: Last updated information */}
          <Text className="text-sm text-gray-500 mt-6">
            Stand: 16.06.2025 |
            Letzte Aktualisierung: 27.05.2025
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TermsOfUse;
