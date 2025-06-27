<template>
    <div>
        <h1>Cài Đặt</h1>
        <SettingProfile />
        <SettingPassword />
        <SettingNotification />
        <SettingTheme />
    </div>
</template>

<script setup>
import SettingProfile from '@/components/setting/SettingProfile.vue'
import SettingPassword from '@/components/setting/SettingPassword.vue'
import SettingNotification from '@/components/setting/SettingNotification.vue'
import SettingTheme from '@/components/setting/SettingTheme.vue'
</script>

<style scoped></style>