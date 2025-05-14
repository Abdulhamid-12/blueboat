<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <img
        src="~/assets/images/kfupm-logo.png"
        alt="Hader Logo"
        class="w-60 mx-auto mb-5"
      />
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        BlueBoat Portal
      </h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <UButton :loading="isLoading" block class="py-2 px-4" type="submit"
          >Login</UButton
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

// const supabase = useSupabaseClient();
// const toast = useToast();
// const isLoading = ref(false);
// const email = ref("");
// const password = ref("");

// onMounted(async () => {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (user) {
//     navigateTo("/");
//   }
// });

const handleLogin = async () => {
//   isLoading.value = true;
//   const { error } = await supabase.auth.signInWithPassword({
//     email: email.value,
//     password: password.value,
//   });

//   if (error) {
//     console.error("Login error:", error);
//     toast.add({
//       title: "Logain failed",
//       description: error.message,
//       color: "error",
//       icon: "ic:baseline-error",
//     });
//   } else {
//     navigateTo("/");
//   }

//   isLoading.value = false;
};
</script>
