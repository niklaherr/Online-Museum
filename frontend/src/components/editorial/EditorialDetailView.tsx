import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Title,
  Text,
  Button,
  Subtitle,
  Grid,
  Dialog,
  DialogPanel,
  Flex
} from "@tremor/react";
import { UserIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GalleryItem } from "interfaces/Item";
import NotyfService from "services/NotyfService";
import NoResults from "components/helper/NoResults";
import Editorial from "interfaces/Editorial";
import { editorialService } from "services/EditorialService";
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
        const itemLists = await editorialService.fetchItemsByEditorialId(parseInt(id!));
        const itemList = await editorialService.fetchEditorialListById(id!);
        setList(itemList);
        setItems(itemLists);
        setIsLoading(false);
      } catch (error) {
        let errorMessage = "Fehler beim Laden der Items";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        NotyfService.showError(errorMessage);
      }
    };

    loadItemLists();
  }, [id]);

  if (isLoading) return <Loading />

  return (
    <div className="flex flex-col h-screen space-y-6">
      {/* Header */}
      <Card className="bg-blue-100 p-6 relative rounded-xl">
        <div className="flex justify-between items-start">
          <div>
            <Title className="text-blue-800">{list?.title}</Title>
            <Subtitle className="text-blue-700 mt-1">{list?.description}</Subtitle>
            <Text className="text-blue-700 mt-2">
              Erstellt am: {list?.entered_on} • {true ? "Privat" : "Öffentlich"}
            </Text>
          </div>
        </div>
        
      </Card>

      {/* Items */}
      {items.length > 0 ? (
        <Grid className="gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => onNavigate(`/items/${item.id}`)}
            >
              <Text className="text-sm font-semibold text-blue-500 uppercase">
                {item.category}
              </Text>
              <Title className="mt-2">{item.title}</Title>
              <Text className="text-xs text-gray-500 mt-1">
                Eingetragen am: {item.entered_on}
              </Text>

              <div className="mt-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md border"
                />
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <Text className="text-sm text-gray-600">{item.username}</Text>
              </div>
            </Card>
          ))}
        </Grid>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default EditorialDetailView;
