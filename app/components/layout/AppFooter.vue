<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">intrepid</span>
        <p class="footer-tagline">Real life experiences for travellers with Intrepid Travel.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#">Destinations</a>
          <a href="#">Travel Styles</a>
          <a href="#">Deals &amp; Offers</a>
        </div>
        <div class="footer-col">
          <h4>About</h4>
          <a href="#">Our Story</a>
          <a href="#">Responsible Travel</a>
          <a href="#">Contact Us</a>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <a href="#">FAQs</a>
          <a href="#">Travel Alerts</a>
          <a href="#">Booking Conditions</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Intrepid Travel. Typesense POC Demo.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--gray-900);
  color: var(--gray-300);
  padding: var(--space-12) 0 var(--space-6);
  margin-top: var(--space-16);
}
.footer-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
.footer-brand { margin-bottom: var(--space-8); }
.footer-logo {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--white);
}
.footer-tagline {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--gray-400);
}
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}
.footer-col h4 {
  color: var(--white);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-3);
}
.footer-col a {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--gray-400);
  padding: var(--space-1) 0;
  transition: color var(--transition-fast);
}
.footer-col a:hover { color: var(--white); }
.footer-bottom {
  border-top: 1px solid var(--gray-700);
  padding-top: var(--space-6);
  font-size: var(--font-size-xs);
  color: var(--gray-500);
}
@media (max-width: 640px) {
  .footer-links { grid-template-columns: 1fr; }
}
</style>
