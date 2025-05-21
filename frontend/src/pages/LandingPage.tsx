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
import { itemService } from "services/ItemService";
import { GalleryItem } from "interfaces/Item";
import NotyfService from "services/NotyfService";
import NoResults from "../components/helper/NoResults";
import Loading from "components/helper/Loading";

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

type LandingPageProps = {
  onNavigate: (route: string) => void;
};

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const [museumItems, setMuseumItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      const items = await itemService.fetchLandingPageItems();
      setMuseumItems(items);
      setIsLoading(false);
    } catch (error) {
      let errorMessage = "Fehler beim Laden der Items";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (isLoading) return <Loading />;

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
          <Button size="lg" icon={ArrowRightIcon} onClick={() => onNavigate("/register")}>
            Jetzt entdecken
          </Button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
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
              title: "Listen",
              text: "Erstelle Listen, die alle deine eigenen Objekte zusammenfassen.",
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
            "Listen erstellen und speichern",
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

      {/* Embedded YouTube Video */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <Card className="p-6 rounded-2xl shadow-md">
          <Title className="mb-4 text-center">Video: Willkommen im digitalen Museum</Title>
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual video
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      </motion.div>

      {/* Latest Entries */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <Flex justifyContent="between" alignItems="center" className="mb-4">
          <Title>Neueste Einträge</Title>
          <ClockIcon className="w-6 h-6 text-gray-500" />
        </Flex>

        {museumItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {museumItems.map((item, i) => (
              <motion.div key={item.id} custom={i} variants={fadeUp}>
                <Card
                  key={item.id}
                  className="p-4 flex flex-col justify-between shadow-md h-full cursor-pointer"
                >
                  <Text className="text-sm uppercase tracking-wide text-blue-500 font-medium">
                    {item.category}
                  </Text>
                  <Text className="mt-2 text-lg font-semibold">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Erstellt am: {new Date(item.entered_on).toLocaleDateString()}
                  </Text>

                  <div className="mt-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <NoResults />
        )}
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
        <Button size="lg" icon={PlusCircleIcon} onClick={() => onNavigate("/register")}>
          Jetzt Beitrag erstellen
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
