import React, { useState, useEffect } from 'react';
import { useAuth } from 'C:/Users/Asma/Desktop/ProjetCalendrier/client/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exams');
  const [state, setState] = useState({
    exams: [],
    rooms: [],
    proctors: [],
    loading: true,
    error: '',
    filters: {
      date: '',
      subject: '',
      room: ''
    }
  });

  // Form states
  const [forms, setForms] = useState({
    exam: {
      subject: '',
      date: '',
      duration: 90,
      roomId: '',
      proctorId: ''
    },
    room: {
      name: '',
      capacity: 30
    },
    notification: {
      message: '',
      recipients: 'all'
    }
  });

  // Fetch data on mount and tab change
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setState(prev => ({...prev, loading: true}));
        
        const endpoints = {
          exams: '/api/exams',
          rooms: '/api/rooms',
          proctors: '/api/users/proctors'
        };
        
        const responses = await Promise.all(Object.values(endpoints).map(url => api.get(url)));
        
        setState({
          exams: responses[0].data.data.exams,
          rooms: responses[1].data.data.rooms,
          proctors: responses[2].data.data.proctors,
          loading: false,
          error: ''
        });
        
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || 'Erreur de chargement'
        }));
      }
    };

    fetchData();
  }, [activeTab, user, navigate]);

  // Handler for exam form submission
  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/exams', forms.exam);
      
      if (data.status === 'success') {
        setState(prev => ({
          ...prev,
          exams: [...prev.exams, data.data.exam],
          error: ''
        }));
        
        setForms(prev => ({
          ...prev,
          exam: {
            subject: '',
            date: '',
            duration: 90,
            roomId: '',
            proctorId: ''
          }
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Erreur lors de la création'
      }));
    }
  };

  // Advanced exam duplication with date adjustment
  const duplicateExam = (exam, daysToAdd = 7) => {
    const newDate = new Date(exam.date);
    newDate.setDate(newDate.getDate() + daysToAdd);
    
    setForms(prev => ({
      ...prev,
      exam: {
        ...exam,
        date: newDate.toISOString().slice(0, 16),
        _id: undefined
      }
    }));
    
    setActiveTab('exams');
  };

  // Filter exams based on criteria
  const filteredExams = state.exams.filter(exam => {
    return (
      (!state.filters.date || exam.date.includes(state.filters.date)) &&
      (!state.filters.subject || exam.subject.toLowerCase().includes(state.filters.subject.toLowerCase())) &&
      (!state.filters.room || exam.room?._id === state.filters.room)
    );
  });

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de Bord Administrateur</h1>
          <div className="user-info">
            <span>Connecté en tant que: <strong>{user?.firstName} ({user?.role})</strong></span>
            <button onClick={logout} className="logout-btn">
              Déconnexion
            </button>
          </div>
        </div>
        
        <nav className="dashboard-nav">
          {['exams', 'rooms', 'proctors', 'notifications'].map(tab => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </nav>
      </header>

      <div className="dashboard-content">
        {state.error && (
          <div className="error-alert">
            {state.error}
          </div>
        )}

        {state.loading ? (
          <div className="loading-indicator">
            Chargement en cours...
          </div>
        ) : (
          <>
            {activeTab === 'exams' && (
              <ExamManagement
                exams={filteredExams}
                rooms={state.rooms}
                proctors={state.proctors}
                formData={forms.exam}
                onFormChange={(e) => setForms({
                  ...forms,
                  exam: {
                    ...forms.exam,
                    [e.target.name]: e.target.value
                  }
                })}
                onSubmit={handleExamSubmit}
                onDelete={handleDeleteExam}
                onDuplicate={duplicateExam}
                filters={state.filters}
                onFilterChange={(e) => setState({
                  ...state,
                  filters: {
                    ...state.filters,
                    [e.target.name]: e.target.value
                  }
                })}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomManagement
                rooms={state.rooms}
                formData={forms.room}
                onFormChange={(e) => setForms({
                  ...forms,
                  room: {
                    ...forms.room,
                    [e.target.name]: e.target.value
                  }
                })}
                onSubmit={handleRoomSubmit}
              />
            )}

            {activeTab === 'proctors' && (
              <ProctorManagement 
                proctors={state.proctors}
                exams={state.exams}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationCenter
                formData={forms.notification}
                onFormChange={(e) => setForms({
                  ...forms,
                  notification: {
                    ...forms.notification,
                    [e.target.name]: e.target.value
                  }
                })}
                onSubmit={sendNotifications}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Composants séparés pour chaque section
const ExamManagement = ({ exams, rooms, proctors, formData, onFormChange, onSubmit, onDelete, onDuplicate, filters, onFilterChange }) => {
  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestion des Examens</h2>
        <div className="filters">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={onFilterChange}
            placeholder="Filtrer par date"
          />
          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={onFilterChange}
            placeholder="Filtrer par matière"
          />
          <select
            name="room"
            value={filters.room}
            onChange={onFilterChange}
          >
            <option value="">Toutes les salles</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-container">
        <h3>{formData._id ? 'Modifier Examen' : 'Ajouter Nouvel Examen'}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Matière:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={onFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date et Heure:</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={onFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Durée (minutes):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={onFormChange}
                min="30"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Salle:</label>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={onFormChange}
                required
              >
                <option value="">Sélectionner une salle</option>
                {rooms.map(room => (
                  <option key={room._id} value={room._id}>
                    {room.name} (Capacité: {room.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Surveillant:</label>
            <select
              name="proctorId"
              value={formData.proctorId}
              onChange={onFormChange}
              required
            >
              <option value="">Sélectionner un surveillant</option>
              {proctors.map(proctor => (
                <option key={proctor._id} value={proctor._id}>
                  {proctor.firstName} {proctor.lastName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            {formData._id ? 'Mettre à jour' : 'Créer Examen'}
          </button>
        </form>
      </div>

      <div className="list-container">
        <h3>Examens Programmes</h3>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Date/Heure</th>
                <th>Durée</th>
                <th>Salle</th>
                <th>Surveillant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map(exam => (
                  <tr key={exam._id}>
                    <td>{exam.subject}</td>
                    <td>{new Date(exam.date).toLocaleString('fr-FR')}</td>
                    <td>{exam.duration} min</td>
                    <td>{exam.room?.name || '-'}</td>
                    <td>{exam.proctor?.firstName || '-'} {exam.proctor?.lastName || '-'}</td>
                    <td className="actions">
                      <button 
                        onClick={() => duplicateExam(exam)}
                        className="action-btn duplicate"
                        title="Dupliquer"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(exam._id)}
                        className="action-btn delete"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    Aucun examen trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// (Ajoutez les composants RoomManagement, ProctorManagement et NotificationCenter de manière similaire)

export default AdminDashboard;