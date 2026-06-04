export const defaultProducts = [
  // Category: Electronics
  {
    id: "prod-elec-1",
    name: "AeroPulse Pro Wireless ANC Headphones",
    description: "Experience premium active noise cancellation with 40-hour battery life, high-fidelity dynamic drivers, and memory-foam acoustic cups.",
    category: "Electronics",
    price: 23999,
    offer: 15, // 15% off
    stock: 24,
    rating: 4.8,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Hybrid Active Noise Cancellation (ANC)",
      "40 Hours Playback Time (ANC off)",
      "Hi-Res Audio Certified",
      "Bluetooth 5.2 & Multipoint Connection"
    ]
  },
  {
    id: "prod-elec-2",
    name: "Nebula-X Portable 4K Smart Projector",
    description: "Cinematic entertainment anywhere you go. Built-in Android TV, 800 ANSI lumens brightness, auto-focus, and dual Harman Kardon speakers.",
    category: "Electronics",
    price: 39999,
    offer: 20, // 20% off
    stock: 8,
    rating: 4.9,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Native 4K HDR Resolution",
      "800 ANSI Lumens Brightness",
      "Android TV 11.0 Ecosystem",
      "HDMI, USB, WiFi 6, Bluetooth 5.0"
    ]
  },
  {
    id: "prod-elec-3",
    name: "PulseFit Active OLED Smartwatch",
    description: "Sleek biometric wearable tracking 24/7 heart rate, SpO2, sleep phases, and 120+ workout modes with an always-on 1.43-inch OLED screen.",
    category: "Electronics",
    price: 15199,
    offer: 10,
    stock: 35,
    rating: 4.6,
    reviewsCount: 245,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    specs: [
      "1.43\" Always-On AMOLED Display",
      "Dual-Band GPS Tracking",
      "5ATM Water Resistance",
      "Up to 14 Days Battery Life"
    ]
  },

  // Category: Security Devices
  {
    id: "prod-sec-1",
    name: "AegisEye Pro Solar Security Camera",
    description: "100% wireless outdoor surveillance. Solar powered, 2K color night vision, intelligent AI human detection, and instant siren defense.",
    category: "Security Devices",
    price: 11999,
    offer: 15,
    stock: 12,
    rating: 4.7,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Continuous Solar Charging Panel",
      "2K Ultra-HD Color Night Vision",
      "AI Person & Vehicle Detection",
      "No Monthly Fees Local SD Storage"
    ]
  },
  {
    id: "prod-sec-2",
    name: "Sentinel Smart Bio-Fingerprint Lock",
    description: "Revolutionize your entry point. Keyless unlocking via biometric fingerprint sensor, dynamic passcode keypad, remote app, or emergency physical keys.",
    category: "Security Devices",
    price: 18299,
    offer: 12,
    stock: 15,
    rating: 4.8,
    reviewsCount: 77,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
    specs: [
      "0.3s Biometric Access Speed",
      "Temporary One-Time PIN Generation",
      "Anti-peep Virtual Code Guard",
      "Full Activity Log & Tamper Alert"
    ]
  },
  {
    id: "prod-sec-3",
    name: "Fortify Smart Alarm Central Hub Kit",
    description: "All-in-one residential protection pack. Includes central cellular/WiFi hub, 4 window/door contact sensors, motion detector, and keyfob controls.",
    category: "Security Devices",
    price: 14299,
    offer: 5,
    stock: 9,
    rating: 4.5,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Dual WiFi & 4G LTE Backup",
      "Expandable up to 100 Sensors",
      "Instant Smart Notifications",
      "Optional Professional Monitoring"
    ]
  },

  // Category: Smart home devices
  {
    id: "prod-home-1",
    name: "AuraSync Dynamic Smart LED Strip",
    description: "Elevate your ambient mood. 16 million colors with Addressable Neon Dreamcolor effects that react seamlessly to music, PC audio, or TV screens.",
    category: "Smart home devices",
    price: 4699,
    offer: 15,
    stock: 50,
    rating: 4.4,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Individually Addressable (ARGB) LEDs",
      "Audio Sync via Ambient Microphone",
      "App, Alexa & Google Home Control",
      "10m Cuttable Silicone Tube"
    ]
  },
  {
    id: "prod-home-2",
    name: "EcoFlow Smart Energy Thermostat",
    description: "Smarter heating and cooling. Integrates room occupancy sensors and weather reports to dynamically optimize your home thermal comfort and energy bill.",
    category: "Smart home devices",
    price: 15899,
    offer: 8,
    stock: 0,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Save Up to 26% on HVAC Energy Costs",
      "Smart Presence & Occupancy Sensing",
      "Comprehensive Weekly Energy Reports",
      "Voice Activated via Siri, Alexa, Google"
    ]
  },
  {
    id: "prod-home-3",
    name: "HydroSense Smart Auto-Shutoff Water Valve",
    description: "Prevent catastrophic floods. Automatically shuts off the main water line when paired wireless sensors detect a leak anywhere in the house.",
    category: "Smart home devices",
    price: 10299,
    offer: 0,
    stock: 14,
    rating: 4.9,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Heavy-Duty Motorized Brass Ball Valve",
      "Sub-second Automatic Shutoff Speed",
      "Built-in Pipe Freeze Risk Warning",
      "Manual Handwheel Override Control"
    ]
  },

  // Category: Toys
  {
    id: "prod-toy-1",
    name: "RoboQuest Programmable STEM Coding Robot",
    description: "Inspire future scientists. A comprehensive modular crawler robot kit with ultrasonic navigation, tracking sensors, and intuitive block coding app.",
    category: "Toys",
    price: 7099,
    offer: 10,
    stock: 20,
    rating: 4.8,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Drag-and-Drop Scratch Coding Interface",
      "Equipped with 3 Ultrasonic Avoidance Sensors",
      "Full Rechargeable Li-Ion Battery Pack Included",
      "Robust Aluminum Alloy Modular Chassis"
    ]
  },
  {
    id: "prod-toy-2",
    name: "Mach-5 RC Brushless 4WD Speed Buggy",
    description: "Exhilarating speed on all terrains. Brushless electric motor pushing speeds over 45 km/h, featuring oil-filled metal shocks and impact casing.",
    category: "Toys",
    price: 9499,
    offer: 15,
    stock: 11,
    rating: 4.7,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80",
    specs: [
      "2847 High-Torque Brushless Motor",
      "Speeds up to 45km/h / 28mph",
      "2.4GHz Proportional Control Radio",
      "Up to 25 Minutes Run Time per Battery"
    ]
  },
  {
    id: "prod-toy-3",
    name: "AstroGlow Smart Aurora Star Projector",
    description: "Turn any bedroom into a magical galaxy. Projects multi-colored nebula clouds, stars, and crescent moons with built-in white noise calming speaker.",
    category: "Toys",
    price: 3599,
    offer: 25,
    stock: 45,
    rating: 4.6,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=600&q=80",
    specs: [
      "14 Vivid Color Aurora Nebula Profiles",
      "8 In-built Nature White Noise Sounds",
      "Bluetooth Music Audio Speaker Sync",
      "Auto-Shutoff Safety Timer (1H / 2H)"
    ]
  },

  // Category: Computer Gadgets
  {
    id: "prod-gadg-1",
    name: "ApexGrip Ergonomic Split Keyboard",
    description: "Premium mechanical split layout keyboard. Hot-swappable tactile linear switches, dual OLED status screens, customized tenting base, and RGB.",
    category: "Computer Gadgets",
    price: 19899,
    offer: 10,
    stock: 6,
    rating: 4.9,
    reviewsCount: 73,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Ortholinear Split Keyboard Design",
      "Hot-Swappable Gateron Silent Brown Switches",
      "High Resolution Dual Info OLED Panels",
      "Full Custom QMK/VIA Key Remapping Support"
    ]
  },
  {
    id: "prod-gadg-2",
    name: "OmniDock 12-in-1 Thunderbolt 4 Dock",
    description: "Unlock complete workspace connectivity. Direct dual 4K 60Hz display support, 96W upstream charging, high-speed ethernet, and high frequency audio jacks.",
    category: "Computer Gadgets",
    price: 13499,
    offer: 0,
    stock: 18,
    rating: 4.7,
    reviewsCount: 44,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Dual 4K @ 60Hz or Single 8K @ 30Hz",
      "96W Dynamic Laptop Host Power Delivery",
      "3x Thunderbolt 4 Downstream High-Speed Ports",
      "SD 4.0 Card Reader & Gigabit RJ45 Lan"
    ]
  },
  {
    id: "prod-gadg-3",
    name: "Luminar Monitor Ambient RGB Light Bar",
    description: "Protect your vision and enhance your workstation. Smart desk screen lamp with asymmetric reflection design, auto-dimming sensor, and RGB backlight.",
    category: "Computer Gadgets",
    price: 6299,
    offer: 18,
    stock: 22,
    rating: 4.5,
    reviewsCount: 109,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Asymmetric Glare-Free Optical Design",
      "Automatic High-Precision Lux Brightness Sensor",
      "Rear-Facing Dynamic Ambient RGB Lights",
      "Wireless Control Desktop Dial Controller"
    ]
  },
  {
    id: "prod-cpp-1",
    name: "CP Plus 4MP Dome Security Camera",
    description: "High-definition 4MP indoor dome camera with smart night vision, 360-degree rotation, built-in mic, and motion detection alerts.",
    category: "Security Devices",
    price: 3200,
    offer: 15,
    stock: 45,
    rating: 4.8,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    specs: [
      "4MP Quad-HD Video Resolution",
      "Smart IR Night Vision up to 20m",
      "Built-in Audio Microphone",
      "H.265 High Efficiency Compression"
    ]
  },
  {
    id: "prod-cpp-2",
    name: "CP Plus 4MP Bullet Security Camera",
    description: "Heavy-duty outdoor bullet camera. IP67 weatherproof design, long range night vision, and robust aluminum protection case.",
    category: "Security Devices",
    price: 3600,
    offer: 18,
    stock: 30,
    rating: 4.7,
    reviewsCount: 114,
    image: "https://images.unsplash.com/photo-1558002038-04f227b6ed41?auto=format&fit=crop&w=600&q=80",
    specs: [
      "4MP Outdoor Clear Capture",
      "IP67 Weatherproof Rating",
      "Up to 30m IR Range",
      "Supports PoE & Wide Dynamic Range"
    ]
  },
  {
    id: "prod-cpp-3",
    name: "CP Plus 4 Channel Network DVR",
    description: "Professional digital video recorder supporting 4 analog/digital channels. Easy HDMI/VGA local output, mobile remote monitoring, and SATA port.",
    category: "Security Devices",
    price: 4800,
    offer: 10,
    stock: 20,
    rating: 4.6,
    reviewsCount: 82,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    specs: [
      "4-Channel Video Input",
      "Supports 1 SATA HDD up to 8TB",
      "Real-time Mobile App View",
      "Dual-stream Video Compression"
    ]
  },
  {
    id: "prod-cpp-4",
    name: "CP Plus 6 Channel Network DVR",
    description: "Expanded 6-channel surveillance Hub. Features H.265+ smart stream, high definition recording on all ports, and AI face indexing support.",
    category: "Security Devices",
    price: 5600,
    offer: 12,
    stock: 15,
    rating: 4.8,
    reviewsCount: 63,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    specs: [
      "6-Channel Dynamic Recording",
      "AI Smart Motion Detection+",
      "HDMI/VGA Simultaneous Output",
      "H.265+ Video Save Compression"
    ]
  },
  {
    id: "prod-cpp-5",
    name: "CP Plus Solar AI Security Camera",
    description: "100% cable-free independent solar security camera. Built-in solar charger, high capacity battery storage, 4G SIM slot, and active siren defense.",
    category: "Security Devices",
    price: 7200,
    offer: 20,
    stock: 10,
    rating: 4.9,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Continuous Solar Power Inflow",
      "4G LTE Wireless SIM Connect",
      "PIR Human Detection & Sirens",
      "Color Night Vision with Spotlights"
    ]
  },
  {
    id: "prod-cpp-6",
    name: "CP Plus Advanced AI Dome Camera",
    description: "Cutting-edge dome camera featuring deep learning human and vehicle recognition, smart autofocus, starlight color sensor, and two-way talk intercom.",
    category: "Security Devices",
    price: 8400,
    offer: 25,
    stock: 12,
    rating: 4.9,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    specs: [
      "Advanced Deep Learning AI",
      "Starlight Full Color Sensor",
      "Clear Two-Way Talk Intercom",
      "Auto Focus motorized lens"
    ]
  }
];

export const initialProducts = [];

export const CATEGORIES = [
  "All",
  "Electronics",
  "Security Devices",
  "Smart home devices",
  "Toys",
  "Computer Gadgets"
];
