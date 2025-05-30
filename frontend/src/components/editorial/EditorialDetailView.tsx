import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Title,
  Text,
  Subtitle,
  Grid,
  Badge,
} from "@tremor/react";
import {
  UserIcon,
  CalendarIcon,
  EyeIcon,
  RectangleStackIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import Editorial from "interfaces/Editorial";
import { editorialService } from "services/EditorialService";
import NotyfService from "services/NotyfService";
import Loading from "components/helper/Loading";

type EditorialDetailViewProps = {
  onNavigate: (route: string) => void;
};

const EditorialDetailView = ({ onNavigate }: EditorialDetailViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [list, setList] = useState<Editorial | null>(null);

  useEffect(() => {
    const loadItemLists = async () => {
      try {
        const fetchedItems = await editorialService.fetchItemsByEditorialId(parseInt(id!));
        const fetchedList = await editorialService.fetchEditorialListById(id!);
        setItems(fetchedItems);
        setList(fetchedList);
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Fehler beim Laden der Items";
        NotyfService.showError(errorMessage);
      }
    };

    loadItemLists();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="blue" icon={RectangleStackIcon}>
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Badge>
            {/* Optional: If there's a privacy field, use this */}
            {/* list?.isprivate ? (
              <Badge color="red" icon={LockClosedIcon}>Privat</Badge>
            ) : (
              <Badge color="green" icon={EyeIcon}>Öffentlich</Badge>
            ) */}
          </div>

          <div className="space-y-2">
            <Title className="text-3xl text-blue-900 leading-tight">{list?.title}</Title>
            {list?.description && (
              <Subtitle className="text-blue-700 text-lg max-w-3xl">
                {list.description}
              </Subtitle>
            )}
            <div className="flex items-center text-blue-600 space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <Text>
                Erstellt am{" "}
                {list ? new Date(list.entered_on).toLocaleDateString("de-DE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "/"}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Items */}
      {items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Title className="text-xl text-gray-900">Enthaltene Items</Title>
            <Text className="text-gray-500">
              {items.length} {items.length === 1 ? "Item" : "Items"} in diesem Editorial
            </Text>
          </div>

          <Grid className="gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => onNavigate(`/items/${item.id}`)}
              >
                {/* Image */}
                <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <EyeIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    {item.category && (
                      <Badge color="blue" icon={TagIcon} size="xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>

                  <Title className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </Title>

                  <Text className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(item.entered_on).toLocaleDateString("de-DE")}
                  </Text>

                  <div className="flex items-center pt-2 border-t border-gray-100">
                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <Text className="text-sm text-gray-600 font-medium">
                      {item.username}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <RectangleStackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Title className="text-gray-500 mb-2">Keine Items im Editorial</Title>
            <Text className="text-gray-400">
              Dieses Editorial enthält noch keine Items.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EditorialDetailView;
