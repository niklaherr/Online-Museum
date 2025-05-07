import { Card, Title, Text } from '@tremor/react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Title className="mb-6">Datenschutzerklärung</Title>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">1. Einleitung und Übersicht</Title>
        <Text className="mb-2">
          Wir haben diese Datenschutzerklärung verfasst, um Ihnen gemäß der Vorgaben der 
          Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren nationalen Gesetzen zu erklären, 
          welche personenbezogenen Daten (kurz Daten) wir als Verantwortliche verarbeiten, 
          zukünftig verarbeiten werden und welche rechtmäßigen Entscheidungsmöglichkeiten Sie haben.
        </Text>
        <Text>
          Die verwendeten Begriffe sind geschlechtsneutral zu verstehen.
        </Text>
      </Card>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">2. Anwendungsbereich</Title>
        <Text className="mb-2">
          Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten
          und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten.
          Mit personenbezogenen Daten meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum Beispiel Name,
          E-Mail-Adresse und Benutzerverhalten (Nutzungsdaten).
        </Text>
      </Card>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">3. Rechtsgrundlagen</Title>
        <Text className="mb-2">
          In diesem Abschnitt informieren wir Sie über die Rechtsgrundlagen der DSGVO, auf deren Basis wir 
          personenbezogene Daten verarbeiten:
        </Text>
        <Text className="mb-2">
          <span className="font-medium">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</span> Die betroffene 
          Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten 
          für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.
        </Text>
        <Text className="mb-2">
          <span className="font-medium">Art. 6 Abs. 1 lit. b DSGVO (Vertrag):</span> Die Verarbeitung ist für 
          die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung 
          vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.
        </Text>
        <Text className="mb-2">
          <span className="font-medium">Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen):</span> Die 
          Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten 
          erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person 
          überwiegen.
        </Text>
      </Card>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">4. Erhobene Daten und Speicherdauer</Title>
        <Text className="mb-2">
          <span className="font-medium">Erhobene Daten:</span> Wir erheben und verarbeiten folgende personenbezogene Daten:
        </Text>
        <ul className="list-disc pl-6 mb-4">
          <li>Benutzernamen</li>
          <li>Anmeldeinformationen (Passwörter werden verschlüsselt gespeichert)</li>
          <li>Sicherheitsfragen und -antworten für Passwort-Reset</li>
          <li>Informationen zu von Ihnen erstellten Inhalten (Listen und Einträge)</li>
          <li>Nutzungsdaten wie Zugriffszeiten und -häufigkeit</li>
        </ul>
        <Text className="mb-2">
          <span className="font-medium">Speicherdauer:</span> Wir speichern personenbezogene Daten nur so lange, wie 
          es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist oder es gesetzlich 
          vorgeschrieben ist. Danach löschen wir die Daten oder anonymisieren sie, sodass ein Personenbezug nicht mehr 
          herstellbar ist.
        </Text>
      </Card>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">5. Rechte laut Datenschutz-Grundverordnung</Title>
        <Text className="mb-2">
          Gemäß Art. 13, 14 DSGVO informieren wir Sie über die folgenden Rechte, die Ihnen zustehen, damit es zu einer 
          fairen und transparenten Verarbeitung von Daten kommt:
        </Text>
        <ul className="list-disc pl-6 mb-4">
          <li>Auskunftsrecht (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
        </ul>
        <Text>
          Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre 
          datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der 
          zuständigen Aufsichtsbehörde beschweren.
        </Text>
      </Card>
      
      <Card className="mb-6">
        <Title className="text-xl mb-4">6. Kontakt</Title>
        <Text className="mb-2">
          Wenn Sie Fragen zum Datenschutz oder zur Verarbeitung Ihrer personenbezogenen Daten haben, 
          können Sie uns unter folgender E-Mail-Adresse erreichen:
        </Text>
        <Text className="font-medium">datenschutz@myheritagestory.com</Text>
      </Card>
      
      <Card>
        <Title className="text-xl mb-4">7. Änderungen dieser Datenschutzerklärung</Title>
        <Text className="mb-2">
          Wir behalten uns das Recht vor, diese Datenschutzerklärung jederzeit zu ändern, um sie an geänderte 
          Rechtslagen oder bei Änderungen des Dienstes sowie der Datenverarbeitung anzupassen. Die Nutzer werden 
          jedoch bei Bedarf aufgefordert, eine neue Datenschutzerklärung zu akzeptieren.
        </Text>
        <Text className="italic">
          Stand: Mai 2025
        </Text>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;