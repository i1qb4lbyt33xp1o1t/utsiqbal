'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaShieldAlt, FaLock, FaBug, FaNetworkWired, FaCertificate, FaLaptopCode, FaBars, FaTimes, FaMoon, FaSun, FaStar, FaRobot, FaCloudSun } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

// Data Portfolio
const portfolioItems = [
  { id: 1, title: 'Penetration Testing Web App', shortDesc: 'Pengujian keamanan web.', description: 'Melakukan pengujian keamanan pada aplikasi web e-commerce dengan tools seperti Burp Suite dan OWASP ZAP.', date: 'Jan 2023', icon: <FaBug /> },
  { id: 2, title: 'Firewall Configuration', shortDesc: 'Konfigurasi firewall jaringan.', description: 'Mengatur firewall menggunakan pfSense untuk melindungi jaringan perusahaan dari serangan luar.', date: 'Jun 2023', icon: <FaNetworkWired /> },
  { id: 3, title: 'Malware Analysis', shortDesc: 'Analisis dan mitigasi malware.', description: 'Menganalisis malware jenis ransomware menggunakan IDA Pro dan menyusun laporan mitigasi.', date: 'Dec 2023', icon: <FaLock /> },
];

// Data Skills
const skills = [
  { name: 'Penetration Testing', icon: <FaBug className="text-cyan-400" /> },
  { name: 'Network Security', icon: <FaNetworkWired className="text-cyan-400" /> },
  { name: 'Malware Analysis', icon: <FaLock className="text-cyan-400" /> },
  { name: 'Ethical Hacking', icon: <FaShieldAlt className="text-cyan-400" /> },
];

// Data Certifications
const certifications = [
  { name: 'Certified Ethical Hacker (CEH)', date: 'Mar 2022' },
  { name: 'CompTIA Security+', date: 'Sep 2021' },
  { name: 'Cisco CyberOps Associate', date: 'Dec 2022' },
];

