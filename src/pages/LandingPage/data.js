// Static content for the landing page.
// Kept here so the section components stay purely presentational.

import serviceSlideConsult from "../../assets/Service.png";
import serviceSlideVaccine from "../../assets/Vaccination.png";
import community1 from "../../assets/Image1.png";
import community2 from "../../assets/Image2.png";
import community3 from "../../assets/Image3.png";
import community4 from "../../assets/customer.jpg";
import community5 from "../../assets/Vaccination.png";
import community6 from "../../assets/Service.png";

export const COLORS = {
  heroBackground: "#FDF7DE",
  whyUsBackground: "#FFDED2",
};

export const HERO = {
  badge: "A community for every pet",
  title: "Every Pet in Your Community, Cared For",
  subtitle:
    "Track street and home animals — dogs, cats, horses, cows, hens and more. Share their stories anonymously, find trusted vets nearby, and get the care every pet deserves.",
  primaryCta: "Join the Community",
  secondaryCta: "Explore Pets",
  imageAlt: "Interactive 3D bone",
};

export const STATS = [
  { id: "pets", value: "24K+", label: "Pets Mapped" },
  { id: "communities", value: "60+", label: "Communities" },
  { id: "vets", value: "500+", label: "Verified Vets" },
  { id: "species", value: "15", label: "Species Tracked" },
];

// `icon` maps to an MUI icon inside Pillars.jsx.
export const PILLARS = [
  {
    id: "track",
    icon: "track",
    title: "Track Every Pet",
    desc: "From street strays to home companions, map and follow the wellbeing of all animals in your locality.",
  },
  {
    id: "community",
    icon: "community",
    title: "Anonymous Community",
    desc: "Share photos and stories of your beloved pets and connect with neighbours — privately and safely.",
  },
  {
    id: "vets",
    icon: "vets",
    title: "Find & Book Vets",
    desc: "Discover nearby veterinarians, check live availability and book appointments in a few taps.",
  },
  {
    id: "consult",
    icon: "consult",
    title: "Expert Consultations",
    desc: "Get guidance on nutrition, health and behaviour from certified professionals, anytime.",
  },
];

export const SPECIES = [
  { id: "dogs", emoji: "🐶", name: "Dogs" },
  { id: "cats", emoji: "🐱", name: "Cats" },
  { id: "horses", emoji: "🐴", name: "Horses" },
  { id: "cows", emoji: "🐮", name: "Cows" },
  { id: "hens", emoji: "🐔", name: "Hens" },
  { id: "goats", emoji: "🐐", name: "Goats" },
  { id: "rabbits", emoji: "🐰", name: "Rabbits" },
  { id: "birds", emoji: "🐦", name: "Birds" },
];

export const STEPS = [
  {
    id: "01",
    title: "Add a pet",
    desc: "Register your own companion or a street animal you care for. Stay completely anonymous if you prefer.",
  },
  {
    id: "02",
    title: "Track & share",
    desc: "Log health, vaccinations and everyday moments, then share photos with your community feed.",
  },
  {
    id: "03",
    title: "Get care",
    desc: "Book nearby vets, request consultations and access everything your pet needs in one place.",
  },
];

export const COMMUNITY = {
  body: "Thousands of pet lovers share their beloved companions every day — no names, no pressure, just pure love for animals. Every photo helps build a richer map of the pets around us.",
  images: [community1, community2, community3, community4, community5, community6],
};

export const INSIGHTS = {
  body: "Anonymised data from across the network turns everyday care into community-wide insight — helping shelters, vets and local bodies make better decisions for animals.",
  metrics: [
    { id: "vaccine", value: "82%", label: "Vaccination coverage tracked" },
    { id: "strays", value: "1.2K", label: "Strays reported & helped" },
    { id: "species", value: "15", label: "Species across the network" },
    { id: "checkups", value: "9K", label: "Check-ups booked this year" },
  ],
};

export const SERVICES = [
  {
    id: "1",
    title: "Health Consultation",
    desc: "One-on-one guidance with certified vets on nutrition, illness and preventive care for any animal.",
  },
  {
    id: "2",
    title: "Vaccination Tracking",
    desc: "Never miss a shot — automated reminders and digital records for every pet you care for.",
  },
  {
    id: "3",
    title: "Easy Booking",
    desc: "Find availability and book check-ups, grooming and emergencies in seconds, right from your phone.",
  },
  {
    id: "4",
    title: "Stray Care Support",
    desc: "Report, feed and coordinate care for street animals together with your local community.",
  },
];

export const SERVICE_SLIDES = [
  { label: "Consultation", image: serviceSlideConsult },
  { label: "Vaccination", image: serviceSlideVaccine },
];

export const VET = {
  title: "Are you a veterinarian?",
  body: "Join our network to reach pet owners in your area, manage appointments effortlessly and grow your practice.",
  cta: "Register as a Vet",
  points: [
    "Simple appointment scheduling",
    "A verified profile with reviews",
    "Reach your whole local community",
  ],
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Aayush Shrestha",
    role: "Cares for 3 street cats",
    quote:
      "I can finally keep track of the strays in my lane — their vaccinations, feeding and health, all in one place. The community even helps out.",
  },
  {
    id: 2,
    name: "Sneha Karki",
    role: "Dog & hen parent",
    quote:
      "Booking a vet used to be a hassle. Now I find someone nearby and book in seconds. Sharing photos anonymously is my favourite part.",
  },
  {
    id: 3,
    name: "Dr. Rohan Maharjan",
    role: "Veterinarian",
    quote:
      "The platform connects me directly with pet owners in my area. Managing appointments is effortless and my practice has grown.",
  },
];

export const FAQS = [
  {
    id: "q1",
    question: "Is sharing really anonymous?",
    answer:
      "Yes. You can share photos and track pets without revealing your identity. You control exactly what is public.",
  },
  {
    id: "q2",
    question: "Which animals can I add?",
    answer:
      "All of them — dogs, cats, horses, cows, hens, goats, rabbits, birds and more. Both home pets and street animals are welcome.",
  },
  {
    id: "q3",
    question: "How do I find a vet near me?",
    answer:
      "Browse verified veterinarians in your locality, view their availability and reviews, and book an appointment in a few taps.",
  },
  {
    id: "q4",
    question: "I'm a veterinarian — how do I join?",
    answer:
      "Register as a vet to create a verified profile, manage your bookings and reach pet owners across your community.",
  },
  {
    id: "q5",
    question: "Does it cost anything?",
    answer:
      "Joining the community, tracking pets and sharing are free. Some professional services and consultations may carry a fee.",
  },
];

export const NEWSLETTER = {
  title: "Be part of a kinder community",
  subtitle:
    "Get pet care tips, local updates and early access to new features. Join thousands of pet lovers today.",
  cta: "Join Now",
};
