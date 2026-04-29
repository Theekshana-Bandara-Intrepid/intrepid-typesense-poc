<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/search" class="logo">
        <svg width="100" height="24" viewBox="0 0 130 28" fill="none">
          <circle cx="12" cy="14" r="10" fill="#E41D39"/>
          <text x="28" y="20" fill="#E41D39" font-size="20" font-weight="700" font-family="Inter, sans-serif">intrepid</text>
        </svg>
      </NuxtLink>
      <nav class="nav-links">
        <NuxtLink to="/search" class="nav-link">Destinations</NuxtLink>
        <NuxtLink to="/search" class="nav-link">Ways to travel</NuxtLink>
        <NuxtLink to="/search" class="nav-link">Deals</NuxtLink>
        <NuxtLink to="/search" class="nav-link">About</NuxtLink>
      </nav>
      <div class="nav-actions">
        <div class="search-input-wrapper">
          <input type="text" placeholder="Search" class="header-search-input" />
          <button class="search-icon-btn">
            <Icon name="lucide:search" size="16" />
          </button>
        </div>
        <button class="icon-btn" aria-label="Wishlist">
          <Icon name="lucide:heart" size="18" />
        </button>
        <button class="icon-btn" aria-label="Account">
          <Icon name="lucide:user" size="18" />
        </button>
        <button class="icon-btn" aria-label="Contact">
          <Icon name="lucide:phone" size="18" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: var(--header-height);
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}
.logo { display: flex; align-items: center; }
.nav-links {
  display: flex;
  gap: var(--space-4);
  flex: 1;
}
.nav-link {
  color: var(--gray-800);
  font-size: 13px;
  font-weight: 600;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.nav-link:hover { color: var(--intrepid-red); }
.nav-actions { 
  display: flex; 
  align-items: center;
  gap: var(--space-3); 
}
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.header-search-input {
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  padding: 6px 36px 6px 16px;
  font-size: 13px;
  width: 200px;
  outline: none;
  transition: border-color var(--transition-fast);
}
.header-search-input:focus {
  border-color: var(--gray-500);
}
.search-icon-btn {
  position: absolute;
  right: 8px;
  color: var(--gray-500);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn {
  color: var(--gray-800);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: background var(--transition-fast), color var(--transition-fast);
  background: none;
  border: none;
  cursor: pointer;
}
.icon-btn:hover { 
  background: var(--gray-100); 
  color: var(--intrepid-red);
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .search-input-wrapper { display: none; }
}
</style>
