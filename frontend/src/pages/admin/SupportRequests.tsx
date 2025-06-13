import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button, Select, SelectItem, Divider, Dialog, DialogPanel } from '@tremor/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import ContactForm from 'interfaces/ContactForm';
import { contactFormService } from 'services/ContactFormService';
import NotyfService from 'services/NotyfService';
import { userService } from 'services/UserService';
import Loading from 'components/helper/Loading';
import { EnvelopeIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const SupportRequests = () => {
  // State for contact forms, loading, selected form, modal, and status filter
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Check admin rights and load contact forms on mount
    if (!userService.isadmin()) {
      NotyfService.showError('Sie haben keine Berechtigung, auf diese Seite zuzugreifen.');
      return;
    }
    loadContactForms();
  }, []);

  // Fetch all contact forms from the backend
  const loadContactForms = async () => {
    setLoading(true);
    try {
      const forms = await contactFormService.fetchContactForms();
      setContactForms(forms);
    } catch (error) {
      let errorMessage = 'Fehler beim Laden der Support-Anfragen';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update the status of a contact form
  const updateStatus = async (formId: number, newStatus: 'new' | 'in_progress' | 'completed') => {
    try {
      const updatedForm = await contactFormService.updateContactFormStatus(formId, newStatus);
      setContactForms(prev => 
        prev.map(form => form.id === formId ? updatedForm : form)
      );
      if (selectedForm && selectedForm.id === formId) {
        setSelectedForm(updatedForm);
      }
      NotyfService.showSuccess('Status erfolgreich aktualisiert');
    } catch (error) {
      let errorMessage = 'Fehler beim Aktualisieren des Status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      NotyfService.showError(errorMessage);
    }
  };

  // Handle status change from dropdown
  const handleStatusChange = (formId: number, newStatus: string) => {
    if (newStatus === 'new' || newStatus === 'in_progress' || newStatus === 'completed') {
      updateStatus(formId, newStatus);
    }
  };

  // Open the detail modal for a selected form
  const showDetails = (form: ContactForm) => {
    setSelectedForm(form);
    setIsDetailModalOpen(true);
  };

  // Return a colored badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge color="red" icon={ExclamationCircleIcon}>Neu</Badge>;
      case 'in_progress':
        return <Badge color="yellow" icon={ClockIcon}>In Bearbeitung</Badge>;
      case 'completed':
        return <Badge color="green" icon={CheckCircleIcon}>Abgeschlossen</Badge>;
      default:
        return <Badge color="gray">Unbekannt</Badge>;
    }
  };

  // Format date string to German date/time
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };

  // Filter contact forms by selected status
  const filteredForms = contactForms.filter(form => {
    if (statusFilter === 'all') return true;
    return form.status === statusFilter;
  });

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 ">Support-Anfragen</h1>
        <Text>Verwalten Sie eingehende Kontaktanfragen von Benutzern.</Text>
      </div>

      {/* Card with filter and table */}
      <Card>
        {/* Filter and table header */}
        <div className="flex justify-between items-center mb-4">
          <Title>Alle Anfragen</Title>
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="new">Neue Anfragen</SelectItem>
              <SelectItem value="in_progress">In Bearbeitung</SelectItem>
              <SelectItem value="completed">Abgeschlossen</SelectItem>
            </Select>
          </div>
        </div>

        {/* Show message if no forms, otherwise show table */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-10">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <Text>Keine Support-Anfragen gefunden</Text>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Datum</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>E-Mail</TableHeaderCell>
                <TableHeaderCell>Betreff</TableHeaderCell>
                <TableHeaderCell>Aktionen</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render each contact form row */}
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{getStatusBadge(form.status)}</TableCell>
                  <TableCell>{formatDate(form.submitted_on)}</TableCell>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${form.email}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {form.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="truncate max-w-xs">{form.subject}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="xs" 
                        onClick={() => showDetails(form)}
                      >
                        Details
                      </Button>
                      <Select 
                        value={form.status} 
                        onValueChange={(value) => handleStatusChange(form.id, value)}
                        className="w-32"
                      >
                        <SelectItem value="new">Neu</SelectItem>
                        <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                        <SelectItem value="completed">Abgeschlossen</SelectItem>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Detail modal for a selected support request */}
      <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        <DialogPanel>
          {selectedForm && (
            <div>
              {/* Modal header with subject and status */}
              <div className="flex justify-between items-start mb-4">
                <Title>{selectedForm.subject}</Title>
                {getStatusBadge(selectedForm.status)}
              </div>
              
              {/* Submission date */}
              <div className="mb-4">
                <Text className="text-sm text-gray-500">Eingereicht am {formatDate(selectedForm.submitted_on)}</Text>
              </div>
              
              {/* Name and email */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Text className="font-medium">Name</Text>
                  <Text>{selectedForm.name}</Text>
                </div>
                <div>
                  <Text className="font-medium">E-Mail</Text>
                  <a 
                    href={`mailto:${selectedForm.email}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {selectedForm.email}
                  </a>
                </div>
              </div>
              
              <Divider />
              
              {/* Message content */}
              <div className="my-4">
                <Text className="font-medium mb-2">Nachricht</Text>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                  {selectedForm.message}
                </div>
              </div>
              
              <Divider />
              
              {/* Status change and action buttons */}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <Text className="font-medium">Status ändern</Text>
                  <Select 
                    value={selectedForm.status} 
                    onValueChange={(value) => handleStatusChange(selectedForm.id, value)}
                    className="w-40 mt-1"
                  >
                    <SelectItem value="new">Neu</SelectItem>
                    <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                  </Select>
                </div>
                
                <div className="space-x-2">
                  <Button 
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Schließen
                  </Button>
                  <Button 
                    variant="secondary" 
                    color="blue"
                    onClick={() => window.open(`mailto:${selectedForm.email}?subject=Re: ${selectedForm.subject}`)}
                  >
                    Antworten
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default SupportRequests;
