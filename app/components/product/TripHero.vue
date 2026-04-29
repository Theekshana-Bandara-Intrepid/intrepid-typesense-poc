<script setup lang="ts">
defineProps<{
  images: { alt: string; url: string }[]
}>()

const activeIndex = ref(0)
const showGallery = ref(false)
</script>

<template>
  <div class="hero" id="trip-hero">
    <!-- Main large image -->
    <div class="hero-main" @click="activeIndex = 0; showGallery = true">
      <img :src="images[0]?.url" :alt="images[0]?.alt" loading="eager" />
    </div>

    <!-- Thumbnail strip below -->
    <div class="hero-thumbs" v-if="images.length > 1">
      <div
        v-for="(img, i) in images.slice(1, 6)"
        :key="i"
        class="hero-thumb"
        :class="{ active: activeIndex === i + 1 }"
        @click="activeIndex = i + 1; showGallery = true"
      >
        <img :src="img.url" :alt="img.alt" loading="lazy" />
      </div>
      <button v-if="images.length > 6" class="thumb-more" @click="showGallery = true">
        +{{ images.length - 6 }}
      </button>
    </div>

    <!-- Lightbox Gallery -->
    <Teleport to="body">
      <div v-if="showGallery" class="lightbox" @click.self="showGallery = false">
        <button class="lb-close" @click="showGallery = false">&times;</button>
        <button class="lb-nav lb-prev" @click="activeIndex = (activeIndex - 1 + images.length) % images.length">‹</button>
        <img class="lb-image" :src="images[activeIndex].url" :alt="images[activeIndex].alt" />
        <button class="lb-nav lb-next" @click="activeIndex = (activeIndex + 1) % images.length">›</button>
        <p class="lb-counter">{{ activeIndex + 1 }} / {{ images.length }}</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.hero-main {
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-md);
  aspect-ratio: 16 / 9;
  background: var(--gray-100);
}
.hero-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}
.hero-main:hover img { transform: scale(1.03); }

/* Thumbnail strip */
.hero-thumbs {
  display: flex;
  gap: var(--space-2);
}
.hero-thumb {
  flex: 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-sm);
  aspect-ratio: 4 / 3;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
  background: var(--gray-100);
}
.hero-thumb.active,
.hero-thumb:hover {
  border-color: var(--intrepid-red);
}
.hero-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-more {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--gray-600);
  cursor: pointer;
  transition: background var(--transition-fast);
}
.thumb-more:hover { background: var(--gray-200); }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  color: white;
  font-size: 32px;
  z-index: 10;
}
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 48px;
  z-index: 10;
  padding: var(--space-4);
}
.lb-prev { left: var(--space-4); }
.lb-next { right: var(--space-4); }
.lb-image {
  max-width: 85vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}
.lb-counter {
  position: absolute;
  bottom: var(--space-6);
  left: 50%;
  transform: translateX(-50%);
  color: var(--gray-300);
  font-size: var(--font-size-sm);
}

@media (max-width: 640px) {
  .hero-thumbs {
    overflow-x: auto;
  }
  .hero-thumb {
    flex: 0 0 80px;
  }
}
</style>
