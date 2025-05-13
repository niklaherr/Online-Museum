import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Title,
  Text,
  Flex,
  Metric,
  Icon,
  Button,
} from "@tremor/react";
import {
  AcademicCapIcon,
  PlusCircleIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Entry = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const LandingPage: React.FC = () => {
  const [latestEntries, setLatestEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/entries/latest?limit=5")
      .then((res) => res.json())
      .then((data) => setLatestEntries(data))
      .catch((err) => console.error("Failed to fetch entries", err));
  }, []);

  return (
    <div className="px-4 py-10 md:py-16 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center max-w-2xl mx-auto"
      >
        <Title>Entdecke dein digitales Museum</Title>
        <Text className="mt-4 text-lg text-gray-600">
          Interaktive Ausstellungen. Eigene Beiträge. Deine Favoriten. Alles online.
        </Text>
        <div className="mt-6">
          <Button size="lg" icon={ArrowRightIcon}>
            Jetzt entdecken
          </Button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <Grid numItemsSm={2} numItemsMd={3} className="gap-6">
          {[
            {
              title: "Entdecken",
              text: "Durchsuche Ausstellungen und lerne über Kultur und Geschichte.",
              icon: AcademicCapIcon,
              color: "blue",
            },
            {
              title: "Beitragen",
              text: "Lade deine eigenen Objekte und Geschichten hoch.",
              icon: PlusCircleIcon,
              color: "green",
            },
            {
              title: "Favoriten",
              text: "Speichere deine Lieblingsstücke und teile sie.",
              icon: StarIcon,
              color: "yellow",
            },
          ].map((feature, i) => (
            <motion.div key={feature.title} custom={i} variants={fadeUp}>
              <Card>
                <Flex alignItems="center" className="space-x-4">
                  <Icon icon={feature.icon} size="lg" color={feature.color} />
                  <div>
                    <Metric>{feature.title}</Metric>
                    <Text>{feature.text}</Text>
                  </div>
                </Flex>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </motion.div>

      {/* How it Works Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="space-y-6"
      >
        <Title className="text-center">So funktioniert’s</Title>
        <Grid numItemsSm={1} numItemsMd={3} className="gap-6">
          {[
            "Konto erstellen & anmelden",
            "Durch Beiträge stöbern oder selbst hochladen",
            "Lieblingsstücke speichern und teilen",
          ].map((step, i) => (
            <motion.div key={step} custom={i} variants={fadeUp}>
              <Card>
                <Text className="font-bold mb-2">Schritt {i + 1}</Text>
                <Text>{step}</Text>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </motion.div>

      {/* Latest Entries */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <Flex justifyContent="between" alignItems="center" className="mb-4">
          <Title>Neueste Einträge</Title>
          <ClockIcon className="w-6 h-6 text-gray-500" />
        </Flex>

        <Grid numItemsSm={1} numItemsMd={2} numItemsLg={3} className="gap-4">
          {latestEntries.map((entry, i) => (
            <motion.div key={entry.id} custom={i} variants={fadeUp}>
              <Card>
                <Title>{entry.title}</Title>
                <Text>{entry.description}</Text>
                <Text className="text-sm text-gray-400 mt-2">
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-center py-12 border-t"
      >
        <Title className="mb-4">Bereit, Teil des Museums zu werden?</Title>
        <Button size="lg" icon={PlusCircleIcon}>
          Jetzt Beitrag erstellen
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
