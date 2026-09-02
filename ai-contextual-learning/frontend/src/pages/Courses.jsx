import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Library, PlayCircle, ChevronDown, ChevronUp, Clock, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

import { nptelCourses } from '../data/courses';

const Courses = () => {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const navigate = useNavigate();
  const { setCurrentVideoId, setIsIngested, setTranscriptChunks, setChatMessages, addToHistory } = useAppState();

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const playVideo = (video, course) => {
    // Reset global state for the new video
    setCurrentVideoId(video.id);
    setIsIngested(false);
    setTranscriptChunks([]);
    setChatMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: 'Hello! I am your contextual AI assistant. Ask me anything about the video!',
        timestamp: 'Just now'
      }
    ]);
    
    // Add to history
    addToHistory({
      ...video,
      courseTitle: course.title,
      courseImage: course.image,
      instructor: course.instructor
    });

    // Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Library className="w-6 h-6 text-emerald-400" />
              </div>
              My Courses
            </h1>
            <p className="text-slate-400 mt-2">Manage your enrolled NPTEL courses and continue learning.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {nptelCourses.map((course) => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                
                {/* Course Header / Card */}
                <div 
                  className="flex flex-col md:flex-row cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  {/* Thumbnail */}
                  <div className="md:w-64 h-40 md:h-auto bg-slate-800 relative shrink-0">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                      {course.videos.length} Lectures
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-bold text-slate-100">{course.title}</h2>
                        {expandedCourse === course.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.institute}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="text-blue-400 font-medium">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Video List */}
                {expandedCourse === course.id && (
                  <div className="border-t border-slate-800 bg-slate-900/50 p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 ml-2">Course Lectures</h3>
                    <div className="space-y-2">
                      {course.videos.map((video, index) => (
                        <div 
                          key={video.id}
                          onClick={() => playVideo(video, course)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 cursor-pointer group transition-colors border border-transparent hover:border-slate-700"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-slate-500 font-mono text-sm w-6 text-center">{index + 1}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                              <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                            </div>
                            <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{video.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {video.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Courses;
