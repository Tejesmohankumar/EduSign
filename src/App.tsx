@tailwind base;
@tailwind components;
@tailwind utilities;

const [isMobile, setIsMobile] = useState(false);
const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
const [showProfileModal, setShowProfileModal] = useState(false);
const [showHelpModal, setShowHelpModal] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);
const [userProfile, setUserProfile] = useState({
  name: 'Alex Johnson',
  email: 'alex.johnson@edusign.edu',
  role: 'Student',
  joinDate: '2024-01-15',
  avatar: '',
  phone: '+1 (555) 123-4567',
  address: '123 Education St, Learning City, LC 12345',
  emergencyContact: 'Sarah Johnson - +1 (555) 987-6543',
  preferredLanguage: 'American Sign Language (ASL)',
  learningGoals: 'Master advanced mathematics and science concepts',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    lessonReminders: true,
    progressUpdates: true
  },
  privacy: {
    profileVisibility: 'friends',
    shareProgress: true,
    allowMessages: true
  }
});
const [settings, setSettings] = useState({
  theme: 'light',
  language: 'en',
  autoSave: true,
  cameraQuality: 'high',
  signRecognitionSensitivity: 'medium',
  avatarSpeed: 'normal',
  soundEnabled: true,
  vibrationEnabled: true
});

const videoRef = useRef<HTMLVideoElement>(null);