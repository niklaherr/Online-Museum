import { Card, Title, Text } from '@tremor/react';

const Impressum = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <Title className="text-2xl mb-6">Impressum</Title>
        <div className="space-y-6">

          {/* Provider */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Anbieterinformationen</h2>
            <Text className="mb-2 font-medium">Online Museum GmbH</Text>
            <Text>Fleethörn 1-7</Text>
            <Text>24103 Kiel</Text>
            <Text>Deutschland</Text>
          </div>

          {/* Contact */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Kontakt</h2>
            <Text className="mb-2">Telefon: +49 (0)30 123456789</Text>
            <Text className="mb-2">E-Mail: kontakt@online-museum.com</Text>
            <Text>Website: www.online-museum.com</Text>
          </div>

          {/* Authorized representatives */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Vertretungsberechtigte Geschäftsführer</h2>
            <Text>Niklas Herrmann</Text>
            <Text>Hendrik Steen</Text>
            <Text>Malte Beissel</Text>
          </div>

          {/* Companies House */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Registereintrag</h2>
            <Text className="mb-2">Handelsregister: Amtsgericht Kiel</Text>
            <Text>Registernummer: HRB 1234 KI</Text>
          </div>

          {/* VAT-ID */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Umsatzsteuer-ID</h2>
            <Text>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE123456789</Text>
          </div>

          {/* Responsible for content */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <Text>Niklas Herrmann</Text>
            <Text>Hendrik Steen</Text>
            <Text>c/o Online Museum GmbH</Text>
            <Text>Fleethörn 1-7, 24103 Kiel</Text>
          </div>

          {/* Disclaimer */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Haftung für Inhalte</h2>
            <Text>
              Wir bemühen uns, die Inhalte dieser Website aktuell und korrekt zu halten. Dennoch können wir keine Gewähr
              für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen.
            </Text>
          </div>

          {/* Extern Links */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Haftung für externe Links</h2>
            <Text>
              Unsere Website enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
            </Text>
          </div>

          <Text className="text-sm text-gray-500 mt-6">Stand: 04. Juni 2025</Text>
        </div>
      </Card>
    </div>
  );
};

export default Impressum;
