<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    
    <nav class="bg-white shadow-sm px-6 py-4 mb-8">
      <div class="max-w-6xl mx-auto flex items-center">
        <router-link to="/" class="text-2xl font-black text-blue-600 hover:text-blue-800 transition">
          🎬 Movie Dashboard
        </router-link>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

  </div>
</template>

<script setup>

</script>