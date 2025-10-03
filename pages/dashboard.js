import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dreams, setDreams] = useState([]);
  const [newDream, setNewDream] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    mood: "neutral",
    tags: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [editingDream, setEditingDream] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    // Load dreams from localStorage
    const savedDreams = localStorage.getItem('dreams');
    if (savedDreams) {
      setDreams(JSON.parse(savedDreams));
    }
  }, [status, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dream = {
      ...newDream,
      id: editingDream ? editingDream.id : Date.now(),
      tags: newDream.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    let updatedDreams;
    if (editingDream) {
      // Update existing dream
      updatedDreams = dreams.map(d => d.id === editingDream.id ? dream : d);
    } else {
      // Add new dream
      updatedDreams = [...dreams, dream];
    }
    
    setDreams(updatedDreams);
    localStorage.setItem('dreams', JSON.stringify(updatedDreams));
    setNewDream({
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      mood: "neutral",
      tags: ""
    });
    setShowForm(false);
    setEditingDream(null);
  };

  const deleteDream = (id) => {
    const updatedDreams = dreams.filter(dream => dream.id !== id);
    setDreams(updatedDreams);
    localStorage.setItem('dreams', JSON.stringify(updatedDreams));
  };

  const editDream = (dream) => {
    setEditingDream(dream);
    setNewDream({
      title: dream.title,
      description: dream.description,
      date: dream.date,
      mood: dream.mood,
      tags: dream.tags.join(', ')
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingDream(null);
    setNewDream({
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      mood: "neutral",
      tags: ""
    });
    setShowForm(false);
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      scared: '😨',
      excited: '🤩',
      confused: '😕',
      peaceful: '😌',
      neutral: '😐'
    };
    return emojis[mood] || '😐';
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const totalDreams = dreams.length;
  const thisWeek = dreams.filter(dream => {
    const dreamDate = new Date(dream.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dreamDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Dream Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {session.user.name}!</p>
          </div>
          <button
            onClick={() => showForm ? cancelEdit() : setShowForm(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? "Cancel" : "Add New Dream"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Dreams</h3>
            <p className="text-3xl font-bold text-secondary-600">{totalDreams}</p>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
            <p className="text-3xl font-bold text-primary-600">{thisWeek}</p>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average/Week</h3>
            <p className="text-3xl font-bold text-orange-600">
              {totalDreams > 0 ? (totalDreams / Math.max(1, Math.ceil((Date.now() - new Date(dreams[0]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 7)))).toFixed(1) : "0"}
            </p>
          </div>
        </div>

        {/* Add/Edit Dream Form */}
        {showForm && (
          <div className="card mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {editingDream ? "Edit Dream" : "Record Your Dream"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dream Title</label>
                <input
                  type="text"
                  value={newDream.title}
                  onChange={(e) => setNewDream({...newDream, title: e.target.value})}
                  required
                  className="input-field"
                  placeholder="Give your dream a title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newDream.description}
                  onChange={(e) => setNewDream({...newDream, description: e.target.value})}
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Describe your dream in detail..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newDream.date}
                    onChange={(e) => setNewDream({...newDream, date: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                  <select
                    value={newDream.mood}
                    onChange={(e) => setNewDream({...newDream, mood: e.target.value})}
                    className="input-field"
                  >
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😢 Sad</option>
                    <option value="scared">😨 Scared</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="confused">😕 Confused</option>
                    <option value="peaceful">😌 Peaceful</option>
                    <option value="neutral">😐 Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newDream.tags}
                    onChange={(e) => setNewDream({...newDream, tags: e.target.value})}
                    className="input-field"
                    placeholder="flying, water, family (comma separated)"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingDream ? "Update Dream" : "Save Dream"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dreams List */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Your Dreams ({totalDreams})</h3>
          </div>
          {dreams.length === 0 ? (
            <div className="card text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No dreams recorded yet</h4>
              <p className="text-gray-600 mb-4">Start your dream journal by recording your first dream!</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                Add Your First Dream
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {dreams.slice().reverse().map((dream) => (
                <div key={dream.id} className="card hover:shadow-medium transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{dream.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(dream.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          {getMoodEmoji(dream.mood)} {dream.mood}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editDream(dream)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDream(dream.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{dream.description}</p>
                  {dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {dream.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="tag"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
