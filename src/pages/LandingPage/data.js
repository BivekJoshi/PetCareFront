// Static content for the landing page sections.
// Keeping copy and asset references here keeps the section components
// purely presentational and easy to update.

import productImage from "../../assets/Image3.png";
import serviceSlideGroup from "../../assets/Service.png";
import serviceSlideFood from "../../assets/Image3.png";

export const COLORS = {
  heroBackground: "#FDF7DE",
  whyUsBackground: "#FFDED2",
};

export const HERO = {
  title: "FIND YOUR SMART DOG",
  quote:
    "“A dog is the only thing that can make you smile even on the worst of days”",
  cta: "See Breeds",
  imageAlt: "Smart dog",
};

export const SERVICES = [
  {
    id: "1",
    title: "Training",
    desc: "We believe that every owner and dog should enjoy learning and experiencing new things, so while we ensure your training is professional we make it fun for you and your dog at the same time.",
  },
  {
    id: "2",
    title: "Consultation",
    desc: "Nail trimming is a major part of dog grooming services. A dog’s nails grow and if not cut properly or timely, they can grow wildly and curl. This becomes painful for the dogs and may even pierce the dog’s paws.",
  },
  {
    id: "3",
    title: "Buy & Sell",
    desc: "Depending upon what you are looking for, we have put up a wide range of breeds of puppies for sale. Each breed of puppy is different and so is your needs. We provide a digital footage of the pets for sale before you buy from us",
  },
  {
    id: "4",
    title: "Grooming",
    desc: "You can put your mind at ease that we are treating your special canine to the quality care they deserve. We will never rush through any groom or treatment so during their time at Retreat Dog Grooming they will receive a friendly, positive, and relaxed experience.",
  },
];

export const SERVICE_SLIDES = [
  { label: "Dog group", image: serviceSlideGroup },
  { label: "Dog food", image: serviceSlideFood },
];

export const WHY_US = {
  body: "Welcome to the Yejus Paw. Our range of products available are to suit dogs of all shapes and sizes-from Terriers to Great Danes and everything in between! We have developed our own product ranges and have hand-picked brands that offer products of the highest quality and that all have one thing in common; We’d be happy to feed the products to or use them on our own dogs.",
};

export const PRODUCTS_INTRO =
  "Give your lovely dogs the taste of the best dog foods! We’ve got all your pet supplies with all your dog food necessities. Still pestering google with the “pet shop near me” search? Come on to our pet store where we ensure only quality dog food for your pet’s development.";

const sampleProduct = {
  image: productImage,
  title: "Himalaya Healthy Pet Food for Adult (3 KG)",
  price: "120000",
  oldPrice: "100000",
  discount: "(59% OFF)",
};

export const PRODUCTS = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  ...sampleProduct,
}));
