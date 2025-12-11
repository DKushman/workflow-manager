import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Folder, Check, X, Calendar, Download, Upload, Archive, Trash2, Image as ImageIcon } from 'lucide-react';

export default function WebDevWorkflow() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [view, setView] = useState('clients');
  const [newClientName, setNewClientName] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState('');

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
  };

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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-2 sm:mb-4 text-gray-900">Projekte</h2>
            <p className="text-gray-400 text-base sm:text-lg">Verwalte deine Kundenprojekte und Workflows</p>
          </div>
          
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 mb-6 sm:mb-8 md:mb-12 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addClient()}
                placeholder="Neues Projekt erstellen..."
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 md:py-5 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={addClient}
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-black text-white rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-medium shadow-lg shadow-black/10"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                Erstellen
              </button>
            </div>
          </div>

          {activeClients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {activeClients.map(client => {
                const totalTasks = client.guidelines.length + client.workflow.length + client.todos.length;
                const completedTasks = client.guidelines.filter(g => g.checked).length + 
                                      client.workflow.filter(w => w.checked).length + 
                                      client.todos.filter(t => t.checked).length;
                const progress = Math.round((completedTasks / totalTasks) * 100);

                return (
                  <div
                    key={client.id}
                    className="bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all group overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${colorClasses[client.color]}`} />
                    <div className="p-4 sm:p-6 md:p-8">
                      <div 
                        onClick={() => {
                          setSelectedClient(client);
                          setView('sections');
                        }}
                        className="cursor-pointer mb-4 sm:mb-6"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative group/image">
                              {client.profileImage ? (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                                  <img 
                                    src={client.profileImage} 
                                    alt={client.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                  <Folder size={20} className="sm:w-6 sm:h-6 text-gray-700" />
                                </div>
                              )}
                              <label 
                                onClick={(e) => e.stopPropagation()}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer transition-opacity"
                              >
                                <ImageIcon size={16} className="text-white" />
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
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-1 truncate">{client.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {completedTasks} von {totalTasks} abgeschlossen
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Fortschritt</span>
                            <span className="font-semibold text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[client.color]} transition-all duration-500`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveClient(client.id);
                          }}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600"
                        >
                          <Archive size={14} className="sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Archivieren</span>
                          <span className="sm:hidden">Archiv</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Projekt "${client.name}" wirklich löschen?`)) {
                              deleteClient(client.id);
                            }
                          }}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 hover:bg-red-100 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          Löschen
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
              <h3 className="text-xl sm:text-2xl font-light mb-4 sm:mb-6 text-gray-400">Archiviert</h3>
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
                <h1 className="text-xl sm:text-2xl font-medium text-gray-900">{selectedClient.name}</h1>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {completedTasks} / {totalTasks} abgeschlossen
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-12 py-16">
          <div className="mb-12">
            <h2 className="text-5xl font-light tracking-tight mb-4 text-gray-900">Bereiche</h2>
            <p className="text-gray-400 text-lg">Wähle einen Workflow-Bereich</p>
          </div>

          <div className="grid gap-6">
            {[
              { key: 'guidelines', title: 'Frontend Guidelines', emoji: '⚙️', items: selectedClient.guidelines, desc: 'Best Practices für Frontend-Entwicklung' },
              { key: 'workflow', title: 'Ablauf', emoji: '📋', items: selectedClient.workflow, desc: 'Projektmanagement und Planung' },
              { key: 'todos', title: 'To-Do', emoji: '✓', items: selectedClient.todos, desc: 'Aufgaben und Deadlines' }
            ].map(section => {
              const progress = getProgress(section.items);
              return (
                <div
                  key={section.key}
                  onClick={() => setView(section.key)}
                  className="bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="p-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-4xl">
                        {section.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-medium text-gray-900 mb-2">{section.title}</h3>
                        <p className="text-gray-400">{section.desc}</p>
                      </div>
                      <ChevronRight size={28} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Fortschritt</span>
                        <span className="text-2xl font-light text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[selectedClient.color]} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-400">
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

  const currentSection = view === 'guidelines' ? selectedClient.guidelines :
                         view === 'workflow' ? selectedClient.workflow :
                         selectedClient.todos;
  
  const sectionTitle = view === 'guidelines' ? 'Frontend Guidelines' :
                       view === 'workflow' ? 'Ablauf' :
                       'To-Do';

  const sectionEmoji = view === 'guidelines' ? '⚙️' :
                       view === 'workflow' ? '📋' :
                       '✓';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-12 py-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView('sections')}
              className="text-gray-400 hover:text-black transition-colors flex items-center gap-2"
            >
              ← Zurück
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-2xl">{sectionEmoji}</div>
            <h1 className="text-2xl font-medium text-gray-900">{sectionTitle}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-16">
        {view === 'todos' && (
          <div className="bg-white rounded-3xl p-10 mb-12 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-medium mb-6 text-gray-900">Neue Aufgabe</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Aufgabenbeschreibung..."
                className="w-full px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-base text-gray-900 placeholder:text-gray-400"
              />
              <div className="flex gap-4">
                <input
                  type="date"
                  value={newTodoDate}
                  onChange={(e) => setNewTodoDate(e.target.value)}
                  className="flex-1 px-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-base text-gray-900"
                />
                <button
                  onClick={addTodo}
                  className="px-10 py-5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-3 text-base font-medium"
                >
                  <Plus size={20} />
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {currentSection.map(item => {
            const dateInfo = item.date ? formatDate(item.date) : null;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-6 p-8">
                  <button
                    onClick={() => toggleItem(view, item.id)}
                    className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      item.checked
                        ? 'bg-black border-black'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {item.checked && <Check size={18} className="text-white" strokeWidth={3} />}
                  </button>
                  
                  {item.num && (
                    <span className={`text-lg font-medium mt-1 flex-shrink-0 ${
                      item.checked ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {item.num}
                    </span>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg leading-relaxed ${
                      item.checked ? 'line-through text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.text}
                    </p>
                    {dateInfo && (
                      <div className="mt-4">
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
                          <Calendar size={18} className="text-purple-600" />
                          <div>
                            <div className="text-sm font-semibold text-purple-900">{dateInfo.weekday}</div>
                            <div className="text-sm text-purple-600">{dateInfo.formatted}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {view === 'todos' && !item.required && (
                    <button
                      onClick={() => deleteTodo(item.id)}
                      className="p-3 hover:bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

