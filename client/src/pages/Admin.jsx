import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';


const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [proctors, setProctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [examForm, setExamForm] = useState({
    subject: '',
    date: '',
    duration: '',
    roomId: '',
    proctorId: ''
  });
  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, roomsRes, proctorsRes] = await Promise.all([
        api.get('/api/exams'),
        api.get('/api/rooms'),
        api.get('/api/users/proctors')
      ]);
      setExams(examsRes.data);
      setRooms(roomsRes.data);
      setProctors(proctorsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/exams', examForm);
      setExamForm({
        subject: '',
        date: '',
        duration: '',
        roomId: '',
        proctorId: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/rooms', roomForm);
      setRoomForm({
        name: '',
        capacity: ''
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.delete(`/api/exams/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete exam');
      }
    }
  };

  const handleDuplicateExam = async (exam) => {
    try {
      await api.post('/api/exams', {
        ...exam,
        date: new Date(new Date(exam.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 days
      });
      fetchData();
    } catch (err) {
      setError('Failed to duplicate exam');
    }
  };

  const sendNotifications = async () => {
    try {
      await api.post('/api/notifications/send');
      alert('Notifications sent successfully');
    } catch (err) {
      setError('Failed to send notifications');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user">
          <span>Welcome, {user?.firstName}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'exams' ? 'active' : ''} 
          onClick={() => setActiveTab('exams')}
        >
          Manage Exams
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''} 
          onClick={() => setActiveTab('rooms')}
        >
          Manage Rooms
        </button>
        <button 
          className={activeTab === 'proctors' ? 'active' : ''} 
          onClick={() => setActiveTab('proctors')}
        >
          Manage Proctors
        </button>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'exams' && (
              <div className="exams-section">
                <h2>Exam Management</h2>
                <form onSubmit={handleExamSubmit} className="admin-form">
                  <div className="form-group">
                    <label>Subject:</label>
                    <input
                      type="text"
                      value={examForm.subject}
                      onChange={(e) => setExamForm({...examForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date and Time:</label>
                    <input
                      type="datetime-local"
                      value={examForm.date}
                      onChange={(e) => setExamForm({...examForm, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes):</label>
                    <input
                      type="number"
                      value={examForm.duration}
                      onChange={(e) => setExamForm({...examForm, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room:</label>
                    <select
                      value={examForm.roomId}
                      onChange={(e) => setExamForm({...examForm, roomId: e.target.value})}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map(room => (
                        <option key={room._id} value={room._id}>
                          {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Proctor:</label>
                    <select
                      value={examForm.proctorId}
                      onChange={(e) => setExamForm({...examForm, proctorId: e.target.value})}
                      required
                    >
                      <option value="">Select a proctor</option>
                      {proctors.map(proctor => (
                        <option key={proctor._id} value={proctor._id}>
                          {proctor.firstName} {proctor.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="submit-btn">Add Exam</button>
                </form>

                <div className="exams-list">
                  <h3>Upcoming Exams</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Room</th>
                        <th>Proctor</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map(exam => (
                        <tr key={exam._id}>
                          <td>{exam.subject}</td>
                          <td>{new Date(exam.date).toLocaleString()}</td>
                          <td>{exam.duration} mins</td>
                          <td>{exam.room?.name}</td>
                          <td>{exam.proctor?.firstName} {exam.proctor?.lastName}</td>
                          <td>
                            <button 
                              onClick={() => handleDuplicateExam(exam)}
                              className="action-btn duplicate"
                            >
                              Duplicate
                            </button>
                            <button 
                              onClick={() => handleDeleteExam(exam._id)}
                              className="action-btn delete"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="rooms-section">
                <h2>Room Management</h2>
                <form onSubmit={handleRoomSubmit} className="admin-form">
                  <div className="form-group">
                    <label>Room Name:</label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity:</label>
                    <input
                      type="number"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">Add Room</button>
                </form>

                <div className="rooms-list">
                  <h3>Available Rooms</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(room => (
                        <tr key={room._id}>
                          <td>{room.name}</td>
                          <td>{room.capacity}</td>
                          <td>
                            {exams.some(e => e.room?._id === room._id) ? 
                              'Occupied' : 'Available'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'proctors' && (
              <div className="proctors-section">
                <h2>Proctor Management</h2>
                <div className="proctors-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Assigned Exams</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proctors.map(proctor => (
                        <tr key={proctor._id}>
                          <td>{proctor.firstName} {proctor.lastName}</td>
                          <td>{proctor.email}</td>
                          <td>{proctor.department}</td>
                          <td>
                            {exams.filter(e => e.proctor?._id === proctor._id).length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="admin-actions">
        <button 
          onClick={sendNotifications}
          className="notification-btn"
        >
          Send Notifications to All Users
        </button>
      </div>
    </div>
  );
};

export default Admin;