// Navbar Component
function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`p-4 fixed w-full top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-cyan-400 flex items-center">
          <FaShieldAlt className="mr-2" /> Muhammad Iqbal
        </Link>
        <button className="md:hidden text-cyan-400 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className={`md:flex md:space-x-6 ${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} md:bg-transparent p-4 md:p-0`}>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            <Link href="#home" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="#about" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="#skills" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Skills</Link>
            <Link href="#portfolio" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Portfolio</Link>
            <Link href="#certifications" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Certifications</Link>
            <Link href="#comments" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Comments</Link>
            <Link href="#ratings" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Ratings</Link>
            <Link href="#chatbot" className="hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>Chatbot</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main Page Component
export default function Home() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [weather, setWeather] = useState(null);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (!db) {
      console.error('Firestore db is not initialized');
      return;
    }

    const commentsQuery = query(collection(db, 'comments'), orderBy('date', 'desc'));
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    }, (error) => console.error('Error fetching comments:', error));

    const ratingsQuery = query(collection(db, 'ratings'), orderBy('date', 'desc'));
    const unsubscribeRatings = onSnapshot(ratingsQuery, (snapshot) => {
      const ratingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRatings(ratingsData);
    }, (error) => console.error('Error fetching ratings:', error));

    return () => {
      unsubscribeComments();
      unsubscribeRatings();
    };
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    try {
      await addDoc(collection(db, 'comments'), {
        name,
        comment,
        date: new Date().toISOString(),
      });
      setName('');
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRating) return;

    try {
      await addDoc(collection(db, 'ratings'), {
        rating: selectedRating,
        date: new Date().toISOString(),
      });
      setSelectedRating(0);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    try {
      if (chatInput.toLowerCase().includes('change theme to dark')) {
        setTheme('dark');
        setChatResponse('Theme changed to dark!');
      } else if (chatInput.toLowerCase().includes('change theme to light')) {
        setTheme('light');
        setChatResponse('Theme changed to light!');
      } else if (chatInput.toLowerCase().includes('weather in')) {
        const city = chatInput.split('weather in')[1]?.trim();
        if (city) {
          const response = await fetch(`/api/weather?city=${city}`);
          const data = await response.json();
          if (data.error) {
            setChatResponse(data.error);
          } else {
            setWeather({
              city: data.city,
              temp: data.temp,
              desc: data.desc,
            });
            setChatResponse(`Weather in ${data.city}: ${data.temp}°C, ${data.desc}`);
          }
        } else {
          setChatResponse('Please specify a city, e.g., "weather in Jakarta"');
        }
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: chatInput }),
        });
        const data = await response.json();
        setChatResponse(data.response);
      }
    } catch (error) {
      console.error('Error with chatbot:', error);
      setChatResponse('Sorry, something went wrong. Try again!');
    }
    setChatInput('');
  };

  const averageRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : 'N/A';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} relative`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <section id="home" className="pt-20 container mx-auto text-center py-10 px-4">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Image src="/profile.jpg" alt="Muhammad Iqbal" width={150} height={150} className={`rounded-full mx-auto mb-4 border-4 ${theme === 'dark' ? 'border-cyan-400' : 'border-cyan-600'}`} />
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 flex justify-center items-center">
            <FaLaptopCode className="mr-2" /> Muhammad Iqbal
          </h1>
          <p className={`text-md md:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cybersecurity Enthusiast</p>
        </motion.div>
      </section>

      <section id="about" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaShieldAlt className="mr-2" /> About Me
        </h2>
        <p className={`text-center max-w-2xl mx-auto text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Saya Muhammad Iqbal, seorang profesional di bidang cybersecurity dengan pengalaman dalam penetration testing, konfigurasi firewall, dan analisis malware. Saya bersemangat untuk melindungi sistem dari ancaman siber dan terus belajar tentang teknologi keamanan terbaru.</p>
      </section>

      <section id="skills" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaLaptopCode className="mr-2" /> Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className={`p-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {skill.icon}
              <span>{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="portfolio" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-cyan-400 flex justify-center items-center">
          <FaNetworkWired className="mr-2" /> Portfolio Timeline
        </h2>
        <div className="relative">
          {portfolioItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: index * 0.3 }} className={`flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'} md:w-1/2 md:mx-auto`}>
              <div onClick={() => setSelectedPortfolio(item)} className={`p-4 rounded-lg shadow-lg w-full md:w-1/2 hover:bg-opacity-90 transition cursor-pointer flex items-center space-x-3 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}>
                <span className="text-xl md:text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-cyan-400">{item.title}</h3>
                  <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.date}</p>
                  <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.shortDesc}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className={`absolute top-0 bottom-0 left-1/2 w-1 hidden md:block ${theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
        </div>
      </section>

      <section id="certifications" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaCertificate className="mr-2" /> Certifications
        </h2>
        <div className="max-w-2xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className={`p-4 rounded-lg shadow-lg mb-4 flex items-center space-x-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <FaCertificate className="text-cyan-400 text-xl md:text-2xl" />
              <div>
                <h3 className={`text-md md:text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{cert.name}</h3>
                <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="comments" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaShieldAlt className="mr-2" /> Leave a Comment
        </h2>
        <form onSubmit={handleCommentSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="mb-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:border-cyan-400`} />
          </div>
          <div className="mb-4">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your Comment" className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:border-cyan-400`} rows="4" />
          </div>
          <button type="submit" className="bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-500 transition text-sm md:text-base">Submit Comment</button>
        </form>
        <div className="max-w-2xl mx-auto">
          {comments.length > 0 ? comments.map((c) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`p-4 rounded-lg shadow-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-md md:text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{c.name}</h3>
              <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(c.date).toLocaleString()}</p>
              <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{c.comment}</p>
            </motion.div>
          )) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>

      <section id="ratings" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaStar className="mr-2" /> Rate This Website
        </h2>
        <form onSubmit={handleRatingSubmit} className="max-w-2xl mx-auto mb-8 text-center">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} size={30} className={`cursor-pointer transition-colors ${star <= (hoverRating || selectedRating) ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} onClick={() => setSelectedRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} />
            ))}
          </div>
          <button type="submit" className="bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-500 transition text-sm md:text-base">Submit Rating</button>
        </form>
        <div className="text-center">
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rating: {averageRating} (from {ratings.length} voters)</p>
        </div>
      </section>

      <section id="chatbot" className="container mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center flex justify-center items-center">
          <FaRobot className="mr-2" /> Chat with Hugging Face AI
        </h2>
        <form onSubmit={handleChatSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="mb-4">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything! (e.g., 'Change theme to light', 'Weather in Jakarta', 'Tell me about cybersecurity')"
              className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:border-cyan-400`}
              rows="4"
            />
          </div>
          <button type="submit" className="bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-500 transition text-sm md:text-base">Send</button>
        </form>
        {chatResponse && (
          <div className={`max-w-2xl mx-auto p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{chatResponse}</p>
          </div>
        )}
        {weather && (
          <div className={`max-w-2xl mx-auto mt-4 p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaCloudSun className="inline mr-2" /> Weather in {weather.city}: {weather.temp}°C, {weather.desc}
            </p>
          </div>
        )}
      </section>

      <button onClick={toggleTheme} className="fixed bottom-6 left-6 p-3 rounded-full bg-cyan-400 text-gray-900 hover:bg-cyan-500 transition shadow-lg z-50" aria-label="Toggle Theme">
        {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 px-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className={`p-6 rounded-lg max-w-lg w-full shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4 flex items-center">
              {selectedPortfolio.icon} <span className="ml-2">{selectedPortfolio.title}</span>
            </h3>
            <p className={`text-sm md:text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Date: {selectedPortfolio.date}</p>
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{selectedPortfolio.description}</p>
            <button onClick={() => setSelectedPortfolio(null)} className="mt-4 bg-cyan-400 text-gray-900 px-4 py-2 rounded hover:bg-cyan-500 transition text-sm md:text-base">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
