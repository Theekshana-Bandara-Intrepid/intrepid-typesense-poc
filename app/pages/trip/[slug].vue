<script setup lang="ts">
const route = useRoute()
useHead({ title: 'Best of Sri Lanka — 15 Days | Intrepid Travel' })

const trip = reactive({
  name: 'Best of Sri Lanka',
  productCode: 'HPSH',
  duration: 15,
  destinations: ['Sri Lanka'],
  startCity: 'Negombo',
  endCity: 'Colombo',
  ageRange: '15-99',
  maxGroupSize: 15,
  physicalRating: 3,
  rating: 4.9,
  reviewCount: 617,
  price: 3335,
  styles: ['Original'],
  themes: ['Explorer'],
  mapUrl: 'https://placehold.co/800x500/e8f4e8/333333?text=Sri+Lanka+Route+Map',
  mapAlt: 'Map of Best Of Sri Lanka including Sri Lanka',
  productImages: [
    { alt: 'Sigiriya sunset in Sri Lanka', url: 'https://placehold.co/800x600/2196F3/ffffff?text=Sigiriya+Sunset' },
    { alt: 'Lion Rock Fortress', url: 'https://placehold.co/400x300/FF9800/ffffff?text=Lion+Rock' },
    { alt: 'Group at Sigiriya', url: 'https://placehold.co/400x300/4CAF50/ffffff?text=Group+Tour' },
    { alt: 'Jungle walk', url: 'https://placehold.co/400x300/795548/ffffff?text=Jungle+Walk' },
    { alt: 'Coconut Plantation', url: 'https://placehold.co/400x300/8BC34A/ffffff?text=Coconut+Plantation' },
    { alt: 'Temple of the Tooth', url: 'https://placehold.co/400x300/9C27B0/ffffff?text=Temple' },
    { alt: 'Market in Kandy', url: 'https://placehold.co/400x300/E91E63/ffffff?text=Kandy+Market' },
    { alt: 'Kandian dancers', url: 'https://placehold.co/400x300/00BCD4/ffffff?text=Dancers' },
  ],
  highlights: [
    'Climb the ancient Sigiriya Lion Rock Fortress at sunrise',
    'Ride the iconic scenic train through Sri Lanka\'s hill country',
    'Explore the sacred Temple of the Tooth in Kandy',
    'Discover the ancient city of Anuradhapura by bicycle',
    'Enjoy a cooking class and home-cooked meal in Bandarawela',
    'Walk through the colonial streets of Galle Fort',
    'Spot elephants on a safari in Udawalawe National Park',
    'Learn the art of traditional Beeralu lace weaving',
  ],
  inclusions: [
    'Accommodation (14 nights hotel/guesthouse)',
    'Transport (private minibus, scenic train, tuk-tuk)',
    'Meals (14 breakfasts, 3 lunches, 2 dinners)',
    'Dedicated group leader throughout the trip',
    'Sigiriya Lion Rock Fortress entry',
    'Temple of the Tooth entry',
    'Dambulla Cave Temples entry',
    'Anuradhapura bike tour',
    'Polonnaruwa bike tour',
    'Cooking demonstration and local meal',
    'Galle walking tour',
    'Colombo city tour by bus',
  ],
  exclusions: [
    'International flights',
    'Travel insurance',
    'Visa fees',
    'Optional activities not listed',
    'Personal expenses and tips',
    'Meals not mentioned in the itinerary',
  ],
  itinerary: [
    { day: 1, title: 'Arrive Negombo', description: 'Welcome to Sri Lanka! Arrive at Bandaranaike International Airport and transfer to your hotel in Negombo. Meet your group leader and fellow travellers at a welcome meeting this evening.', accommodation: 'Hotel Marinha', meals: [], activities: ['Welcome meeting'] },
    { day: 2, title: 'Negombo to Anuradhapura', description: 'Head north to the ancient capital of Anuradhapura. Visit the sacred Bodhi Tree, one of the oldest historically authenticated trees in the world. Explore the ancient ruins by bicycle.', accommodation: 'Milano Tourist Rest', meals: ['Breakfast'], activities: ['Bodhi Tree Temple', 'Bike tour'] },
    { day: 3, title: 'Anuradhapura to Polonnaruwa', description: 'Continue to the medieval capital of Polonnaruwa. Explore the remarkably well-preserved ruins of this UNESCO World Heritage site by bicycle.', accommodation: 'Hotel & Restaurant Neem', meals: ['Breakfast'], activities: ['Polonnaruwa Bike Tour'] },
    { day: 4, title: 'Polonnaruwa to Dambulla', description: 'Travel to the cultural heart of Sri Lanka. Visit the iconic Dambulla Cave Temples, featuring stunning Buddhist murals and over 150 Buddha statues. Stop at a local spice garden.', accommodation: 'Sundaras Resort', meals: ['Breakfast'], activities: ['Cave Temples', 'Spice Garden'] },
    { day: 5, title: 'Sigiriya', description: 'Rise early for the highlight of the trip — the climb up Sigiriya Lion Rock Fortress. This 5th-century rock citadel rises 200 metres above the surrounding jungle. The views from the top are breathtaking.', accommodation: 'Sundaras Resort', meals: ['Breakfast'], activities: ['Lion Rock Fortress'] },
    { day: 6, title: 'Dambulla to Kandy', description: 'Travel to Kandy, the cultural capital set among misty hills. Visit the sacred Temple of the Tooth, which houses a relic of the Buddha. Explore the bustling Kandy market.', accommodation: 'Sevana City Hotel', meals: ['Breakfast'], activities: ['Temple of the Tooth', 'Market tour'] },
    { day: 7, title: 'Kandy', description: 'Visit a tea factory in the hills above Kandy to learn about Ceylon tea production. Afternoon at leisure to explore the city. Optional cultural dance performance in the evening.', accommodation: 'Sevana City Hotel', meals: ['Breakfast'], activities: ['Tea factory visit'] },
    { day: 8, title: 'Kandy to Bandarawela', description: 'Board the famous scenic train for one of the most beautiful rail journeys in the world. Wind through emerald tea plantations and misty mountains to Bandarawela.', accommodation: 'Orient Hotel', meals: ['Breakfast'], activities: ['Scenic train ride'] },
    { day: 9, title: 'Bandarawela', description: 'Enjoy a cooking demonstration and traditional Sri Lankan meal with a local family. Hike a section of the Pekoe Trail through stunning tea country landscapes.', accommodation: 'Orient Hotel', meals: ['Breakfast', 'Lunch'], activities: ['Cooking demo', 'Pekoe Trail hike'] },
    { day: 10, title: 'Bandarawela to Haputale', description: 'Travel to the hilltop town of Haputale for panoramic views. Visit Lipton\'s Seat, where Sir Thomas Lipton surveyed his tea empire. Walk through lush tea plantations.', accommodation: 'Leisure Mount View', meals: ['Breakfast'], activities: ['Lipton\'s Seat visit'] },
    { day: 11, title: 'Haputale to Udawalawe', description: 'Descend from the highlands to Udawalawe National Park. Stay at a rustic jungle camp and enjoy the sounds of the wild. Prepare for tomorrow\'s safari.', accommodation: 'Udawalawe Jungle Camp', meals: ['Breakfast', 'Dinner'], activities: [] },
    { day: 12, title: 'Udawalawe to Mirissa', description: 'Early morning safari in Udawalawe National Park, famous for its elephant herds. Continue south to the coastal town of Mirissa for beach time and fresh seafood.', accommodation: 'Lavendish Beach Resort', meals: ['Breakfast'], activities: ['Safari'] },
    { day: 13, title: 'Mirissa', description: 'Free day to relax on Mirissa beach, go surfing, or join an optional whale-watching excursion. Enjoy fresh seafood at a beachside restaurant.', accommodation: 'Lavendish Beach Resort', meals: ['Breakfast'], activities: [] },
    { day: 14, title: 'Mirissa to Galle', description: 'Travel along the coast to the historic fort town of Galle. Take a guided walking tour through the UNESCO-listed Galle Fort. Try your hand at traditional Beeralu lace weaving.', accommodation: 'Fort Inn Guest House', meals: ['Breakfast'], activities: ['Walking tour', 'Lace weaving'] },
    { day: 15, title: 'Galle to Colombo — Departure', description: 'Travel to Colombo for a city tour by bus through the capital. The trip ends after the city tour. Onward travel arrangements can be made.', accommodation: '', meals: ['Breakfast'], activities: ['City tour by bus'] },
  ],
  reviews: [
    { author: 'Sarah M.', date: 'March 2026', rating: 5, title: 'Trip of a lifetime!', comment: 'This was my first Intrepid tour and it was absolutely incredible. Our group leader Dodan was knowledgeable, fun, and made everyone feel welcome. The Sigiriya sunrise climb was unforgettable.' },
    { author: 'James K.', date: 'February 2026', rating: 5, title: 'Perfect balance of culture and adventure', comment: 'The itinerary was perfectly paced. Loved the train ride to Bandarawela — the scenery was jaw-dropping. The cooking class with the local family was a genuine highlight. Highly recommend.' },
    { author: 'Emma L.', date: 'January 2026', rating: 4, title: 'Amazing experience, a few long travel days', comment: 'Sri Lanka is beautiful and this trip covers all the highlights. Some travel days were quite long, but the destinations made it worthwhile. The elephant safari was magical.' },
  ],
  departures: [
    { id: 'd1', startDate: 'Thu May 7, 2026', endDate: 'Thu May 21, 2026', status: 'request', price: 1440, originalPrice: 1600, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd2', startDate: 'Fri May 8, 2026', endDate: 'Fri May 22, 2026', status: 'request', price: 1641, originalPrice: 1823, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd3', startDate: 'Sat May 9, 2026', endDate: 'Sat May 23, 2026', status: 'limited', spacesLeft: 2, price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd4', startDate: 'Sun May 10, 2026', endDate: 'Sun May 24, 2026', status: 'limited', spacesLeft: 1, price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd5', startDate: 'Mon May 11, 2026', endDate: 'Mon May 25, 2026', status: 'request', price: 1471, originalPrice: 1634, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd6', startDate: 'Tue May 12, 2026', endDate: 'Tue May 26, 2026', status: 'request', price: 1890, originalPrice: 2100, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd7', startDate: 'Thu May 14, 2026', endDate: 'Thu May 28, 2026', status: 'limited', spacesLeft: 2, price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd8', startDate: 'Fri May 15, 2026', endDate: 'Fri May 29, 2026', status: 'request', price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd9', startDate: 'Sat May 16, 2026', endDate: 'Sat May 30, 2026', status: 'limited', spacesLeft: 3, price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
    { id: 'd10', startDate: 'Sun May 17, 2026', endDate: 'Sun May 31, 2026', status: 'limited', spacesLeft: 1, price: 1654, originalPrice: 1838, onSale: true, saleBadge: 'LAST MINUTE' },
  ]
})
</script>

<template>
  <div class="product-page">
    <ProductPricingStickyBar :name="trip.name" :price="trip.price" currency="USD" />

    <div class="breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span class="bc-sep">></span>
      <NuxtLink to="/search">Asia</NuxtLink>
      <span class="bc-sep">></span>
      <NuxtLink to="/search">Sri Lanka</NuxtLink>
      <span class="bc-sep">></span>
      <span>{{ trip.name }}</span>
    </div>

    <!-- Title Section -->
    <div class="title-section">
      <h1 class="trip-title">{{ trip.name }}</h1>
      <div class="title-badges">
        <SearchStyleBadge :trip-style="trip.styles[0]" />
      </div>
    </div>

    <!-- Hero & Summary Layout -->
    <div class="top-layout">
      <div class="top-main">
        <ProductTripHero :images="trip.productImages" />
      </div>
      <div class="top-sidebar">
        <ProductSummaryBox
          :rating="trip.rating"
          :review-count="trip.reviewCount"
          :product-code="trip.productCode"
          :duration="trip.duration"
          :start-city="trip.startCity"
          :end-city="trip.endCity"
          :min-age="trip.ageRange"
          :physical-rating="trip.physicalRating"
          :styles="trip.styles"
          :price="trip.price"
          currency="USD"
        />
      </div>
    </div>

    <ProductTripHighlights :highlights="trip.highlights" />

    <ProductItineraryAccordion
      :days="trip.itinerary"
      :map-url="trip.mapUrl"
      :map-alt="trip.mapAlt"
    />

    <ProductInclusionsList :inclusions="trip.inclusions" :exclusions="trip.exclusions" />

    <ProductDatesAndPrices :departures="trip.departures" currency="USD" />
  </div>
</template>

<style scoped>
.product-page {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}
.breadcrumb a { color: var(--gray-600); }
.breadcrumb a:hover { color: var(--intrepid-red); }
.bc-sep { color: var(--gray-400); font-size: 10px; }

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-4);
}
.trip-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
}
.title-badges {
  display: flex;
  align-items: center;
}

.top-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  align-items: flex-start;
}
.top-main {
  min-width: 0;
}

@media (max-width: 900px) {
  .top-layout {
    grid-template-columns: 1fr;
  }
}
</style>
