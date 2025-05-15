<template>
    <header class="p-2 flex items-center justify-around sticky top-0 left-0 w-full z-50 bg-[var(--header-bg)] border-b border-default">
        <div class="flex gap-2" @click="navigateTo('/')">
            <img src="~/assets/images/kfupm_logo_en.svg" alt="Logo" class="w-30 cursor-pointer" />
             |
            <img src="~/assets/images/BlueRobotics-Logo-Blue-Black.png" alt="Logo" class="w-30 cursor-pointer"/>
        </div>
        <div class="flex space-between gap-2">
            <ColorModeButton />
            <UNavigationMenu highlight highlight-color="primary" orientation="horizontal" :items="[
                { label: 'Dashboard', icon: 'i-lucide-home', to: '/',  },
                { label: 'Reports', icon: 'i-lucide-file', to: '/reports',  },
                { label: 'About', icon: 'i-lucide-info', to: '/about' },]"
                class="data-[orientation=horizontal]:border-b border-default data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48" />
            <UButton class="w-full mt-2" icon="i-lucide-log-out" :loading="isLoading" variant="subtle" color="error"
                @click="handleLogout" style="cursor: pointer;">Logout</UButton>
        </div>
    </header>
</template>
<script setup lang="ts">

import ColorModeButton from "~/components/ColorModeButton.vue";

const supabase = useSupabaseClient();
const isLoading = ref(false);

const handleLogout = async () => {
    isLoading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout error:", error);
    } else {
        console.log("Logout successful");
        navigateTo("/login");
    }
    isLoading.value = false;
};

</script>