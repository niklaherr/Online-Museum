import { Dialog, Title, Text } from "@tremor/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type AlertType = "create" | "update" | "delete" | "info";

type AlertDialogProps = {
  open: boolean;
  type?: AlertType;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

const typeConfig: Record<
  AlertType,
  { icon: JSX.Element; bg: string; iconColor: string; buttonColor: string }
> = {
  create: {
    icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
    bg: "bg-green-100",
    iconColor: "text-green-600",
    buttonColor: "from-green-600 to-emerald-600",
  },
  update: {
    icon: <PencilSquareIcon className="h-6 w-6 text-blue-600" />,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonColor: "from-blue-600 to-indigo-600",
  },
  delete: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
    bg: "bg-red-100",
    iconColor: "text-red-600",
    buttonColor: "from-red-600 to-pink-600",
  },
  info: {
    icon: <InformationCircleIcon className="h-6 w-6 text-gray-600" />,
    bg: "bg-gray-100",
    iconColor: "text-gray-600",
    buttonColor: "from-gray-600 to-gray-800",
  },
};

function AlertDialog({
  open,
  type = "info",
  title,
  description,
  onClose,
  onConfirm,
}: AlertDialogProps) {
  const config = typeConfig[type];

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-6">
        <div className="text-center space-y-4">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${config.bg}`}>
            {config.icon}
          </div>
          <Title className="text-lg font-semibold text-gray-900">{title}</Title>
          <Text className="text-gray-500">{description}</Text>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r ${config.buttonColor} hover:opacity-90`}
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
