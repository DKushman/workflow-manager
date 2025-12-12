import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, ChevronDown, Folder, Check, X, Calendar, Download, Upload, Archive, Trash2, Image as ImageIcon, ExternalLink, List, Grid, Edit2, Settings } from 'lucide-react';

export default function WebDevWorkflow() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [view, setView] = useState('clients');
  const [newClientName, setNewClientName] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [todoView, setTodoView] = useState('list'); // 'list' or 'calendar'
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split('T')[0]);
  const [newClientFigmaUrl, setNewClientFigmaUrl] = useState('');
  const [newClientWebsiteUrl, setNewClientWebsiteUrl] = useState('');
  const [expandedGuidelines, setExpandedGuidelines] = useState(true);
  const [expandedWorkflow, setExpandedWorkflow] = useState(true);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editFigmaUrl, setEditFigmaUrl] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [showNewTodoModal, setShowNewTodoModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [clients]);

  const loadData = () => {
    try {
      const saved = localStorage.getItem('clients-data');
      if (saved) {
        setClients(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Keine gespeicherten Daten gefunden');
    }
  };

  const saveData = () => {
    if (clients.length > 0) {
      try {
        localStorage.setItem('clients-data', JSON.stringify(clients));
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(clients, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devdesign-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setClients(imported);
        } catch (error) {
          alert('Fehler beim Importieren der Datei');
        }
      };
      reader.readAsText(file);
    }
  };

  const archiveClient = (clientId) => {
    const updatedClients = clients.map(c => 
      c.id === clientId ? { ...c, archived: !c.archived } : c
    );
    setClients(updatedClients);
  };

  const handleImageUpload = (clientId, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      const updatedClients = clients.map(client => 
        client.id === clientId ? { ...client, profileImage: imageData } : client
      );
      setClients(updatedClients);
      if (selectedClient?.id === clientId) {
        setSelectedClient({ ...selectedClient, profileImage: imageData });
      }
    };
    reader.readAsDataURL(file);
  };

  const addClient = () => {
    if (!newClientName.trim()) return;
    
    const newClient = {
      id: Date.now(),
      name: newClientName,
      archived: false,
      profileImage: null,
      figmaUrl: newClientFigmaUrl.trim() || '',
      websiteUrl: newClientWebsiteUrl.trim() || '',
      color: ['blue', 'purple', 'green', 'orange', 'pink'][Math.floor(Math.random() * 5)],
      guidelines: [
        { id: 1, num: '01', text: 'Projektordner in Cursor anlegen mit /images, /videos, /css, /js', checked: false },
        { id: 2, num: '02', text: 'CSS-Variablen definieren: Standard-Font, h1-h4, Paragraph-Styles', checked: false },
        { id: 3, num: '03', text: 'Custom Properties (--var) für Fonts, Spacing, Colors, Buttons', checked: false },
        { id: 4, num: '04', text: 'Semantische HTML5-Tags (header, nav, main, footer)', checked: false },
        { id: 5, num: '05', text: 'Smooth Scrolling aktivieren (scroll-behavior: smooth)', checked: false },
        { id: 6, num: '06', text: 'Cookie-Banner implementieren', checked: false },
        { id: 7, num: '07', text: 'Alle Medien sofort nach Import komprimieren', checked: false },
        { id: 8, num: '08', text: 'Lazy Loading für Bilder (loading="lazy")', checked: false },
        { id: 9, num: '09', text: 'Mobile-First: Grid, Flexbox, clamp() nutzen', checked: false },
        { id: 10, num: '10', text: 'Font-Größen ausschließlich in rem', checked: false },
        { id: 11, num: '11', text: 'CSS bevorzugen, JS nur wenn nötig', checked: false },
        { id: 12, num: '12', text: 'Wiederverwendbare Animationsfunktionen', checked: false },
        { id: 13, num: '13', text: 'GSAP: Nur benötigte Module laden', checked: false },
        { id: 14, num: '14', text: 'JavaScript modular strukturieren', checked: false },
        { id: 15, num: '15', text: 'JS nur auf Seiten einbinden wo benötigt', checked: false },
        { id: 16, num: '16', text: 'JavaScript vor </body> laden', checked: false },
        { id: 17, num: '17', text: 'CSS in einer styles.css zusammenführen', checked: false },
        { id: 18, num: '18', text: 'Aussagekräftige Variablen-Namen', checked: false },
        { id: 19, num: '19', text: 'Jede Seite einzeln bearbeiten', checked: false }
      ],
      workflow: [
        { id: 1, num: '01', text: 'Briefing: Ästhetik klären (modern/klassisch, ernst/spielerisch)', checked: false },
        { id: 2, num: '02', text: 'Moodboard: Farbpalette, Vergleichswebsites, Logo', checked: false },
        { id: 3, num: '03', text: 'Favicon in Figma definieren', checked: false },
        { id: 4, num: '04', text: 'Button-Varianten mit CTAs vorbereiten', checked: false },
        { id: 5, num: '05', text: 'Site-Structure via Konkurrenz-Recherche', checked: false },
        { id: 6, num: '06', text: 'Figma-Designs als Screenshots exportieren', checked: false }
      ],
      todos: [
        { id: 1, text: 'Figma-Datei: Logo, Favicon, Farben, Schriftart', checked: false, date: '', required: true },
        { id: 2, text: 'Ästhetik-Richtung & Vergleichswebsites', checked: false, date: '', required: true },
        { id: 3, text: 'Grundgerüst auf Basis von Recherche', checked: false, date: '', required: true }
      ]
    };
    
    setClients([...clients, newClient]);
    setNewClientName('');
    setNewClientFigmaUrl('');
    setNewClientWebsiteUrl('');
    setShowNewClientModal(false);
  };

  const FigmaIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.264 7.51h3.588c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.588V7.51zm0 1.471H8.981c-2.476 0-4.49-2.014-4.49-4.49S6.505 0 8.981 0h3.283v8.981zm-3.283-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.02 3.019 3.02h3.283V1.471H8.981zm4.588 15.019H8.981c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-4.588-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h4.588V9.981H8.981zm7.871 0h-.784c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.784c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019z"/>
    </svg>
  );

  const deleteClient = (clientId) => {
    setClients(clients.filter(c => c.id !== clientId));
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
      setView('clients');
    }
  };

  const toggleItem = (section, itemId) => {
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          [section]: client[section].map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return client;
    });
    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          todos: [...client.todos, {
            id: Date.now(),
            text: newTodo,
            checked: false,
            date: newTodoDate,
            time: newTodoTime || '',
            required: false
          }]
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
    setNewTodo('');
    setNewTodoDate('');
    setNewTodoTime('');
  };

  const getTodosByDate = () => {
    const todosByDate = {};
    selectedClient.todos.forEach(todo => {
      if (todo.date) {
        if (!todosByDate[todo.date]) {
          todosByDate[todo.date] = [];
        }
        todosByDate[todo.date].push(todo);
      }
    });
    // Sortiere To-Dos innerhalb eines Tages nach Zeit
    Object.keys(todosByDate).forEach(date => {
      todosByDate[date].sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
    });
    return todosByDate;
  };

  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Leere Tage am Anfang
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Tage des Monats
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  };

  const deleteTodo = (todoId) => {
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          todos: client.todos.filter(t => t.id !== todoId && t.required !== false ? true : t.id !== todoId)
        };
      }
      return client;
    });
    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === selectedClient.id));
  };

  const updateClientLinks = () => {
    if (!editingClient) return;
    
    const updatedClients = clients.map(client => 
      client.id === editingClient.id 
        ? { ...client, figmaUrl: editFigmaUrl.trim(), websiteUrl: editWebsiteUrl.trim() }
        : client
    );
    setClients(updatedClients);
    if (selectedClient?.id === editingClient.id) {
      setSelectedClient({ ...selectedClient, figmaUrl: editFigmaUrl.trim(), websiteUrl: editWebsiteUrl.trim() });
    }
    setShowEditClientModal(false);
    setEditingClient(null);
    setEditFigmaUrl('');
    setEditWebsiteUrl('');
  };

  const getProgress = (items) => {
    const checked = items.filter(i => i.checked).length;
    return Math.round((checked / items.length) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00');
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return { weekday, formatted: `${day}. ${month} ${year}` };
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600'
  };

  const activeClients = clients.filter(c => !c.archived);
  const archivedClients = clients.filter(c => c.archived);

  if (view === 'clients') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header mit Logo */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="bg-black px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">DEVDESIGN.STUDIO</h1>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                  Workflow Manager
                </div>
              </div>
              <div className="hidden md:flex gap-3">
                <button
                  onClick={exportData}
                  className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm text-gray-900"
                >
                  <Download size={16} />
                  Export
                </button>
                <label className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm cursor-pointer text-gray-900">
                  <Upload size={16} />
                  Import
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4 text-gray-900">Projekte</h2>
            <p className="text-gray-500 text-base sm:text-lg font-medium">Verwalte deine Kundenprojekte und Workflows</p>
          </div>
          
          <button
            onClick={() => setShowNewClientModal(true)}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 md:mb-12 shadow-sm border-2 border-dashed border-gray-300 hover:border-black hover:shadow-lg transition-all w-full flex flex-col items-center justify-center gap-3 sm:gap-4 text-gray-600 hover:text-black min-h-[140px] sm:min-h-[160px] md:min-h-[180px] group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-black group-hover:to-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-all">
              <Plus size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm sm:text-base md:text-lg font-bold">Neues Projekt erstellen</span>
            <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-600 transition-colors">Klicken zum Hinzufügen</span>
          </button>

          {showNewClientModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewClientModal(false)}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Neues Projekt erstellen</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Projektname *</label>
                    <input
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addClient()}
                      placeholder="Projektname eingeben..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Figma URL (optional)</label>
                    <input
                      type="url"
                      value={newClientFigmaUrl}
                      onChange={(e) => setNewClientFigmaUrl(e.target.value)}
                      placeholder="https://figma.com/..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Website URL (optional)</label>
                    <input
                      type="url"
                      value={newClientWebsiteUrl}
                      onChange={(e) => setNewClientWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowNewClientModal(false);
                        setNewClientName('');
                        setNewClientFigmaUrl('');
                        setNewClientWebsiteUrl('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm sm:text-base font-semibold text-gray-900"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={addClient}
                      className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
                    >
                      <Plus size={18} />
                      Erstellen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeClients.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-12">
              {activeClients.map(client => {
                const totalTasks = client.guidelines.length + client.workflow.length + client.todos.length;
                const completedTasks = client.guidelines.filter(g => g.checked).length + 
                                      client.workflow.filter(w => w.checked).length + 
                                      client.todos.filter(t => t.checked).length;
                const progress = Math.round((completedTasks / totalTasks) * 100);

                return (
                  <div
                    key={client.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 hover:shadow-lg sm:hover:shadow-xl transition-all group overflow-hidden flex flex-col"
                  >
                    <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${colorClasses[client.color]}`} />
                    <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
                      <div 
                        onClick={() => {
                          setSelectedClient(client);
                          setView('sections');
                        }}
                        className="cursor-pointer flex-1 flex flex-col"
                      >
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="relative group/image flex-shrink-0">
                            {client.profileImage ? (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-2 border-gray-200 shadow-sm">
                                <img 
                                  src={client.profileImage} 
                                  alt={client.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${colorClasses[client.color]} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <Folder size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                              </div>
                            )}
                            <label 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer transition-opacity"
                            >
                              <ImageIcon size={14} className="sm:w-4 sm:h-4 text-white" />
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleImageUpload(client.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 leading-tight">{client.name}</h3>
                            <p className="text-[10px] sm:text-xs text-gray-600 font-semibold">
                              {completedTasks} von {totalTasks} Aufgaben
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 sm:space-y-2.5 mt-auto">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs text-gray-700 font-bold">Fortschritt</span>
                            <span className="text-xs sm:text-sm font-bold text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                            <div 
                              className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${colorClasses[client.color]} transition-all duration-500 shadow-sm`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                            {client.figmaUrl && (
                              <a
                                href={client.figmaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow"
                                onClick={(e) => e.stopPropagation()}
                                title="Figma öffnen"
                              >
                                <FigmaIcon />
                              </a>
                            )}
                            {client.websiteUrl && (
                              <a
                                href={client.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow"
                                onClick={(e) => e.stopPropagation()}
                                title="Website öffnen"
                              >
                                <ExternalLink size={14} className="sm:w-4 sm:h-4 text-gray-700" />
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingClient(client);
                                setEditFigmaUrl(client.figmaUrl || '');
                                setEditWebsiteUrl(client.websiteUrl || '');
                                setShowEditClientModal(true);
                              }}
                              className="p-1.5 sm:p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow"
                              title="Links bearbeiten"
                            >
                              <Settings size={14} className="sm:w-4 sm:h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 sm:gap-2 pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveClient(client.id);
                          }}
                          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-700 font-semibold"
                        >
                          <Archive size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Archivieren</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Projekt "${client.name}" wirklich löschen?`)) {
                              deleteClient(client.id);
                            }
                          }}
                          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-all flex items-center justify-center gap-1 text-[10px] sm:text-xs text-red-700 font-semibold"
                        >
                          <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Löschen</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {archivedClients.length > 0 && (
            <div className="mt-8 sm:mt-12 md:mt-16">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-600">Archiviert</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {archivedClients.map(client => (
                  <div
                    key={client.id}
                    className="bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 md:p-8 opacity-60 hover:opacity-100 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        {client.profileImage ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                            <img 
                              src={client.profileImage} 
                              alt={client.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <Folder size={18} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-base sm:text-lg text-gray-600 truncate">{client.name}</span>
                      </div>
                      <button
                        onClick={() => archiveClient(client.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-white rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Wiederherstellen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showEditClientModal && editingClient && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditClientModal(false)}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Links bearbeiten - {editingClient.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Figma URL</label>
                    <input
                      type="url"
                      value={editFigmaUrl}
                      onChange={(e) => setEditFigmaUrl(e.target.value)}
                      placeholder="https://figma.com/..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Website URL</label>
                    <input
                      type="url"
                      value={editWebsiteUrl}
                      onChange={(e) => setEditWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowEditClientModal(false);
                        setEditingClient(null);
                        setEditFigmaUrl('');
                        setEditWebsiteUrl('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm sm:text-base font-semibold text-gray-700"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={updateClientLinks}
                      className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
                    >
                      <Settings size={18} />
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'sections') {
    const totalTasks = selectedClient.guidelines.length + selectedClient.workflow.length + selectedClient.todos.length;
    const completedTasks = selectedClient.guidelines.filter(g => g.checked).length + 
                          selectedClient.workflow.filter(w => w.checked).length + 
                          selectedClient.todos.filter(t => t.checked).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <button
                  onClick={() => setView('clients')}
                  className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-sm sm:text-base"
                >
                  ← Projekte
                </button>
                <div className="h-6 sm:h-8 w-px bg-gray-200" />
                <div className="relative group/image">
                  {selectedClient.profileImage ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                      <img 
                        src={selectedClient.profileImage} 
                        alt={selectedClient.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Folder size={18} className="sm:w-5 sm:h-5 text-gray-700" />
                    </div>
                  )}
                  <label 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 rounded-xl flex items-center justify-center cursor-pointer transition-opacity"
                  >
                    <ImageIcon size={14} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(selectedClient.id, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedClient.name}</h1>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {completedTasks} / {totalTasks} abgeschlossen
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4 text-gray-900">Bereiche</h2>
            <p className="text-gray-500 text-base sm:text-lg font-medium">Wähle einen Workflow-Bereich</p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {[
              { key: 'checklist', title: 'CheckListe', emoji: '✓', items: [...selectedClient.guidelines, ...selectedClient.workflow], desc: 'Frontend Guidelines und Ablauf' },
              { key: 'todos', title: 'To-Do', emoji: '📝', items: selectedClient.todos, desc: 'Aufgaben und Deadlines' }
            ].map(section => {
              const progress = getProgress(section.items);
              return (
                <div
                  key={section.key}
                  onClick={() => setView(section.key)}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="p-4 sm:p-6 md:p-10">
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5 md:mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl flex-shrink-0">
                        {section.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{section.title}</h3>
                        <p className="text-sm sm:text-base text-gray-500 font-medium">{section.desc}</p>
                      </div>
                      <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-700 font-bold">Fortschritt</span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3">
                        <div 
                          className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${colorClasses[selectedClient.color]} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {section.items.filter(i => i.checked).length} von {section.items.length} erledigt
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'checklist') {
    const guidelinesProgress = getProgress(selectedClient.guidelines);
    const workflowProgress = getProgress(selectedClient.workflow);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <button
                onClick={() => setView('sections')}
                className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                ← Zurück
              </button>
              <div className="h-6 sm:h-8 w-px bg-gray-200" />
              <div className="text-xl sm:text-2xl">✓</div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">CheckListe</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16">
          <div className="space-y-4 sm:space-y-6">
            {/* Frontend Guidelines - Ausklappbar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedGuidelines(!expandedGuidelines)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    ⚙️
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Frontend Guidelines</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        {selectedClient.guidelines.filter(i => i.checked).length} von {selectedClient.guidelines.length} erledigt
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{guidelinesProgress}%</span>
                    </div>
                  </div>
                </div>
                {expandedGuidelines ? (
                  <ChevronDown size={20} className="sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {expandedGuidelines && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                  <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                    {selectedClient.guidelines.map(item => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                          <button
                            onClick={() => toggleItem('guidelines', item.id)}
                            className={`mt-0.5 sm:mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              item.checked
                                ? 'bg-black border-black'
                                : 'border-gray-300 hover:border-gray-400 bg-white'
                            }`}
                          >
                            {item.checked && <Check size={14} className="sm:w-[18px] sm:h-[18px] text-white" strokeWidth={3} />}
                          </button>
                          
                          <span className={`text-base sm:text-lg font-bold mt-0.5 sm:mt-1 flex-shrink-0 ${
                            item.checked ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {item.num}
                          </span>
                          
                          <p className={`text-base sm:text-lg leading-relaxed flex-1 font-medium ${
                            item.checked ? 'line-through text-gray-300' : 'text-gray-900'
                          }`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ablauf - Ausklappbar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedWorkflow(!expandedWorkflow)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    📋
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Ablauf</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        {selectedClient.workflow.filter(i => i.checked).length} von {selectedClient.workflow.length} erledigt
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{workflowProgress}%</span>
                    </div>
                  </div>
                </div>
                {expandedWorkflow ? (
                  <ChevronDown size={20} className="sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {expandedWorkflow && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                  <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                    {selectedClient.workflow.map(item => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                          <button
                            onClick={() => toggleItem('workflow', item.id)}
                            className={`mt-0.5 sm:mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              item.checked
                                ? 'bg-black border-black'
                                : 'border-gray-300 hover:border-gray-400 bg-white'
                            }`}
                          >
                            {item.checked && <Check size={14} className="sm:w-[18px] sm:h-[18px] text-white" strokeWidth={3} />}
                          </button>
                          
                          <span className={`text-base sm:text-lg font-bold mt-0.5 sm:mt-1 flex-shrink-0 ${
                            item.checked ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {item.num}
                          </span>
                          
                          <p className={`text-base sm:text-lg leading-relaxed flex-1 font-medium ${
                            item.checked ? 'line-through text-gray-300' : 'text-gray-900'
                          }`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = selectedClient.todos;
  
  const sectionTitle = 'To-Do';

  const sectionEmoji = '📝';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <button
              onClick={() => setView('sections')}
              className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              ← Zurück
            </button>
            <div className="h-6 sm:h-8 w-px bg-gray-200" />
            <div className="text-xl sm:text-2xl">{sectionEmoji}</div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{sectionTitle}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16">
        {view === 'todos' && (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">To-Dos</h3>
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTodoView('list')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-semibold ${
                    todoView === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">Liste</span>
                </button>
                <button
                  onClick={() => setTodoView('calendar')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-semibold ${
                    todoView === 'calendar' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar size={16} />
                  <span className="hidden sm:inline">Kalender</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowNewTodoModal(true)}
              className="w-full mb-6 sm:mb-8 md:mb-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border-2 border-dashed border-gray-300 hover:border-black hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 sm:gap-4 text-gray-600 hover:text-black group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-black group-hover:to-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all">
                <Plus size={24} className="sm:w-7 sm:h-7 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm sm:text-base md:text-lg font-bold">Neue Aufgabe hinzufügen</span>
              <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-600 transition-colors">Klicken zum Hinzufügen</span>
            </button>

            {showNewTodoModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewTodoModal(false)}>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Neue Aufgabe</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Aufgabe *</label>
                      <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Aufgabenbeschreibung..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Datum</label>
                        <input
                          type="date"
                          value={newTodoDate}
                          onChange={(e) => setNewTodoDate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Uhrzeit</label>
                        <input
                          type="time"
                          value={newTodoTime}
                          onChange={(e) => setNewTodoTime(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowNewTodoModal(false);
                          setNewTodo('');
                          setNewTodoDate('');
                          setNewTodoTime('');
                        }}
                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm sm:text-base font-semibold text-gray-700"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={() => {
                          addTodo();
                          setShowNewTodoModal(false);
                        }}
                        className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
                      >
                        <Plus size={18} />
                        Hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'todos' && todoView === 'calendar' ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                  <div key={day} className="text-center text-xs sm:text-sm font-bold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((date, index) => {
                  if (!date) {
                    return <div key={index} className="aspect-square" />;
                  }
                  const todosForDate = getTodosByDate()[date] || [];
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const isSelected = date === selectedCalendarDate;
                  
                  return (
                    <div
                      key={date}
                      onClick={() => setSelectedCalendarDate(date)}
                      className={`aspect-square rounded-lg border-2 p-1 sm:p-2 cursor-pointer transition-all ${
                        isToday 
                          ? 'border-blue-500 bg-blue-50' 
                          : isSelected
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-xs sm:text-sm font-bold mb-1 ${
                        isToday ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {new Date(date).getDate()}
                      </div>
                      {todosForDate.length > 0 && (
                        <div className="space-y-0.5">
                          {todosForDate.slice(0, 2).map(todo => (
                            <div
                              key={todo.id}
                              className={`text-[8px] sm:text-[10px] px-1 py-0.5 rounded truncate ${
                                todo.checked 
                                  ? 'bg-gray-300 text-gray-600 line-through' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                              title={todo.text}
                            >
                              {todo.time && `${todo.time} `}
                              {todo.text}
                            </div>
                          ))}
                          {todosForDate.length > 2 && (
                            <div className="text-[8px] sm:text-[10px] text-gray-500 font-bold">
                              +{todosForDate.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {selectedCalendarDate && getTodosByDate()[selectedCalendarDate] && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                  {formatDate(selectedCalendarDate)?.formatted || selectedCalendarDate}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {getTodosByDate()[selectedCalendarDate].map(todo => (
                    <div
                      key={todo.id}
                      className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all group flex items-start gap-3"
                    >
                      <button
                        onClick={() => toggleItem('todos', todo.id)}
                        className={`mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          todo.checked
                            ? 'bg-black border-black'
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                        }`}
                      >
                        {todo.checked && <Check size={12} className="sm:w-4 sm:h-4 text-white" strokeWidth={3} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        {todo.time && (
                          <div className="text-xs sm:text-sm font-bold text-purple-700 mb-1">
                            {todo.time} Uhr
                          </div>
                        )}
                        <p className={`text-sm sm:text-base font-medium ${
                          todo.checked ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}>
                          {todo.text}
                        </p>
                      </div>
                      {!todo.required && (
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
          {currentSection.map(item => {
            const dateInfo = item.date ? formatDate(item.date) : null;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8">
                  <button
                    onClick={() => toggleItem(view, item.id)}
                    className={`mt-0.5 sm:mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      item.checked
                        ? 'bg-black border-black'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {item.checked && <Check size={14} className="sm:w-[18px] sm:h-[18px] text-white" strokeWidth={3} />}
                  </button>
                  
                  {item.num && (
                    <span className={`text-base sm:text-lg font-bold mt-0.5 sm:mt-1 flex-shrink-0 ${
                      item.checked ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.num}
                    </span>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    {item.time && (
                      <div className="text-xs sm:text-sm font-bold text-purple-700 mb-1">
                        {item.time} Uhr
                      </div>
                    )}
                    <p className={`text-base sm:text-lg leading-relaxed font-medium ${
                      item.checked ? 'line-through text-gray-300' : 'text-gray-900'
                    }`}>
                      {item.text}
                    </p>
                    {dateInfo && (
                      <div className="mt-3 sm:mt-4">
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg sm:rounded-xl">
                          <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-purple-600 flex-shrink-0" />
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-purple-900">{dateInfo.weekday}</div>
                            <div className="text-xs sm:text-sm font-semibold text-purple-700">{dateInfo.formatted}</div>  
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {view === 'todos' && !item.required && (
                    <button
                      onClick={() => deleteTodo(item.id)}
                      className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      <X size={18} className="sm:w-5 sm:h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}

