import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../types/clinical';

interface TelehealthRoomModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  appointment,
  onClose,
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'chat'>('notes');
  const [sessionSeconds, setSessionSeconds] = useState(765); // 12:45
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Encrypted Chamber #NV-4491-EDT initialized.', time: '10:30 AM' },
    { sender: appointment.doctorName, text: 'Hello Alexander, I have your latest telemetry vitals and headache logs loaded.', time: '10:31 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request actual user webcam or fall back gracefully
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !videoOff) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraStreamActive(true);
          }
        })
        .catch(() => {
          setCameraStreamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoOff]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: 'Alexander (You)',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Doctor auto response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: appointment.doctorName,
          text: 'Understood. Reviewing your cervicogenic tension indices against the smart patch telemetry right now.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001428]/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#001428] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#0f2942]">
        {/* Top Video Header */}
        <header className="h-16 px-4 sm:px-6 bg-[#001428] border-b border-[#0f2942] flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a187] animate-pulse"></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm sm:text-base">
                  Encrypted Telehealth Consultation
                </span>
                <span className="px-2 py-0.2 rounded bg-[#0f2942] text-[#7cf8da] text-[10px] font-bold">
                  1080p WebRTC
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {appointment.doctorTitle} • Session Ref #NV-4491-EDT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Session Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0f2942] text-xs font-mono font-bold text-[#7cf8da]">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>{formatTimer(sessionSeconds)} / 45:00</span>
            </div>

            {/* End Call Button */}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">call_end</span>
              <span>End Call</span>
            </button>
          </div>
        </header>

        {/* Video Canvas & Side Panel Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-black">
          {/* Main Video Stage (lg:col-span-8 or 9) */}
          <div className="lg:col-span-8 xl:col-span-9 relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#001428] via-[#000e1c] to-black overflow-hidden">
            {/* Doctor Primary Video View */}
            <div className="relative w-full h-full max-h-[620px] rounded-xl overflow-hidden shadow-2xl border border-[#0f2942] flex items-center justify-center bg-[#07131f]">
              <img
                src={appointment.doctorImage}
                alt={appointment.doctorName}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Doctor Speaking Badge & Audio Waveform */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#001428]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#00a187] animate-pulse"></span>
                <span className="text-xs font-bold">{appointment.doctorName}</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-[#7cf8da] animate-pulse rounded-full"></span>
                  <span className="w-1 h-4 bg-[#7cf8da] animate-pulse delay-75 rounded-full"></span>
                  <span className="w-1 h-2 bg-[#7cf8da] animate-pulse delay-150 rounded-full"></span>
                </div>
              </div>

              {/* Vitals Telemetry HUD Overlay */}
              <div className="absolute top-4 right-4 bg-[#001428]/85 backdrop-blur-md p-2.5 rounded-lg border border-white/10 text-white text-xs flex flex-col gap-1 shadow-lg">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Patient Telemetry Stream
                </span>
                <div className="flex items-center gap-3 font-mono font-bold text-[#7cf8da]">
                  <span>HR: 68 bpm</span>
                  <span>BP: 118/76</span>
                  <span>SpO2: 99%</span>
                </div>
              </div>

              {/* Patient Self Video PiP View */}
              <div className="absolute bottom-4 right-4 w-36 sm:w-48 h-28 sm:h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex items-center justify-center">
                {videoOff ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-[24px]">videocam_off</span>
                    <span>Camera Off</span>
                  </div>
                ) : cameraStreamActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#0055c9] flex items-center justify-center font-bold text-xs mb-1">
                      AW
                    </div>
                    <span className="text-[11px] font-bold">Alexander Wright</span>
                    <span className="text-[9px] text-[#7cf8da]">Patient Stream Active</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
                  You {micMuted ? '(Muted)' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Right Clinical Dossier / Chat Side Panel */}
          <div className="lg:col-span-4 xl:col-span-3 bg-[#001428] border-l border-[#0f2942] flex flex-col h-full overflow-hidden text-white">
            {/* Tab Header */}
            <div className="flex border-b border-[#0f2942]">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-[#7cf8da] text-[#7cf8da] bg-[#0f2942]/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Clinical Dossier
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'border-b-2 border-[#7cf8da] text-[#7cf8da] bg-[#0f2942]/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In-Call Chat ({chatMessages.length})
              </button>
            </div>

            {/* Dossier Tab Content */}
            {activeTab === 'notes' && (
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#0f2942] border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#7cf8da] tracking-wider">
                    Primary Consultation Objective
                  </span>
                  <p className="text-slate-200 leading-relaxed">{appointment.clinicalFocus}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#0f2942] border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#7cf8da] tracking-wider">
                    Pre-Visit Triage Summary
                  </span>
                  <div className="space-y-1 text-slate-300">
                    <p>• <strong>Impression:</strong> Tension-Type Cephalea with Cervicogenic Component</p>
                    <p>• <strong>Pain Scale:</strong> 6/10 Moderate-Severe (NRS)</p>
                    <p>• <strong>Duration:</strong> 2 - 3 Days</p>
                    <p>• <strong>Triggers:</strong> High screen time, sleep deficit, high pollen index (68 AQI)</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0f2942] border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#7cf8da] tracking-wider">
                    Physician Pre-authorization
                  </span>
                  <p className="text-slate-300">
                    Blue Cross Blue Shield verified. Active copay $25.00 auto-cleared on file.
                  </p>
                </div>
              </div>
            )}

            {/* Chat Tab Content */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-[#7cf8da]">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div className="p-2 rounded bg-[#0f2942] text-slate-200 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="pt-3 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type message to doctor..."
                    className="flex-1 bg-[#0f2942] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none border border-white/10"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-[#0055c9] text-white text-xs font-bold hover:bg-[#036cfb] cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Video Control Bar Footer */}
        <footer className="h-18 px-6 bg-[#001428] border-t border-[#0f2942] flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Room ID: </span>
            <span className="font-mono text-xs text-[#7cf8da] font-bold">NV-4491-EDT</span>
          </div>

          {/* Central Media Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMicMuted(prev => !prev)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                micMuted ? 'bg-[#ba1a1a] text-white' : 'bg-[#0f2942] hover:bg-slate-700 text-white'
              }`}
              title={micMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {micMuted ? 'mic_off' : 'mic'}
              </span>
            </button>

            <button
              onClick={() => setVideoOff(prev => !prev)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                videoOff ? 'bg-[#ba1a1a] text-white' : 'bg-[#0f2942] hover:bg-slate-700 text-white'
              }`}
              title={videoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {videoOff ? 'videocam_off' : 'videocam'}
              </span>
            </button>

            <button
              onClick={() => alert('Screen sharing initialized. Presenting diagnostic chart.')}
              className="w-11 h-11 rounded-full bg-[#0f2942] hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Share Screen"
            >
              <span className="material-symbols-outlined text-[20px]">screen_share</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 h-11 rounded-full bg-[#ba1a1a] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              <span>Leave Chamber</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-[#00a187] text-[16px]">lock</span>
            <span className="hidden sm:inline">HIPAA Certified</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
